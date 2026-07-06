import {
  deleteServiceImage as deleteServiceImageService,
  uploadProviderProfileImage as uploadProviderProfileImageService,
  uploadServiceImages as uploadServiceImagesService
} from "./upload.service.js";

export const uploadProviderProfileImage = async (req, res, next) => {
  try {
    const result = await uploadProviderProfileImageService(req.user._id, req.file);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const uploadServiceImages = async (req, res, next) => {
  try {
    const result = await uploadServiceImagesService(
      req.user._id,
      req.params.serviceId,
      req.files
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteServiceImage = async (req, res, next) => {
  try {
    const result = await deleteServiceImageService(
      req.user._id,
      req.params.serviceId,
      req.body.publicId
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
