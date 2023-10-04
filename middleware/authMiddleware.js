// This middleware will check if the user can access the jobs or not. It will check if the token is valid.
// If it's valid, the user can make requests and get all jobs for example.

import { UnauthenticatedError, UnauthorizedError, BadRequestError } from "../errors/custonErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {

    const {token} = req.cookies;

    if (!token) {
        throw new UnauthenticatedError("authentication invalid");
    };

    // check if the jwt inside of the cookie is valid, then grab the id and the role.
    try {
        const {userId, role} = verifyJWT(token)

        const testUser = userId === "651b0a14fddb865f309cb059";
        // this req.user object is available in all of the controllers with the authMiddleware.
        req.user = {userId, role, testUser};
        // next(): If everything is successfull, next() will pass the next middleware, in this case will pass to the controllers 
        // down below. Otherwise the request will stop in this middleware.
        next();        
    } catch (error) {
        throw new UnauthenticatedError("authentication invalid"); 
    };
};


// This middleware will check if the user is an admin if not he'll not be able to access the get application stats controller.

export const authorizePermitions = (...roles) => {

    // returning a function
    return(
        (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                throw new UnauthorizedError("Unauthorized to access this route")
            };
            // next(): If everything is successfull, next() will pass the next middleware, in this case will pass to the controllers 
            // down below. Otherwise the request will stop in this middleware.  
            // we have the req.user because the authenticate user middleware are sitting on top of the controllers, where this 
            // middleware is on.

            next();     
        }
    )
}

export const checkForTestUser = (req, res, next) => {
    if (req.user.testUser) throw new BadRequestError('Demo User. Read Only!');
    next();
  };
