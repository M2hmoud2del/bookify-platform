import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Appointment from "../models/Appointment.js";
import Payment from "../models/Payment.js";
import ProviderProfile from "../models/ProviderProfile.js";
import Review from "../models/Review.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import WorkingHour from "../models/WorkingHour.js";

const PASSWORD = "password123";
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

const seedProviders = [
  {
    name: "Mona Hassan",
    email: "provider1@example.com",
    phone: "01000000001",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    profile: {
      businessName: "Cairo Wellness Studio",
      bio: "Wellness consultations, stress management, and lifestyle coaching.",
      category: "Wellness",
      address: "12 Nile Corniche",
      city: "Cairo",
      profileImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874",
      timezone: "Africa/Cairo",
      isVerified: true
    },
    services: [
      {
        title: "Initial Wellness Consultation",
        description: "A focused session to understand your goals and build a first plan.",
        category: "Wellness",
        price: 250,
        durationMinutes: 60,
        images: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef"]
      },
      {
        title: "Stress Management Session",
        description: "Practical tools for reducing stress and improving daily routines.",
        category: "Wellness",
        price: 180,
        durationMinutes: 45,
        images: ["https://images.unsplash.com/photo-1506126613408-eca07ce68773"]
      }
    ]
  },
  {
    name: "Omar Adel",
    email: "provider2@example.com",
    phone: "01000000002",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    profile: {
      businessName: "Alex Dental Care",
      bio: "Friendly dental checkups, cleaning, and cosmetic care.",
      category: "Dental",
      address: "45 Fouad Street",
      city: "Alexandria",
      profileImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09",
      timezone: "Africa/Cairo",
      isVerified: true
    },
    services: [
      {
        title: "Dental Checkup",
        description: "General oral examination and treatment recommendations.",
        category: "Dental",
        price: 300,
        durationMinutes: 30,
        images: ["https://images.unsplash.com/photo-1606811841689-23dfddce3e95"]
      },
      {
        title: "Teeth Cleaning",
        description: "Professional cleaning and polishing.",
        category: "Dental",
        price: 450,
        durationMinutes: 45,
        images: ["https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"]
      }
    ]
  },
  {
    name: "Laila Nabil",
    email: "provider3@example.com",
    phone: "01000000003",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    profile: {
      businessName: "Giza Beauty Lounge",
      bio: "Hair styling, skincare, and beauty services for everyday confidence.",
      category: "Beauty",
      address: "9 Haram Street",
      city: "Giza",
      profileImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e",
      timezone: "Africa/Cairo",
      isVerified: false
    },
    services: [
      {
        title: "Hair Styling",
        description: "Wash, blow-dry, and styling for events or daily looks.",
        category: "Beauty",
        price: 220,
        durationMinutes: 60,
        images: ["https://images.unsplash.com/photo-1560066984-138dadb4c035"]
      },
      {
        title: "Facial Treatment",
        description: "Refreshing facial treatment tailored to your skin.",
        category: "Beauty",
        price: 350,
        durationMinutes: 75,
        images: ["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881"]
      }
    ]
  }
];

const seedCustomers = [
  {
    name: "Ahmed Samir",
    email: "customer1@example.com",
    phone: "01100000001",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  },
  {
    name: "Nour Khaled",
    email: "customer2@example.com",
    phone: "01100000002",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
  },
  {
    name: "Youssef Ali",
    email: "customer3@example.com",
    phone: "01100000003",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
  }
];

const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday"];

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const dayOnly = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const upsertUser = async ({ role, ...userData }) => {
  const password = await bcrypt.hash(PASSWORD, SALT_ROUNDS);

  return User.findOneAndUpdate(
    { email: userData.email },
    {
      ...userData,
      password,
      role,
      isActive: true,
      deletedAt: null
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }
  );
};

const seedUsers = async () => {
  const providers = [];
  const customers = [];

  for (const provider of seedProviders) {
    providers.push(await upsertUser({ ...provider, role: "provider" }));
  }

  for (const customer of seedCustomers) {
    customers.push(await upsertUser({ ...customer, role: "customer" }));
  }

  return { providers, customers };
};

