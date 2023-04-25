import EErrors from "../../errors/enum.errors.js";

export default (error, req, res, next) => {
    console.log(error.cause);

    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            console.log('caso 2')
            res.status(400).json({status: 'error', error: error.name});
            break;
        default:
            res.status(501).json({status: 'error', error: 'Unhandled error'});
    }
};