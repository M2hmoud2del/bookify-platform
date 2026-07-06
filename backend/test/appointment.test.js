import assert from "node:assert/strict";
import test from "node:test";

import express from "express";
import mongoose from "mongoose";
import request from "supertest";

import app from "../src/app.js";
import authorizeMiddleware from "../src/middleware/authorize.middleware.js";
import {
  cancelAppointment,
  completeAppointment,
  createAppointment,
  getAppointmentById,
  getMyAppointments,
  getProviderAppointments,
  rejectAppointment
} from "../src/modules/appointment/appointment.service.js";

const customerId = new mongoose.Types.ObjectId().toString();
const otherCustomerId = new mongoose.Types.ObjectId().toString();
const providerId = new mongoose.Types.ObjectId().toString();
const otherProviderId = new mongoose.Types.ObjectId().toString();
const serviceId = new mongoose.Types.ObjectId().toString();
const appointmentId = new mongoose.Types.ObjectId().toString();
const fixedNow = new Date("2099-07-01T10:00:00.000Z");

const createService = (overrides = {}) => ({
  _id: serviceId,
  provider: providerId,
  isActive: true,
  durationMinutes: 45,
  ...overrides
});

const createWorkingHour = (overrides = {}) => ({
  isClosed: false,
  startTime: "09:00",
  endTime: "17:00",
  slotIntervalMinutes: 30,
  breaks: [],
  ...overrides
});

const createAppointmentRecord = (overrides = {}) => ({
  _id: appointmentId,
  customer: customerId,
  provider: providerId,
  service: serviceId,
  localDate: "2099-07-10",
  startTime: "09:00",
  endTime: "09:45",
  timezone: "UTC",
  status: "pending_payment",
  paymentStatus: "unpaid",
  ...overrides
});

const createRepository = ({
  service = createService(),
  providerProfile = { timezone: "UTC" },
  workingHour = createWorkingHour(),
  blockingAppointments = [],
  appointment = createAppointmentRecord()
} = {}) => ({
  createAppointment: async (data) => ({ _id: appointmentId, ...data }),
  findAppointmentById: async () => appointment,
  findBlockingAppointments: async () => blockingAppointments,
  findCustomerAppointments: async () => [appointment],
  findProviderAppointments: async () => [appointment],
  findProviderProfileByUserId: async () => providerProfile,
  findServiceById: async () => service,
  findWorkingHourByProviderAndDay: async () => workingHour,
  updateAppointmentStatus: async (id, updateData) => ({
    ...appointment,
    ...updateData
  })
});

const validPayload = {
  providerId,
  serviceId,
  date: "2099-07-10",
  startTime: "09:00",
  notes: "Optional notes"
};

test("customer can create appointment for available slot", async () => {
  const result = await createAppointment(customerId, validPayload, {
    now: fixedNow,
    repository: createRepository()
  });

  assert.equal(result.success, true);
  assert.equal(result.data.status, "pending_payment");
  assert.equal(result.data.paymentStatus, "unpaid");
  assert.equal(result.data.endTime, "09:45");
  assert.equal(result.data.localDate, "2099-07-10");
});

test("provider cannot create appointment as customer", async () => {
  const testApp = express();

  testApp.post(
    "/appointments",
    (req, res, next) => {
      req.user = { role: "provider" };
      next();
    },
    authorizeMiddleware("customer"),
    (req, res) => res.status(201).json({ success: true })
  );

  testApp.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  });

  const response = await request(testApp).post("/appointments").send(validPayload);

  assert.equal(response.status, 403);
});

test("unauthenticated user cannot create appointment", async () => {
  const response = await request(app).post("/api/appointments").send(validPayload);

  assert.equal(response.status, 401);
});

test("appointment creation rejects inactive service", async () => {
  await assert.rejects(
    () =>
      createAppointment(customerId, validPayload, {
        now: fixedNow,
        repository: createRepository({
          service: createService({ isActive: false })
        })
      }),
    /inactive/
  );
});

test("appointment creation rejects service not owned by provider", async () => {
  await assert.rejects(
    () =>
      createAppointment(customerId, validPayload, {
        now: fixedNow,
        repository: createRepository({
          service: createService({ provider: otherProviderId })
        })
      }),
    /does not belong/
  );
});

test("appointment creation rejects past date", async () => {
  await assert.rejects(
    () =>
      createAppointment(
        customerId,
        { ...validPayload, date: "2099-06-30" },
        { now: fixedNow, repository: createRepository() }
      ),
    /past/
  );
});

test("appointment creation rejects date beyond MAX_BOOKING_DAYS_AHEAD", async () => {
  await assert.rejects(
    () =>
      createAppointment(
        customerId,
        { ...validPayload, date: "2099-09-15" },
        { now: fixedNow, repository: createRepository() }
      ),
    /60 days ahead/
  );
});