const seedProviderProfiles = async (providers) => {
  const profiles = [];

  for (const [index, provider] of providers.entries()) {
    const profileData = seedProviders[index].profile;

    profiles.push(
      await ProviderProfile.findOneAndUpdate(
        { user: provider._id },
        {
          ...profileData,
          user: provider._id,
          ratingAverage: 0,
          ratingCount: 0,
          deletedAt: null
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      )
    );
  }

  return profiles;
};

const seedServices = async (providers) => {
  await Service.deleteMany({
    provider: mongoose.trusted({ $in: providers.map((provider) => provider._id) })
  });

  const servicesByProvider = [];

  for (const [index, provider] of providers.entries()) {
    const createdServices = await Service.insertMany(
      seedProviders[index].services.map((service) => ({
        ...service,
        provider: provider._id,
        isActive: true,
        deletedAt: null
      }))
    );

    servicesByProvider.push(createdServices);
  }

  return servicesByProvider;
};

const seedWorkingHours = async (providers) => {
  for (const provider of providers) {
    for (const dayOfWeek of weekdays) {
      await WorkingHour.findOneAndUpdate(
        { provider: provider._id, dayOfWeek },
        {
          provider: provider._id,
          dayOfWeek,
          startTime: "09:00",
          endTime: "17:00",
          isClosed: false
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      );
    }

    for (const dayOfWeek of ["friday", "saturday"]) {
      await WorkingHour.findOneAndUpdate(
        { provider: provider._id, dayOfWeek },
        {
          provider: provider._id,
          dayOfWeek,
          isClosed: true
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      );
    }
  }
};

const clearSeededBookings = async (providers, customers) => {
  const providerIds = providers.map((provider) => provider._id);
  const customerIds = customers.map((customer) => customer._id);

  await Payment.deleteMany({
    provider: mongoose.trusted({ $in: providerIds }),
    customer: mongoose.trusted({ $in: customerIds })
  });
  await Review.deleteMany({
    provider: mongoose.trusted({ $in: providerIds }),
    customer: mongoose.trusted({ $in: customerIds })
  });
  await Appointment.deleteMany({
    provider: mongoose.trusted({ $in: providerIds }),
    customer: mongoose.trusted({ $in: customerIds })
  });
};

const seedBookings = async ({ providers, customers, servicesByProvider }) => {
  await clearSeededBookings(providers, customers);

  const today = dayOnly(new Date());
  const bookingData = [
    {
      customer: customers[0],
      provider: providers[0],
      service: servicesByProvider[0][0],
      date: addDays(today, 2),
      startTime: "10:00",
      endTime: "11:00",
      status: "confirmed",
      paymentStatus: "paid",
      notes: "Please prepare a first visit plan."
    },
    {
      customer: customers[1],
      provider: providers[1],
      service: servicesByProvider[1][0],
      date: addDays(today, 3),
      startTime: "12:00",
      endTime: "12:30",
      status: "pending_payment",
      paymentStatus: "unpaid",
      notes: "Regular checkup."
    },
    {
      customer: customers[2],
      provider: providers[2],
      service: servicesByProvider[2][1],
      date: addDays(today, -5),
      startTime: "13:00",
      endTime: "14:15",
      status: "completed",
      paymentStatus: "paid",
      notes: "Completed sample appointment."
    }
  ];

  const appointments = await Appointment.insertMany(
    bookingData.map((booking) => ({
      customer: booking.customer._id,
      provider: booking.provider._id,
      service: booking.service._id,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      notes: booking.notes,
      timezone: "Africa/Cairo"
    }))
  );

  await Payment.insertMany(
    appointments.map((appointment, index) => ({
      appointment: appointment._id,
      customer: bookingData[index].customer._id,
      provider: bookingData[index].provider._id,
      amount: bookingData[index].service.price,
      currency: "egp",
      stripeSessionId: `seed_session_${index + 1}`,
      stripePaymentIntentId: `seed_payment_intent_${index + 1}`,
      status: bookingData[index].paymentStatus === "paid" ? "paid" : "pending"
    }))
  );

  await Review.create({
    appointment: appointments[2]._id,
    customer: customers[2]._id,
    provider: providers[2]._id,
    service: servicesByProvider[2][1]._id,
    rating: 5,
    comment: "Great service and very smooth booking experience."
  });
};

const refreshProviderRatings = async (providers) => {
  for (const provider of providers) {
    const reviews = await Review.find({ provider: provider._id });
    const ratingCount = reviews.length;
    const ratingAverage = ratingCount
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / ratingCount
      : 0;

    await ProviderProfile.findOneAndUpdate(
      { user: provider._id },
      { ratingAverage, ratingCount }
    );
  }
};

const seedDatabase = async () => {
  await connectDB();

  const { providers, customers } = await seedUsers();
  await seedProviderProfiles(providers);
  const servicesByProvider = await seedServices(providers);
  await seedWorkingHours(providers);
  await seedBookings({ providers, customers, servicesByProvider });
  await refreshProviderRatings(providers);

  console.log("Seed completed successfully.");
  console.log(`Provider login: ${seedProviders[0].email} / ${PASSWORD}`);
  console.log(`Customer login: ${seedCustomers[0].email} / ${PASSWORD}`);
};

seedDatabase()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
