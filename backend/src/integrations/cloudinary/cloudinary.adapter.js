import streamifier from "streamifier";

import cloudinary from "./cloudinary.client.js";
import { CloudinaryDeleteError, CloudinaryUploadError } from "./cloudinary.errors.js";

export const uploadImageBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.publicId,
        resource_type: "image"
      },
      (error, result) => {
        if (error || !result) {
          return reject(new CloudinaryUploadError(error?.message));
        }

        const secureUrl = options.deliveryTransformation
          ? cloudinary.url(result.public_id, {
              secure: true,
              resource_type: "image",
              transformation: options.deliveryTransformation
            })
          : result.secure_url;

        return resolve({
          secureUrl,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes
        });
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image"
    });

    if (!["ok", "not found"].includes(result.result)) {
      throw new CloudinaryDeleteError(`Cloudinary delete returned: ${result.result}`);
    }

    return result;
  } catch (error) {
    if (error instanceof CloudinaryDeleteError) {
      throw error;
    }

    throw new CloudinaryDeleteError(error.message);
  }
};
