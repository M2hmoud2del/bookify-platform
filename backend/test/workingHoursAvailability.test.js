import assert from "node:assert/strict";
import test from "node:test";

import express from "express";
import mongoose from "mongoose";
import request from "supertest";

import app from "../src/app.js";
import authorizeMiddleware from "../src/middleware/authorize.middleware.js";
import { getAvailability } from "../src/modules/availability/availability.service.js";
import { generateSlots } from "../src/modules/workingHours/slot.generator.js";
import {
  getProviderWorkingHours,
  normalizeWorkingHoursInput,
  updateMyWorkingHours
} from "../src/modules/workingHours/workingHours.service.js";

const providerId = new mongoose.Types.ObjectId().toString();
const serviceId = new mongoose.Types.ObjectId().toString();
const fixedNow = new Date("2099-07-01T12:00:00.000Z");

const createProviderService = (overrides = {}) => ({
  _id: serviceId,
  provider: providerId,
  isActive: true,
  durationMinutes: 45,
  ...overrides
});

const createAvailabilityRepository = ({
  service = createProviderService(),
  providerProfile = { timezone: "UTC" },
  workingHour = {
    isClosed: false,
    startTime: "09:00",
    endTime: "12:00",
    slotIntervalMinutes: 30,
    breaks: []
  },
  appointments = []
} = {}) => ({
  findProviderProfileByUserId: async () => providerProfile,
  findServiceById: async () => service,
  findWorkingHourByProviderAndDay: async () => workingHour,
  findActiveAppointmentsForDate: async () => appointments
});

test("provider can update working hours", async () => {
  const savedWorkingHours = [];
  const repository = {
    upsertWorkingHours: async (savedProviderId, workingHours) => {
      assert.equal(String(savedProviderId), String(providerId));
      savedWorkingHours.push(...workingHours);
    },
    findWorkingHoursByProvider: async () => savedWorkingHours
  };

  const result = await updateMyWorkingHours(
    providerId,
    [
      {
        dayOfWeek: "sunday",
        startTime: "09:00",
        endTime: "17:00",
        isClosed: false,
        slotIntervalMinutes: 30,
        breaks: [{ startTime: "13:00", endTime: "14:00" }]
      }
    ],
    { repository }
  );

  assert.equal(result.success, true);
  assert.equal(result.data.workingHours.length, 7);
  assert.equal(result.data.workingHours[0].dayOfWeek, "sunday");
  assert.equal(result.data.workingHours[0].isClosed, false);
});