test("appointment creation rejects slot outside working hours", async () => {
  await assert.rejects(
    () =>
      createAppointment(
        customerId,
        { ...validPayload, startTime: "08:00" },
        { now: fixedNow, repository: createRepository() }
      ),
    /outside provider working hours/
  );
});

test("appointment creation rejects slot during break", async () => {
  await assert.rejects(
    () =>
      createAppointment(customerId, { ...validPayload, startTime: "13:00" }, {
        now: fixedNow,
        repository: createRepository({
          workingHour: createWorkingHour({
            breaks: [{ startTime: "13:00", endTime: "14:00" }]
          })
        })
      }),
    /break/
  );
});

test("appointment creation prevents double booking", async () => {
  await assert.rejects(
    () =>
      createAppointment(customerId, validPayload, {
        now: fixedNow,
        repository: createRepository({
          blockingAppointments: [
            createAppointmentRecord({
              startTime: "09:30",
              endTime: "10:15",
              status: "confirmed"
            })
          ]
        })
      }),
    /no longer available/
  );
});

test("pending_payment appointment blocks the slot", async () => {
  await assert.rejects(
    () =>
      createAppointment(customerId, validPayload, {
        now: fixedNow,
        repository: createRepository({
          blockingAppointments: [
            createAppointmentRecord({
              startTime: "09:00",
              endTime: "09:45",
              status: "pending_payment"
            })
          ]
        })
      }),
    /no longer available/
  );
});

test("confirmed appointment blocks the slot", async () => {
  await assert.rejects(
    () =>
      createAppointment(customerId, validPayload, {
        now: fixedNow,
        repository: createRepository({
          blockingAppointments: [
            createAppointmentRecord({
              startTime: "09:00",
              endTime: "09:45",
              status: "confirmed"
            })
          ]
        })
      }),
    /no longer available/
  );
});

test("cancelled appointment does not block the slot", async () => {
  const result = await createAppointment(customerId, validPayload, {
    now: fixedNow,
    repository: createRepository({
      blockingAppointments: []
    })
  });

  assert.equal(result.success, true);
});

test("customer can view own appointments", async () => {
  const result = await getMyAppointments(customerId, {}, {
    repository: createRepository()
  });

  assert.equal(result.data.appointments.length, 1);
});

test("customer cannot view another customer appointment", async () => {
  await assert.rejects(
    () =>
      getAppointmentById(
        { _id: otherCustomerId, role: "customer" },
        appointmentId,
        { repository: createRepository() }
      ),
    /Forbidden/
  );
});

test("provider can view own provider appointments", async () => {
  const result = await getProviderAppointments(providerId, {}, {
    repository: createRepository()
  });

  assert.equal(result.data.appointments.length, 1);
});

test("customer cannot access provider appointment list", async () => {
  const testApp = express();

  testApp.get(
    "/appointments/provider",
    (req, res, next) => {
      req.user = { role: "customer" };
      next();
    },
    authorizeMiddleware("provider"),
    (req, res) => res.status(200).json({ success: true })
  );

  testApp.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  });

  const response = await request(testApp).get("/appointments/provider");

  assert.equal(response.status, 403);
});

test("provider cannot access another provider appointment details", async () => {
  await assert.rejects(
    () =>
      getAppointmentById(
        { _id: otherProviderId, role: "provider" },
        appointmentId,
        { repository: createRepository() }
      ),
    /Forbidden/
  );
});

test("customer can cancel own appointment", async () => {
  const result = await cancelAppointment(
    { _id: customerId, role: "customer" },
    appointmentId,
    "Need to reschedule",
    { repository: createRepository() }
  );

  assert.equal(result.data.appointment.status, "cancelled");
  assert.equal(result.data.appointment.cancellationReason, "Need to reschedule");
});

test("provider can reject own appointment", async () => {
  const result = await rejectAppointment(providerId, appointmentId, "Unavailable", {
    repository: createRepository()
  });

  assert.equal(result.data.appointment.status, "rejected");
  assert.equal(result.data.appointment.rejectionReason, "Unavailable");
});

test("provider can complete own confirmed appointment only after appointment time", async () => {
  const result = await completeAppointment(providerId, appointmentId, {
    now: new Date("2099-07-10T11:00:00.000Z"),
    repository: createRepository({
      appointment: createAppointmentRecord({
        status: "confirmed",
        localDate: "2099-07-10",
        startTime: "09:00",
        endTime: "09:45",
        timezone: "UTC"
      })
    })
  });

  assert.equal(result.data.appointment.status, "completed");
});

test("provider cannot complete pending_payment appointment", async () => {
  await assert.rejects(
    () =>
      completeAppointment(providerId, appointmentId, {
        now: new Date("2099-07-10T11:00:00.000Z"),
        repository: createRepository()
      }),
    /Only confirmed/
  );
});

test("invalid ObjectId returns validation error", async () => {
  await assert.rejects(
    () =>
      getAppointmentById(
        { _id: customerId, role: "customer" },
        "invalid-id",
        { repository: createRepository() }
      ),
    /Invalid appointment id/
  );
});
