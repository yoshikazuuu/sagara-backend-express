"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = exports.ResponseError = exports.REFRESH_TOKEN_COOKIE = exports.ACCESS_TOKEN_COOKIE = void 0;
exports.sendResponse = sendResponse;
const http_status_codes_1 = require("http-status-codes");
exports.ACCESS_TOKEN_COOKIE = 'accessToken';
exports.REFRESH_TOKEN_COOKIE = 'refreshToken';
function sendResponse(res, params) {
    const { statusCode, success } = params, newParams = __rest(params, ["statusCode", "success"]);
    const isSuccess = (success !== null && success !== void 0 ? success : true);
    const code = statusCode !== null && statusCode !== void 0 ? statusCode : http_status_codes_1.StatusCodes.OK;
    const response = Object.assign({ status: (isSuccess ? 'success' : 'fail') }, newParams);
    return res.status(code).json(response);
}
class ResponseError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = ResponseError.name;
        this.statusCode = statusCode !== null && statusCode !== void 0 ? statusCode : http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    }
    static toResponse(error) {
        return {
            statusCode: error.statusCode,
            success: false,
            message: error.message,
        };
    }
}
exports.ResponseError = ResponseError;
exports.Errors = {
    SERVER: new ResponseError('Unexpected server error'),
    NO_SESSION: new ResponseError("You don't have an account session", http_status_codes_1.StatusCodes.UNAUTHORIZED),
    NO_PERMISSION: new ResponseError("You don't have the permission to access this content", http_status_codes_1.StatusCodes.FORBIDDEN),
    USER_NOT_FOUND: new ResponseError('Cannot find user', http_status_codes_1.StatusCodes.NOT_FOUND),
    COURSE_NOT_FOUND: new ResponseError('Cannot find course', http_status_codes_1.StatusCodes.NOT_FOUND),
    SUBMISSION_NOT_FOUND: new ResponseError('Cannot find submission', http_status_codes_1.StatusCodes.NOT_FOUND),
    SESSION_NOT_FOUND: new ResponseError('Cannot find session', http_status_codes_1.StatusCodes.NOT_FOUND),
    USER_NOT_ENROLLED_IN_COURSE: new ResponseError("You're not enrolled to the course", http_status_codes_1.StatusCodes.FORBIDDEN),
    FILES_NOT_FOUND: new ResponseError('Cannot find file', http_status_codes_1.StatusCodes.NOT_FOUND),
    USER_ATTENDANCE_NOT_FOUND: new ResponseError('Cannot find user attendance', http_status_codes_1.StatusCodes.NOT_FOUND),
};
