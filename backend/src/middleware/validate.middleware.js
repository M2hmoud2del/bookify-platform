const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const validateMiddleware = (schema) => {

    return (req, res, next) => {
        const { error } = schema.validate(req.body);

        if (error) {
            return next(createError("Sorry Your request is invalid you have missing or invalid fields", 400));
        }

        next();

    };

};

export default validateMiddleware;
