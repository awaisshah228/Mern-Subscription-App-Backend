import { StatusCodes } from 'http-status-codes';

const notFoundPage = (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Error 404 | Page Not Found'
    });
};


export { notFoundPage };

