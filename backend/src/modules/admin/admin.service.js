import * as repositoryFunctions from "./admin.repository.js";

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const buildRepository = (dependencies = {}) => dependencies.repository || repositoryFunctions;

const notFound = (resource) => createError(`${resource} not found`, 404);

const assertFound = (value, resource) => {
  if (!value) {
    throw notFound(resource);
  }

  return value;
};

const sensitiveFields = new Set(["password", "stripeSessionId", "stripePaymentIntentId"]);

const isPlainObject = (value) => Object.prototype.toString.call(value) === "[object Object]";

const sanitize = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (!value || value instanceof Date) {
    return value;
  }

  const plain = typeof value.toObject === "function" ? value.toObject() : value;

  if (!isPlainObject(plain)) {
    return plain;
  }

  return Object.fromEntries(
    Object.entries(plain)
      .filter(([key]) => !sensitiveFields.has(key))
      .map(([key, item]) => [key, sanitize(item)])
  );
};

const listResponse = (message, key, result) => ({
  success: true,
  message,
  data: {
    [key]: sanitize(result.items),
    pagination: result.pagination
  }
});

export const getUsers = async (query = {}, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const result = await repository.findUsers(query);
  return listResponse("Users retrieved successfully", "users", result);
};

export const getUserById = async (id, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const user = assertFound(await repository.findUserById(id), "User");

  return {
    success: true,
    message: "User retrieved successfully",
    data: { user: sanitize(user) }
  };
};

export const updateUserStatus = async (adminId, userId, { isActive }, dependencies = {}) => {
  if (String(adminId) === String(userId) && isActive === false) {
    throw createError("Admins cannot disable their own account", 400);
  }

  const repository = buildRepository(dependencies);
  const user = assertFound(await repository.updateUserStatus(userId, isActive), "User");

  return {
    success: true,
    message: "User status updated successfully",
    data: { user: sanitize(user) }
  };
};

export const updateUserRole = async (adminId, userId, { role }, dependencies = {}) => {
  if (String(adminId) === String(userId)) {
    throw createError("Admins cannot change their own role", 400);
  }

  const repository = buildRepository(dependencies);
  const user = assertFound(await repository.updateUserRole(userId, role), "User");

  return {
    success: true,
    message: "User role updated successfully",
    data: { user: sanitize(user) }
  };
};

export const getProviders = async (query = {}, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const result = await repository.findProviders(query);
  return listResponse("Providers retrieved successfully", "providers", result);
};

export const getProviderById = async (id, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const provider = assertFound(await repository.findProviderById(id), "Provider");

  return {
    success: true,
    message: "Provider retrieved successfully",
    data: { provider: sanitize(provider) }
  };
};

export const updateProviderVerification = async (id, { isVerified }, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const provider = assertFound(await repository.updateProviderVerification(id, isVerified), "Provider");

  return {
    success: true,
    message: "Provider verification updated successfully",
    data: { provider: sanitize(provider) }
  };
};

export const updateProviderStatus = async (id, { isActive }, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const provider = assertFound(await repository.updateProviderStatus(id, isActive), "Provider");

  return {
    success: true,
    message: "Provider status updated successfully",
    data: { provider: sanitize(provider) }
  };
};

export const getAppointments = async (query = {}, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const result = await repository.findAppointments(query);
  return listResponse("Appointments retrieved successfully", "appointments", result);
};

export const getAppointmentById = async (id, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const appointment = assertFound(await repository.findAppointmentById(id), "Appointment");

  return {
    success: true,
    message: "Appointment retrieved successfully",
    data: { appointment: sanitize(appointment) }
  };
};

export const getPayments = async (query = {}, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const result = await repository.findPayments(query);
  return listResponse("Payments retrieved successfully", "payments", result);
};

export const getPaymentById = async (id, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const payment = assertFound(await repository.findPaymentById(id), "Payment");

  return {
    success: true,
    message: "Payment retrieved successfully",
    data: { payment: sanitize(payment) }
  };
};

export const getReviews = async (query = {}, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const result = await repository.findReviews(query);
  return listResponse("Reviews retrieved successfully", "reviews", result);
};

export const updateReviewStatus = async (id, { moderationStatus }, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const review = assertFound(await repository.updateReviewModerationStatus(id, moderationStatus), "Review");

  return {
    success: true,
    message: "Review status updated successfully",
    data: { review: sanitize(review) }
  };
};

export const getAdminDashboard = async (dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const metrics = await repository.getAdminMetrics();

  return {
    success: true,
    message: "Admin dashboard retrieved successfully",
    data: sanitize(metrics)
  };
};
