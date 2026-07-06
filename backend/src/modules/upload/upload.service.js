import mongoose from "mongoose";

import { deleteImage, uploadImageBuffer } from "../../integrations/cloudinary/index.js";
import { createUploadError } from "./upload.errors.js";
import {
  findOwnedServiceById,
  findProviderProfileByUserId,
  saveDocument
} from "./upload.repository.js";

const cloudinaryRootFolder = process.env.CLOUDINARY_FOLDER || "bookify";
const maxServiceImages = 10;
const profileImageTransformation = [
  {
    width: 800,
    height: 800,
    crop: "fill",
    gravity: "auto",
    quality: "auto",
    fetch_format: "auto"
  }
];
const serviceImageTransformation = [
  {
    width: 1400,
    height: 1000,
    crop: "limit",
    quality: "auto",
    fetch_format: "auto"
  }
];

const validateObjectId = (id, message = "Invalid id") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createUploadError(message, 400);
  }
};

const toImageData = (uploadResult) => ({
  url: uploadResult.url,
  publicId: uploadResult.publicId,
  width: uploadResult.width,
  height: uploadResult.height,
  format: uploadResult.format,
  bytes: uploadResult.bytes,
  moderationStatus: "pending_review"
});

export const assertServiceImageLimit = (currentImageCount, incomingImageCount) => {
  if (currentImageCount + incomingImageCount > maxServiceImages) {
    throw createUploadError(`A service can have a maximum of ${maxServiceImages} images`, 400);
  }
};

const getProviderService = async (serviceId, providerId) => {
  validateObjectId(serviceId, "Invalid service id");

  const service = await findOwnedServiceById(serviceId, providerId);

  if (!service) {
    throw createUploadError("Service not found or you do not own this service", 404);
  }

  return service;
};

export const uploadProviderProfileImage = async (providerId, file) => {
  if (!file) {
    throw createUploadError("Provider profile image is required", 400);
  }

  const profile = await findProviderProfileByUserId(providerId);

  if (!profile) {
    throw createUploadError("Provider profile not found", 404);
  }

  const previousPublicId = profile.profileImage?.publicId;
  const folder = `${cloudinaryRootFolder}/providers/${providerId}/profile`;
  const uploadedImage = await uploadImageBuffer(file.buffer, {
    folder,
    deliveryTransformation: profileImageTransformation
  });
  const profileImage = toImageData(uploadedImage);
  let profileSaved = false;

  try {
    profile.profileImage = profileImage;
    await saveDocument(profile);
    profileSaved = true;

    if (previousPublicId && previousPublicId !== profileImage.publicId) {
      await deleteImage(previousPublicId).catch(() => {});
    }
  } catch (error) {
    if (!profileSaved) {
      await deleteImage(profileImage.publicId).catch(() => {});
    }

    throw error;
  }

  return {
    success: true,
    message: "Provider profile image uploaded successfully",
    data: {
      profileImage
    }
  };
};

export const uploadServiceImages = async (providerId, serviceId, files = []) => {
  if (!files.length) {
    throw createUploadError("At least one service image is required", 400);
  }

  const service = await getProviderService(serviceId, providerId);
  assertServiceImageLimit(service.images.length, files.length);

  const folder = `${cloudinaryRootFolder}/providers/${providerId}/services/${serviceId}`;
  const uploadedImages = [];

  try {
    for (const file of files) {
      const uploadedImage = await uploadImageBuffer(file.buffer, {
        folder,
        deliveryTransformation: serviceImageTransformation
      });
      uploadedImages.push(toImageData(uploadedImage));
    }

    service.images.push(...uploadedImages);
    await saveDocument(service);
  } catch (error) {
    await Promise.all(
      uploadedImages.map((image) => deleteImage(image.publicId).catch(() => {}))
    );
    throw error;
  }

  return {
    success: true,
    message: "Service images uploaded successfully",
    data: {
      images: service.images
    }
  };
};

export const deleteServiceImage = async (providerId, serviceId, publicId) => {
  if (!publicId) {
    throw createUploadError("publicId is required", 400);
  }

  const service = await getProviderService(serviceId, providerId);
  const imageExists = service.images.some((image) => image.publicId === publicId);

  if (!imageExists) {
    throw createUploadError("Service image not found", 404);
  }

  await deleteImage(publicId);

  service.images = service.images.filter((image) => image.publicId !== publicId);
  await saveDocument(service);

  return {
    success: true,
    message: "Service image deleted successfully",
    data: {
      images: service.images
    }
  };
};
