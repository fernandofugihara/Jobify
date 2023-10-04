// This is the authentication controllers, where it can do two things register a new user = CREATE a new user and login a user that
// is already register, both of then are post requests.


// =============================================== User Model ================================================================ //
import UserModel from "../models/UserModel.js";
// =========================================================================================================================== //

// ================================================ Status Codes ============================================================= //
// 200 OK OK
// 201 CREATED Created

// 400 BAD_REQUEST Bad Request
// 401 UNAUTHORIZED Unauthorized

// 403 FORBIDDEN Forbidden
// 404 NOT_FOUND Not Found

// 500 INTERNAL_SERVER_ERROR Internal Server Error

import { StatusCodes } from "http-status-codes";

//optional

// =========================================================================================================================== //

// =============================================== HASH PASSWORD  ============================================================ //

import { hashPassword } from "../utils/passwordUtils.js";

// =========================================================================================================================== //


// ============================================ CREATE USER funcionality ===================================================== //
export const register = async (req, res) => {

    // ================================= CREATE A DOCUMENT INSIDE OF THE USERS COLLECTION ==================================== //

    // ===================================================== ADMIN =========================================================== //
    // The first account is the admin user.
    // countDocuments() is a mongoose method that counts how many documents are in the model collection.
    const isFirstAccount = (await UserModel.countDocuments()) === 0;

    req.body.role = isFirstAccount ? "admin" : "user";
    // ======================================================================================================================= //

    // =============================================== HASH PASSWORD  ======================================================== //

    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    // ======================================================================================================================= //


    // We use the create() method to create a new job document inside the users collection.
    const user = await UserModel.create(
        // if we add data that is not in the data schema, this data gets ignored.
        // In the object req.body contains the data that the user send as a post request
        req.body
    );
    
    // res.json({key: value} will send back the json data specified in the parenthesis to the user that made the post request.
    res.status(StatusCodes.CREATED).json(
        {
            user
        }
    );
        
    // ======================================================================================================================= //        

};
// =========================================================================================================================== //


import { UnauthenticatedError } from "../errors/custonErrors.js";
import { comparePassword } from "../utils/passwordUtils.js";
import { createJWT } from "../utils/tokenUtils.js";

export const login = async (req, res) => {

    const user = await UserModel.findOne({email: req.body.email});

    // Check if the email exists
    if(!user) {
        throw new UnauthenticatedError("invalid email")
    };

    const isPasswordCorrect = await comparePassword(req.body.password, user.password);

    // Check if the email already exists if the password is correct or not
    if(!isPasswordCorrect) {
        throw new UnauthenticatedError("invalid password");
    };

    // The front-end will send the token and the server will decode it
    const token = createJWT({userId: user._id, role: user.role});

    // COOKIE, When we make the post request for the login, a cookie is created and will come back in every request made by this
    // user. We'll use it to secure the application and the jobs information.
    // With this statement, the cookie comes back in every request. We're going to use it to authenticate the user, if the token is
    // valid, we'll allow the user to make requests.
    const oneDay = 1000 * 60 * 60 * 24;


    // When a user logged in a cookie and a token gets created with the payload containing the user data. Each user that logged in,
    // will have a different data in the cookie.
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === "production"
    });

    res.status(StatusCodes.OK).json(
        {
            msg: "user logged in",
            user: user
        }
    );
};

// make the user logged out
// this will change the cookie expires, then the user will not have the cookie.
export const logout = (req, res) => {
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    res.status(StatusCodes.OK).json(
        {
            msg: "user logged out"
        }
    );
};

