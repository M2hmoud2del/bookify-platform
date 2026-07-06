import WorkingHour from "./workingHours.model.js";
import ProviderProfile from "../../models/ProviderProfile.js";

export const findWorkingHoursByProvider = (providerId) => {
  return WorkingHour.find({ provider: providerId }).sort({ dayOfWeek: 1 });
};

export const findWorkingHourByProviderAndDay = (providerId, dayOfWeek) => {
  return WorkingHour.findOne({
    provider: providerId,
    dayOfWeek
  });
};

export const findProviderProfileByUserId = (providerId) => {
  return ProviderProfile.findOne({
    user: providerId,
    deletedAt: null
  });
};

export const upsertWorkingHours = async (providerId, workingHours) => {
  if (!workingHours.length) {
    return;
  }

  await WorkingHour.bulkWrite(
    workingHours.map((workingHour) => ({
      updateOne: {
        filter: {
          provider: providerId,
          dayOfWeek: workingHour.dayOfWeek
        },
        update: {
          $set: {
            ...workingHour,
            provider: providerId
          }
        },
        upsert: true
      }
    }))
  );
};
