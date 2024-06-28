import { StatusCodes } from "http-status-codes";
import { Response } from "express";

export interface APIResponse {
    statusCode?: StatusCodes;
    success?: boolean;
    message: string;
    data?: unknown;
}

export const ACCESS_TOKEN_COOKIE = 'accessToken';
// Not yet implemented, not required for this case (presumably)
export const REFRESH_TOKEN_COOKIE = 'refreshToken';

/**
 * Sends a JSON response with standardization.
 * Normally, there aren't any template to send responses,
 * so you don't get the help from the autocomplete.
 */
export function sendResponse(res: Response, params: APIResponse) {
    const { statusCode, success, ...newParams } = params;

    const isSuccess = (success ?? true);
    const code = statusCode ?? StatusCodes.OK;

    const response = {
        status: (isSuccess ? 'success' : 'fail'),
        ...newParams,
    };

    return res.status(code).json(response);
}

/**
 * User-defined error for API responses
 *
 * Instead of using `try-catch` and call {@link sendResponse} on every error,
 * we could just make a error handler (for express.js) and use this class
 * to create the same effect.
 *
 * @see {@link errorHandling} for the error middleware implementation.
 */
export class ResponseError extends Error {

    statusCode: StatusCodes;

    constructor(message: string, statusCode?: StatusCodes) {
        super(message);

        // Apparently using `instanceof` syntax doesn't work
        // when it comes to the `Error` class.
        //
        // So, to make it up for that, as an identifier we just do this.
        this.name = ResponseError.name;
        this.statusCode = statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
    }

    static toResponse(error: ResponseError): APIResponse {
        return {
            statusCode: error.statusCode,
            success: false,
            message: error.message,
        };
    }

}

/**
 * Common API errors
 */
export const Errors = {
    /**
     * Internal server error / Unexpected error
     */
    SERVER: new ResponseError('Unexpected server error'),

    /**
     * User doesn't have JWT or authentication token
     */
    NO_SESSION: new ResponseError(
        "You don't have an account session",
        StatusCodes.UNAUTHORIZED),

    /**
     * User doesn't have the permission
     */
    NO_PERMISSION: new ResponseError(
        "You don't have the permission to access this content",
        StatusCodes.FORBIDDEN),

    USER_NOT_FOUND: new ResponseError(
        'Cannot find user',
        StatusCodes.NOT_FOUND),

    COURSE_NOT_FOUND: new ResponseError(
        'Cannot find course',
        StatusCodes.NOT_FOUND),

    SUBMISSION_NOT_FOUND: new ResponseError(
        'Cannot find submission',
        StatusCodes.NOT_FOUND),

    SESSION_NOT_FOUND: new ResponseError(
        'Cannot find session',
        StatusCodes.NOT_FOUND),

    USER_NOT_ENROLLED_IN_COURSE: new ResponseError(
        "You're not enrolled to the course",
        StatusCodes.FORBIDDEN),

    FILES_NOT_FOUND: new ResponseError(
        'Cannot find file',
        StatusCodes.NOT_FOUND,
    ),

    USER_ATTENDANCE_NOT_FOUND: new ResponseError(
        'Cannot find user attendance',
        StatusCodes.NOT_FOUND,
    ),
};