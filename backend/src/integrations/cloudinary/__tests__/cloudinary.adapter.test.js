import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { Writable } from "node:stream";

import {
  buildOptimizedImageUrl,
  deleteImage,
  uploadImageBuffer
} from "../cloudinary.adapter.js";
import cloudinary from "../cloudinary.client.js";
import {
  CloudinaryDeleteError,
  CloudinaryUploadError
} from "../cloudinary.errors.js";

const originalUploadStream = cloudinary.uploader.upload_stream;
const originalDestroy = cloudinary.uploader.destroy;
const originalUrl = cloudinary.url;

beforeEach(() => {
  cloudinary.url = (publicId, options) => {
    const transformation = options.transformation ? "/optimized" : "";
    return `https://res.cloudinary.com/demo/image/upload${transformation}/${publicId}`;
  };
});

afterEach(() => {
  cloudinary.uploader.upload_stream = originalUploadStream;
  cloudinary.uploader.destroy = originalDestroy;
  cloudinary.url = originalUrl;
});

const createUploadStreamMock = (callbackResult, callbackError = null) => {
  return (options, callback) => {
    return new Writable({
      write(chunk, encoding, done) {
        done();
      },
      final(done) {
        callback(callbackError, callbackResult);
        done();
      }
    });
  };
};

test("uploadImageBuffer uploads a buffer and returns image metadata", async () => {
  cloudinary.uploader.upload_stream = createUploadStreamMock({
    secure_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    public_id: "bookify/sample",
    width: 800,
    height: 600,
    format: "jpg",
    bytes: 1200
  });

  const result = await uploadImageBuffer(Buffer.from("fake-image"), {
    folder: "bookify/test"
  });

  assert.deepEqual(result, {
    url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    publicId: "bookify/sample",
    width: 800,
    height: 600,
    format: "jpg",
    bytes: 1200
  });
});

test("uploadImageBuffer returns optimized URL when transformation is provided", async () => {
  cloudinary.uploader.upload_stream = createUploadStreamMock({
    secure_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    public_id: "bookify/sample",
    width: 800,
    height: 600,
    format: "jpg",
    bytes: 1200
  });

  const result = await uploadImageBuffer(Buffer.from("fake-image"), {
    folder: "bookify/test",
    deliveryTransformation: [{ quality: "auto", fetch_format: "auto" }]
  });

  assert.equal(
    result.url,
    "https://res.cloudinary.com/demo/image/upload/optimized/bookify/sample"
  );
});

test("uploadImageBuffer wraps Cloudinary upload failures", async () => {
  cloudinary.uploader.upload_stream = createUploadStreamMock(
    null,
    new Error("upload failed")
  );

  await assert.rejects(
    () => uploadImageBuffer(Buffer.from("fake-image"), { folder: "bookify/test" }),
    CloudinaryUploadError
  );
});

test("deleteImage deletes a Cloudinary image by publicId", async () => {
  cloudinary.uploader.destroy = async (publicId, options) => {
    assert.equal(publicId, "bookify/sample");
    assert.equal(options.resource_type, "image");
    return { result: "ok" };
  };

  const result = await deleteImage("bookify/sample");

  assert.deepEqual(result, { result: "ok" });
});

test("deleteImage treats missing Cloudinary images as already deleted", async () => {
  cloudinary.uploader.destroy = async () => ({ result: "not found" });

  const result = await deleteImage("bookify/missing");

  assert.deepEqual(result, { result: "not found" });
});

test("deleteImage wraps unexpected Cloudinary delete results", async () => {
  cloudinary.uploader.destroy = async () => ({ result: "failed" });

  await assert.rejects(
    () => deleteImage("bookify/sample"),
    CloudinaryDeleteError
  );
});

test("buildOptimizedImageUrl builds a secure transformed image URL", () => {
  const result = buildOptimizedImageUrl("bookify/sample", {
    transformation: [{ quality: "auto" }]
  });

  assert.equal(
    result,
    "https://res.cloudinary.com/demo/image/upload/optimized/bookify/sample"
  );
});
