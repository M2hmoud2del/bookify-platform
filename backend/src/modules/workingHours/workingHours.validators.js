import Joi from "joi";

export const daysOfWeek = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
];

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const updateWorkingHoursSchema = Joi.object({
  workingHours: Joi.array()
    .items(
      Joi.object({
        dayOfWeek: Joi.string().valid(...daysOfWeek).required(),
        startTime: Joi.string().pattern(timePattern).allow(null).optional(),
        endTime: Joi.string().pattern(timePattern).allow(null).optional(),
        isClosed: Joi.boolean().default(false),
        slotIntervalMinutes: Joi.number().valid(15, 30, 45, 60).default(30),
        breaks: Joi.array()
          .items(
            Joi.object({
              startTime: Joi.string().pattern(timePattern).required(),
              endTime: Joi.string().pattern(timePattern).required()
            })
          )
          .default([])
      })
    )
    .min(1)
    .required()
});
