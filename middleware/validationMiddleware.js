// We've created this file to reuse the validation middleware in multiple controllers to avoid repetition and make the code lean
// and organized.

// ===================================================== Validation ========================================================== //

import { body, validationResult } from "express-validator";

// =========================================================================================================================== //

// ================================================ Custon Error ============================================================= //

import { BadRequestError, UnauthorizedError } from "../errors/custonErrors.js";

// =========================================================================================================================== //

// ================================================ Theory / Basic =========================================================== //

// // setup express validator as our middleware, express validator are going to sit on top of the controller and if the value is not
// // present or doesn't match our condition, it will send an error. It needs to sit on top of the controllers because the functions
// // cannot create data that are not valid.
// // To set this up we need to add the brackets. It will receive the rules of validation and a function to check it. The function has
// // 3 parameters req, res and next, req will be exacly the value of req.body.
// app.post("/api/v1/test", [
//     // body that we've imported from express-validator is an object that contains the data of the post request just like req.body.
//     // but body() is a method that receives as a parameter the key of the object that we want to validate.
//     // With body we can chain the methods to validate the data.
//     // notEmpty() method checks if the data is empty or not.
//     body("name")
//     .notEmpty().withMessage("name is required")
//     .isLength({min:50}).withMessage("name must be at least 50")
// ], 
// (req, res, next) => {

//     // ValidationResult it checks for the data specified in body the validation of the rules passed.
//     const errors = validationResult(req);
        
//     // errors is an array with one object that we can use methods in it. For example we can check if the errors.isEmpty(),
//     // it will return false if we have some error, and true if we have no errors. If we have errors obviousily the array,
//     // will have data.

//     if (!errors.isEmpty()) {
            
//         // array() turns the errors json into an array.
//         const errorMessages = errors.array().map((error) => (error.msg));
//         return res.status(400).json({errors: errorMessages})
//     }


//     // next(): If everything is successfull, next() will pass the next middleware, in this case will pass to the controllers 
//     // down below. Otherwise the request will stop in this middleware.
//     next();

// }, (req, res) => {

//     // res.json({key: value} will send back the json data specified in the parenthesis to the user that made the post request.
//     // In the object req.body contains the data that the user send as a post request
//     const {name} = req.body;

//     res.json(
//         {
//             message: `hello ${name}`
//         }
//     );
// });    

// =========================================================================================================================== //


const withValidationErrors = (validateValues) => {
    return [validateValues, (req, res, next) => {

        // ValidationResult it checks for the data specified in body the validation of the rules passed.
        const errors = validationResult(req);
            
        // errors is an array with one object that we can use methods in it. For example we can check if the errors.isEmpty(),
        // it will return false if we have some error, and true if we have no errors. If we have errors obviousily the array,
        // will have data.
    
        if (!errors.isEmpty()) {
            
        
            // array() turns the errors json into an array.
            const errorMessages = errors.array().map((error) => (error.msg));


            if (errorMessages[0].startsWith("no job")) {
                throw new NotFoundError(errorMessages);
            };

            if (errorMessages[0].startsWith("not authorized")) {
                throw new UnauthorizedError("not authorized to access this route");
            }

            throw new BadRequestError(errorMessages);
        };
    
    
        // next(): If everything is successfull, next() will pass the next middleware, in this case will pass to the controllers 
        // down below. Otherwise the request will stop in this middleware.
        next();
    
    }]
};

// export const validateTest = withValidationErrors([
//     // body that we've imported from express-validator is an object that contains the data of the post request just like req.body.
//     // but body() is a method that receives as a parameter the key of the object that we want to validate.
//     // With body we can chain the methods to validate the data.
//     // notEmpty() method checks if the data is empty or not.
//     // .withMessage() is the message that we'll receive if we have an error.
//     body("name")
//     .notEmpty().withMessage("name is required")
//     .isLength({min:3, max:50}).withMessage("name must be between 3 and 50 characters long.").trim()
// ]);



// ================================================= Validation Input ======================================================== //

import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";

// It's important to remember that these validations is for the controllers that will use ref.body, in other words the controllers
// that will create or update data ones. The other controllers will not use those.

// When you start creating the validations always look at your data schema to set the validation to all of the fields.

export const ValidationJobInput = withValidationErrors([
    body("company").notEmpty().withMessage("company is required"),
    body("position").notEmpty().withMessage("position is required"),
    body("jobLocation").notEmpty().withMessage("job location is required"),

    //===================================================== ENUMS ============================================================ //
    body("jobStatus").isIn(Object.values(JOB_STATUS)).withMessage("invalid status value"),
    body("jobType").isIn(Object.values(JOB_TYPE)).withMessage("invalid type value")

    //======================================================================================================================== //
]);

// =========================================================================================================================== //


// ================================================= Validation of IDs ======================================================= //

// If we change one character of the id it will return a not_found 404 error, if we add more characters or less characters, it
// will return Bad request 400 error, We're going to do this creating this validation id params middleware that avoids cracking
// the server. That was happening because of the mongodb validation of the id.

