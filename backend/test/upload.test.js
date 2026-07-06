import assert from "node:assert/strict";
import test from "node:test";

import express from "express";
import request from "supertest";

import app from "../src/app.js";
import authorizeMiddleware from "../src/middleware/authorize.middleware.js";
import {
  uploadProviderProfileImage,
  uploadServiceImages
} from "../src/middleware/upload.js";
import { assertServiceImageLimit } from "../src/modules/upload/upload.service.js";

const createUploadTestApp = (uploadMiddleware) => {
  const testApp = express();

  testApp.post("/upload", uploadMiddleware, (req, res) => {
    res.status(200).json({ success: true });
  });

  testApp.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });
  });

  return testApp;
};

test("rejects unauthenticated provider profile image upload", async () => {
  const response = await request(app)
    .patch("/api/uploads/provider/profile-image")
    .attach("image", Buffer.from("fake image"), {
      filename: "profile.png",
      contentType: "image/png"
    });

  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
});

test("rejects invalid profile image file type", async () => {
  const response = await request(createUploadTestApp(uploadProviderProfileImage))
    .post("/upload")
    .attach("image", Buffer.from("not an image"), {
      filename: "notes.txt",
      contentType: "text/plain"
    });

  assert.equal(response.status, 400);
  assert.match(response.body.message, /Only JPEG, PNG, and WebP/i);
});

test("rejects service images larger than 5MB", async () => {
  const oversizedImage = Buffer.alloc(5 * 1024 * 1024 + 1);

  const response = await request(createUploadTestApp(uploadServiceImages))
    .post("/upload")
    .attach("images", oversizedImage, {
      filename: "large.png",
      contentType: "image/png"
    });

  assert.equal(response.status, 400);
  assert.match(response.body.message, /5MB/i);
});

test("rejects customer role before upload handling", async () => {
  const testApp = express();

  testApp.patch(
    "/upload",
    (req, res, next) => {
      req.user = { role: "customer" };
      next();
    },
    authorizeMiddleware("provider"),
    uploadProviderProfileImage,
    (req, res) => {
      res.status(200).json({ success: true });
    }
  );

  testApp.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });
  });

  const response = await request(testApp)
    .patch("/upload")
    .attach("image", Buffer.from("fake image"), {
      filename: "profile.png",
      contentType: "image/png"
    });

  assert.equal(response.status, 403);
  assert.equal(response.body.success, false);
});

test("rejects service image uploads above total image limit", () => {
  assert.throws(
    () => assertServiceImageLimit(8, 3),
    /maximum of 10 images/
  );
});
