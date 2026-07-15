import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId },
  status: { type: String, enum: ["pending_payment", "confirmed", "rejected", "cancelled", "completed"] }
});
const Appointment = mongoose.model("AppointmentTest", appointmentSchema);

async function test() {
  await mongoose.connect("mongodb://localhost:27017/bookify_test");
  mongoose.set("sanitizeFilter", true);

  try {
    const res = await Appointment.find({
        provider: new mongoose.Types.ObjectId(),
        status: { $in: ["confirmed", "completed"] }
    });
    console.log("Find Without trusted:", res);
  } catch (e) {
    console.error("Find Without trusted error:", e.message);
  }
  
  try {
    const res = await Appointment.find({
        provider: new mongoose.Types.ObjectId(),
        status: mongoose.trusted({ $in: ["confirmed", "completed"] })
    });
    console.log("Find With trusted:", res);
  } catch (e) {
    console.error("Find With trusted error:", e.message);
  }

  try {
    const res = await Appointment.aggregate([
      {
        $match: {
          provider: new mongoose.Types.ObjectId(),
          status: { $in: ["confirmed", "completed"] }
        }
      }
    ]);
    console.log("Aggregate Without trusted:", res);
  } catch (e) {
    console.error("Aggregate Without trusted error:", e.message);
  }

  try {
    const res = await Appointment.aggregate([
      {
        $match: {
          provider: new mongoose.Types.ObjectId(),
          status: mongoose.trusted({ $in: ["confirmed", "completed"] })
        }
      }
    ]);
    console.log("Aggregate With trusted:", res);
  } catch (e) {
    console.error("Aggregate With trusted error:", e.message);
  }

  await mongoose.disconnect();
}

test();
