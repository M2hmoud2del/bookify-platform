const validateMiddleware = (schema) => {

    return (req, res, next) => {
        const { error } = schema.validate(req.body);

        if (error) {
            return next(new Error("Sorry Your request is invalid you have missing or invalid fields"));
        }

        next();

    };

};

export default validateMiddleware;