test("customer cannot update working hours", async () => {
  const testApp = express();

  testApp.put(
    "/working-hours/my",
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

  const response = await request(testApp).put("/working-hours/my").send({});

  assert.equal(response.status, 403);
  assert.equal(response.body.success, false);
});

test("unauthenticated user cannot update working hours", async () => {
  const response = await request(app).put("/api/v1/working-hours/my").send({
    workingHours: [{ dayOfWeek: "sunday", isClosed: true }]
  });

  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
});

test("availability returns empty slots when provider is closed", async () => {
  const result = await getAvailability(
    { providerId, serviceId, date: "2099-07-10" },
    {
      now: fixedNow,
      repository: createAvailabilityRepository({
        workingHour: { isClosed: true }
      })
    }
  );

  assert.equal(result.success, true);
  assert.deepEqual(result.data.slots, []);
});

test("availability returns slots when provider is open", async () => {
  const result = await getAvailability(
    { providerId, serviceId, date: "2099-07-10" },
    { now: fixedNow, repository: createAvailabilityRepository() }
  );

  assert.equal(result.success, true);
  assert.deepEqual(result.data.slots.slice(0, 2), [
    { startTime: "09:00", endTime: "09:45", available: true },
    { startTime: "09:30", endTime: "10:15", available: true }
  ]);
});

test("availability excludes break times", async () => {
  const result = await getAvailability(
    { providerId, serviceId, date: "2099-07-10" },
    {
      now: fixedNow,
      repository: createAvailabilityRepository({
        workingHour: {
          isClosed: false,
          startTime: "09:00",
          endTime: "12:00",
          slotIntervalMinutes: 30,
          breaks: [{ startTime: "10:00", endTime: "11:00" }]
        }
      })
    }
  );

  assert.deepEqual(result.data.slots, [
    { startTime: "09:00", endTime: "09:45", available: true },
    { startTime: "11:00", endTime: "11:45", available: true }
  ]);
});

test("availability excludes existing confirmed appointments", () => {
  const slots = generateSlots({
    startTime: "09:00",
    endTime: "11:00",
    durationMinutes: 30,
    slotIntervalMinutes: 30,
    breaks: [],
    existingAppointments: [{ startTime: "09:30", endTime: "10:00", status: "confirmed" }],
    date: "2099-07-10"
  });

  assert.deepEqual(slots, [
    { startTime: "09:00", endTime: "09:30", available: true },
    { startTime: "10:00", endTime: "10:30", available: true },
    { startTime: "10:30", endTime: "11:00", available: true }
  ]);
});

test("availability excludes existing pending_payment appointments", () => {
  const slots = generateSlots({
    startTime: "09:00",
    endTime: "10:30",
    durationMinutes: 30,
    slotIntervalMinutes: 30,
    breaks: [],
    existingAppointments: [{ startTime: "09:00", endTime: "09:30", status: "pending_payment" }],
    date: "2099-07-10"
  });

  assert.deepEqual(slots, [
    { startTime: "09:30", endTime: "10:00", available: true },
    { startTime: "10:00", endTime: "10:30", available: true }
  ]);
});

test("availability ignores cancelled appointments", () => {
  const slots = generateSlots({
    startTime: "09:00",
    endTime: "10:00",
    durationMinutes: 30,
    slotIntervalMinutes: 30,
    breaks: [],
    existingAppointments: [{ startTime: "09:00", endTime: "09:30", status: "cancelled" }],
    date: "2099-07-10"
  });

  assert.deepEqual(slots, [
    { startTime: "09:00", endTime: "09:30", available: true },
    { startTime: "09:30", endTime: "10:00", available: true }
  ]);
});

test("availability rejects invalid date", async () => {
  await assert.rejects(
    () =>
      getAvailability(
        { providerId, serviceId, date: "2099-02-30" },
        { now: fixedNow, repository: createAvailabilityRepository() }
      ),
    /YYYY-MM-DD/
  );
});

test("availability rejects invalid providerId and serviceId", async () => {
  await assert.rejects(
    () =>
      getAvailability(
        { providerId: "bad-provider", serviceId, date: "2099-07-10" },
        { now: fixedNow, repository: createAvailabilityRepository() }
      ),
    /Invalid providerId/
  );

  await assert.rejects(
    () =>
      getAvailability(
        { providerId, serviceId: "bad-service", date: "2099-07-10" },
        { now: fixedNow, repository: createAvailabilityRepository() }
      ),
    /Invalid serviceId/
  );
});

test("availability rejects inactive service", async () => {
  await assert.rejects(
    () =>
      getAvailability(
        { providerId, serviceId, date: "2099-07-10" },
        {
          now: fixedNow,
          repository: createAvailabilityRepository({
            service: createProviderService({ isActive: false })
          })
        }
      ),
    /inactive/
  );
});

test("working hours validation rejects invalid breaks", () => {
  assert.throws(
    () =>
      normalizeWorkingHoursInput([
        {
          dayOfWeek: "monday",
          startTime: "09:00",
          endTime: "17:00",
          isClosed: false,
          breaks: [{ startTime: "08:00", endTime: "09:30" }]
        }
      ]),
    /inside working hours/
  );
});

test("working hours validation rejects overlapping breaks", () => {
  assert.throws(
    () =>
      normalizeWorkingHoursInput([
        {
          dayOfWeek: "monday",
          startTime: "09:00",
          endTime: "17:00",
          isClosed: false,
          breaks: [
            { startTime: "13:00", endTime: "14:00" },
            { startTime: "13:30", endTime: "14:30" }
          ]
        }
      ]),
    /must not overlap/
  );
});

test("working hours validation allows adjacent breaks", () => {
  const result = normalizeWorkingHoursInput([
    {
      dayOfWeek: "monday",
      startTime: "09:00",
      endTime: "17:00",
      isClosed: false,
      breaks: [
        { startTime: "13:00", endTime: "14:00" },
        { startTime: "14:00", endTime: "15:00" }
      ]
    }
  ]);

  assert.equal(result[0].breaks.length, 2);
});

test("working hours are returned in weekday order", async () => {
  const repository = {
    findWorkingHoursByProvider: async () => [
      { dayOfWeek: "wednesday", isClosed: true, breaks: [] },
      { dayOfWeek: "sunday", isClosed: true, breaks: [] }
    ]
  };

  const result = await updateMyWorkingHours(providerId, [{ dayOfWeek: "sunday", isClosed: true }], {
    repository: {
      upsertWorkingHours: async () => {},
      findWorkingHoursByProvider: repository.findWorkingHoursByProvider
    }
  });

  assert.deepEqual(
    result.data.workingHours.map((workingHour) => workingHour.dayOfWeek),
    ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  );
});

test("public working hours returns 404 for non-existing provider", async () => {
  await assert.rejects(
    () =>
      getProviderWorkingHours(providerId, {
        repository: {
          findProviderProfileByUserId: async () => null,
          findWorkingHoursByProvider: async () => []
        }
      }),
    /Provider not found/
  );
});

test("availability rejects date beyond MAX_BOOKING_DAYS_AHEAD", async () => {
  await assert.rejects(
    () =>
      getAvailability(
        { providerId, serviceId, date: "2099-09-15" },
        { now: fixedNow, repository: createAvailabilityRepository() }
      ),
    /60 days ahead/
  );
});

test("availability rejects past date", async () => {
  await assert.rejects(
    () =>
      getAvailability(
        { providerId, serviceId, date: "2099-06-30" },
        { now: fixedNow, repository: createAvailabilityRepository() }
      ),
    /past/
  );
});

test("availability allows today", async () => {
  const result = await getAvailability(
    { providerId, serviceId, date: "2099-07-01" },
    {
      now: fixedNow,
      repository: createAvailabilityRepository({
        workingHour: {
          isClosed: false,
          startTime: "13:00",
          endTime: "15:00",
          slotIntervalMinutes: 30,
          breaks: []
        }
      })
    }
  );

  assert.equal(result.success, true);
});

test("availability skips past slots for provider timezone", async () => {
  const result = await getAvailability(
    { providerId, serviceId, date: "2026-07-06" },
    {
      now: new Date("2026-07-06T10:30:00.000Z"),
      repository: createAvailabilityRepository({
        providerProfile: { timezone: "Africa/Cairo" },
        service: createProviderService({ durationMinutes: 30 }),
        workingHour: {
          isClosed: false,
          startTime: "13:00",
          endTime: "15:00",
          slotIntervalMinutes: 30,
          breaks: []
        }
      })
    }
  );

  assert.deepEqual(result.data.slots, [
    { startTime: "14:00", endTime: "14:30", available: true },
    { startTime: "14:30", endTime: "15:00", available: true }
  ]);
});

test("availability uses provider timezone instead of UTC day for today checks", async () => {
  const result = await getAvailability(
    { providerId, serviceId, date: "2026-07-06" },
    {
      now: new Date("2026-07-07T06:30:00.000Z"),
      repository: createAvailabilityRepository({
        providerProfile: { timezone: "America/Los_Angeles" },
        service: createProviderService({ durationMinutes: 30 }),
        workingHour: {
          isClosed: false,
          startTime: "22:00",
          endTime: "23:00",
          slotIntervalMinutes: 30,
          breaks: []
        }
      })
    }
  );

  assert.deepEqual(result.data.slots, []);
});
