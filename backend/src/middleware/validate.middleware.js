const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const validateMiddleware = (schema) => {

    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            errors: {
                wrap: {
                    label: false
                }
            }
        });

        if (error) {
            const validationError = createError("Validation failed", 400);
            validationError.errors = error.details.map((detail) => ({
                field: detail.path.join("."),
                message: detail.message
            }));

            return next(validationError);
        }

        next();

    };

};

export default validateMiddleware;
