// We've created this folder and this file to create our custon errors that will extend ou Error class and will let us to pass
// the data inside of throw new Error(msg) to our Error Middleware.

// This code defines a custom error class NotFoundError that extends the built-in Error class in JavaScript. The NotFoundError
// class is designed to be used when a requested resource is not found, and it includes a status code of 404 to indicate this.

// Here's a breakdown of the code:

// class NotFoundError extends Error: This line defines a new class NotFoundError that extends the built-in Error class. This 
// means that NotFoundError inherits all of the properties and methods of the Error class, and can also define its own properties
// and methods.

// constructor(message): This is the constructor method for the NotFoundError class, which is called when a new instance of the
// class is created. The message parameter is the error message that will be displayed when the error is thrown.

// super(message): This line calls the constructor of the Error class and passes the message parameter to it. This sets the error
// message for the NotFoundError instance.

// this.name = "NotFoundError": This line sets the name property of the NotFoundError instance to "NotFoundError". This is a 
// built-in property of the Error class that specifies the name of the error.

// this.statusCode = 404: This line sets the statusCode property of the NotFoundError instance to 404. This is a custom property 
// that is specific to the NotFoundError class and indicates the HTTP status code that should be returned when this error occurs.

// By creating a custom error class like NotFoundError, you can provide more specific error messages and properties to help with 
// debugging and error handling in your application.

// ================================================ Status Codes ============================================================= //
// 200 OK OK
// 201 CREATED Created

// 400 BAD_REQUEST Bad Request
// The HyperText Transfer Protocol (HTTP) 400 Bad Request response status code indicates that the server cannot or will 
//not process the request due to something that is perceived to be a client error (for example, malformed request syntax,
//invalid request message framing, or deceptive request routing)

// 401 UNAUTHORIZED Unauthorized

// 403 FORBIDDEN Forbidden
// 404 NOT_FOUND Not Found

// 500 INTERNAL_SERVER_ERROR Internal Server Error

import { StatusCodes } from "http-status-codes";

//optional

// =========================================================================================================================== //

export class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = 'NotFoundError';
      this.statusCode = StatusCodes.NOT_FOUND;
    };
};

export class BadRequestError extends Error {
    constructor(message) {
      super(message);
      this.name = 'BadRequestError';
      this.statusCode = StatusCodes.BAD_REQUEST;
    };
};


export class UnauthenticatedError extends Error {
    constructor(message) {
    super(message);
    this.name = 'UnauthenticatedError';
    this.statusCode = StatusCodes.UNAUTHORIZED;
    };
};


export class UnauthorizedError extends Error {
    constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = StatusCodes.FORBIDDEN;
    };
};