// We can have 2 potencial errors when it comes to IDs in params.
// If we have the same syntax but the wrong value, we've receive the 404 error from our error handler. But a different type of
// error from the MongoDB.

//CHECK IF the id is a valid MONGODB id
import mongoose from "mongoose";


import { param } from "express-validator";
// param is an object that has the data of the routes. But the param() method from express-validator receives the param of the 
// route specified in our request as a parameter, in that case is the id that we want to validate. Just like the body() it can
// chain methods that are the rules of validation.c

// Job Validation
import JobModel from "../models/JobModel.js";
import { NotFoundError } from "../errors/custonErrors.js";

export const validateIdParam = withValidationErrors([
    // custon() method receives as a parameter a callback function. If we want to access the actual value of the id we need to 
    // specify in the callback function the value. Depending on what will return from the callback function, the request is going
    // be validated and will be passed to the next middleware (the controllers) or will going to be rejected. If it returns true,
    // the data is valid, if it returns false, its invalid data.
    // In this case, the value in the callback function is our id that is in the param(id).
    param("id").custom(async (value, {req}) => {

        // Check if the id is valid
        // Mongoose has a isValid() method that returns true or false depending of the validation of the id in the parameter of
        // the method.
        const isValidId = mongoose.Types.ObjectId.isValid(value);

        // In all of the controllers that needs the id we're checking if the job with that id actually exists and if not we 
        // throw an error with a message. But this functionality is been repeated a lot so we're doing the job validation
        // here.

        if (!isValidId) {
            throw new BadRequestError("invalid MongoDB id");
        };

        // Notice that in both of these throw errors our status gets overlaid by the Validation checker function so it doens't
        // matter if we use a custon error or a built in error from javascript.

        // This will find an document inside the collection that we specified in the model() with an specific id.
        const job = await JobModel.findById(value);
    
        if (!job) {
            // When we throw a error our error middlerware in the server.js file gets triggered. How do we send the message inside of
            // the Error() to the Error Middleware? We need to set up a custon error that is going to extend the Error class.        
            throw new NotFoundError(`no job with id ${value}`);
    
            // We can still use the res.status(404).json({msg: `no job with id ${id}`}), but it will not make the connection with the 
            // error middleware.
        };   
        
    //==============================================  VALIDATE ADMIN ========================================================= //
    // if the user that logged in is the admin then when he'll be able to get all the jobs from all the users, get every single job,
    // delete, update and create.
    // IMPORTANT: we want to disable the user to access other users data.

    // job has createBy key and req has the user object with role key.

    const isAdmin = req.user.role === "admin";    

    //======================================================================================================================== //

    //==============================================  VALIDATE OWNER ==========================================================//

    // IMPORTANT: we want to disable the user to access other users data.

    // createBy is an ObjectId, with toString() we convert it to the id string.
    const isOwner = req.user.userId === job.createdBy.toString()
    
    if (!isAdmin && !isOwner) {
        throw new UnauthorizedError("not authorized to access this route");
    };

    //======================================================================================================================== //

        
    })
    // Because we're working with a database and making requests is asyncronous, we cannot use the withMessage() method to send
    // the errors messages, instead we will throw our custon errors.
]);

// =========================================================================================================================== //


// ================================================= Validate User Register ================================================== //
import UserModel from "../models/UserModel.js";


export const validateUserInput = withValidationErrors([
    body("name").notEmpty().withMessage("name is required"),
    body("email").notEmpty().withMessage("email is required")
    .isEmail().withMessage("invalid email format").custom( async(email) => {
        const user = await UserModel.findOne({email});
        if (user) {
            throw new BadRequestError("email already exists");
        };
    }),
    body("password").notEmpty().withMessage("password is required")
    .isLength({min: 8}).withMessage("password must be at least 8 characters long"),

    body("lastName").notEmpty().withMessage("last name is required"),
    body("location").notEmpty().withMessage("location is required"),
    body("role")
]);
// =========================================================================================================================== //

// ================================================= Validate User Login  ==================================================== //

export const validateLoginInput = withValidationErrors([
    body("email").notEmpty().withMessage("email is required")
    .isEmail().withMessage("invalid email format"),
    body("password").notEmpty().withMessage("password is required")

]);
// =========================================================================================================================== //


// ================================================= Validate User Update ==================================================== //

export const validateUpdateUserInput = withValidationErrors([
    body("name").notEmpty().withMessage("name is required"),
    body("email").notEmpty().withMessage("email is required")
    .isEmail().withMessage("invalid email format").custom( async(email, {req}) => {
        const user = await UserModel.findOne({email});
        console.log(req)
        // Check if the user exists and the user it's really using this email that we checked that exists above.
        if (user && user._id.toString() !== req.user.userId ) {
            throw new BadRequestError("email already exists");
        };
    }),

    body("lastName").notEmpty().withMessage("last name is required"),
    body("location").notEmpty().withMessage("location is required"),
])

// =========================================================================================================================== //

