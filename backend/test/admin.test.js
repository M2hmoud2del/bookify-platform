import assert from "node:assert/strict";
import test from "node:test";

import express from "express";
import mongoose from "mongoose";
import request from "supertest";

import app from "../src/app.js";
import authorizeMiddleware from "../src/middleware/authorize.middleware.js";
import {
  getAdminDashboard,
  getAppointments,
  getPayments,
  getProviders,
  getReviews,
  getUsers,
  updateProviderVerification,
  updateUserStatus
} from "../src/modules/admin/admin.service.js";

const adminId = new mongoose.Types.ObjectId().toString();
const userId = new mongoose.Types.ObjectId().toString();
const providerProfileId = new mongoose.Types.ObjectId().toString();
const appointmentId = new mongoose.Types.ObjectId().toString();
const paymentId = new mongoose.Types.ObjectId().toString();
const reviewId = new mongoose.Types.ObjectId().toString();

const pagination = { page: 1, limit: 20, total: 1, pages: 1 };

const createListResult = (items) => ({ items, pagination });

const createRepository = (overrides = {}) => ({
  findUsers: async () => createListResult([
    {
      _id: userId,
      name: "Customer One",
      email: "customer@example.com",
      role: "customer",
      password: "hashed-password",
      isActive: true
    }
  ]),
  updateUserStatus: async (id, isActive) => ({
    _id: id,
    name: "Customer One",
    email: "customer@example.com",
    role: "customer",
    password: "hashed-password",
    isActive
  }),
  findProviders: async () => createListResult([
    {
      _id: providerProfileId,
      businessName: "Provider Co",
      isVerified: false,
      isActive: true,
      user: { _id: userId, email: "provider@example.com", role: "provider", password: "hidden" }
    }
  ]),
  updateProviderVerification: async (id, isVerified) => ({
    _id: id,
    businessName: "Provider Co",
    isVerified,
    isActive: true
  }),
  findAppointments: async () => createListResult([{ _id: appointmentId, status: "confirmed" }]),
  findPayments: async () => createListResult([
    {
      _id: paymentId,
      amount: 100,
      status: "paid",
      stripeSessionId: "cs_secret",
      stripePaymentIntentId: "pi_secret"
    }
  ]),
  findReviews: async () => createListResult([{ _id: reviewId, rating: 5, moderationStatus: "visible" }]),
  getAdminMetrics: async () => ({
    totalUsers: 3,
    totalCustomers: 1,
    totalProviders: 1,
    verifiedProviders: 1,
    totalAppointments: 2,
    completedAppointments: 1,
    cancelledAppointments: 0,
    totalPayments: 1,
    totalRevenue: 100,
    totalReviews: 1,
    averageRating: 5,
    recentAppointments: [{ _id: appointmentId }],
    recentPayments: [{ _id: paymentId, stripeSessionId: "cs_secret" }],
    recentReviews: [{ _id: reviewId }]
  }),
  ...overrides
});

test("unauthenticated admin route access returns 401", async () => {
  const response = await request(app).get("/api/v1/admin/users");

  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
});

test("non-admin route access returns 403", async () => {
  const testApp = express();

  testApp.get(
    "/admin/users",
    (req, res, next) => {
      req.user = { role: "provider" };
      next();
    },
    authorizeMiddleware("admin"),
    (req, res) => res.status(200).json({ success: true })
  );

  testApp.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  });

  const response = await request(testApp).get("/admin/users");

  assert.equal(response.status, 403);
  assert.equal(response.body.success, false);
});

test("admin can list users without password fields", async () => {
  const result = await getUsers({}, { repository: createRepository() });

  assert.equal(result.success, true);
  assert.equal(result.data.users.length, 1);
  assert.equal(result.data.users[0].password, undefined);
});

test("admin can update user status", async () => {
  const result = await updateUserStatus(adminId, userId, { isActive: false }, { repository: createRepository() });

  assert.equal(result.success, true);
  assert.equal(result.data.user.isActive, false);
  assert.equal(result.data.user.password, undefined);
});

test("admin cannot disable their own user account", async () => {
  await assert.rejects(
    () => updateUserStatus(adminId, adminId, { isActive: false }, { repository: createRepository() }),
    /cannot disable/i
  );
});

test("admin can list providers", async () => {
  const result = await getProviders({}, { repository: createRepository() });

  assert.equal(result.success, true);
  assert.equal(result.data.providers.length, 1);
  assert.equal(result.data.providers[0].user.password, undefined);
});

test("admin can verify provider", async () => {
  const result = await updateProviderVerification(
    providerProfileId,
    { isVerified: true },
    { repository: createRepository() }
  );

  assert.equal(result.success, true);
  assert.equal(result.data.provider.isVerified, true);
});

test("admin can list appointments", async () => {
  const result = await getAppointments({}, { repository: createRepository() });

  assert.equal(result.success, true);
  assert.equal(result.data.appointments[0]._id, appointmentId);
});

test("admin can list payments without Stripe identifiers", async () => {
  const result = await getPayments({}, { repository: createRepository() });

  assert.equal(result.success, true);
  assert.equal(result.data.payments[0]._id, paymentId);
  assert.equal(result.data.payments[0].stripeSessionId, undefined);
  assert.equal(result.data.payments[0].stripePaymentIntentId, undefined);
});

test("admin can list reviews", async () => {
  const result = await getReviews({}, { repository: createRepository() });

  assert.equal(result.success, true);
  assert.equal(result.data.reviews[0].moderationStatus, "visible");
});

test("admin dashboard returns metrics", async () => {
  const result = await getAdminDashboard({ repository: createRepository() });

  assert.equal(result.success, true);
  assert.equal(result.data.totalUsers, 3);
  assert.equal(result.data.totalRevenue, 100);
  assert.equal(result.data.recentPayments[0].stripeSessionId, undefined);
});
