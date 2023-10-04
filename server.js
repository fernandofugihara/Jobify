import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import morgan from "morgan";


// router
// This is the router middleware that we've created, to use this middeware we use the built in app.use() method, and then enter 
// two parameters to it the root route and the router that we've create.
import jobRouter from "./routes/jobRouter.js";


// This is the auth middleware that we've created, to use this middleware, we use the built in app.use() method, and then enter 
// two parameters
import authRouter from "./routes/authRouter.js";


// This is the auth middleware that we've created, to use this middleware, we use the built in app.use() method, and then enter 
// two parameters
import userRouter from "./routes/userRouter.js";

// public
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.resolve(__dirname, './public')));

import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// error middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";

// auth middleware -> check if the user is logged in to access the jobs, only if it's logged the user can access the functionality.
// The jobs will be protected by this middleware, and there we'll check the cookie and the JWT token that contains the user data and
// show that the user is logged in.
import { authenticateUser } from "./middleware/authMiddleware.js";

// VERIFY COOKIE MIDDLEWARE
import cookieParser from "cookie-parser";
app.use(cookieParser());


// json middleware, that we can aceept json data that will be coming from de front-end.
// We are going to use the built in express middlewere express.json().
// To use the middlewere we use the built in method use() and the middlewere inside of the parenthesis. Doing this the middlewere
// will be used in all routes off the app.
app.use(express.json());


if (process.env.NODE_ENV === "development") {
    // We'll use the morgan middeware in "dev" mode that logs the type of the request made, the status of the request and the time.
    app.use(morgan("dev"));
};


app.get("/", (req, res) => {
    res.send("hello world");
});



// A proxy in front-end development is a server that acts as an intermediary between the client side application and an external
// API, helping to bypass security restrictions and handle requests to different domains. It allows the front-end application to 
// make API requests through the proxy, which forwards the requests to the external API and returns responses back to the application.

// By default browsers do not allow acess resources from different servers. That's the case for our project, we have the client
// frontend server running on localhost:5130 and the backend running on the localhost:5100 server.

// We need a proxy to allows us to make the connection between the servers and allow the client to make requests to our backend.

// We need to set up a proxy on the front-end during development, that is important because we need to set up the frontend and the
// backend in the same server because we're passing through the cookie data.

app.get("/api/v1/test", (req, res) => {
    res.json({msg: "test route"})
});

// ===================================================== JOB CRUD ============================================================ //

app.use("/api/v1/jobs", authenticateUser , jobRouter);

// =================================================== END CRUD ============================================================== //

// ==================================================== AUTH CRUD ============================================================ //
// Login - Register - Logout
app.use("/api/v1/auth", authRouter);

// =================================================== END CRUD ============================================================= //

// ==================================================== USER CRUD ============================================================ //
// to get the users data, we need to check if the user that logged in is valid and check if the user is an admin.


app.use("/api/v1/users", authenticateUser, userRouter);

// =================================================== END CRUD ============================================================= //

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./public", "index.html"))
});

// Not Found Middleware: It will be triggered when an request didn't found the URL specified.
// "*" will make the middleware work for all the request and URLs
// If we type out the url wrong for example: localhost:5100/api/v1/jobsss, express will send back an HTML file with the 404 error,
// that is a little bit confusing.
// Using the Not Found Middleware the user will receive the 404 error in a json format with a custon message that is great for the
// development and error handling.
// The "not found" middleware in Express.js is used when a request is made to a route that does not exist. It catches these requests 
// and responds with a 404 status code, indicating that the requested resource was not found.
app.use("*", (req, res) => {
    res.status(404).json(
        {
            msg: "not found"
        }
    );
});


// Error Middleware: It will be triggered when an internal error in the server code happened.
// If we type the wrong name in the const for example it will trigger an internal 500 error.
// There are two types of errors: 1- The code erros that are made as mistakes for example typos and 2- The errors that we set up.
// We can throw an error: throw new Error("no job with that id"); Express will pass this set up error to the error middleware that
// will show up as a json.
// The Error middleware needs to be last middleware to be used.
app.use(errorHandlerMiddleware);



const PORT = process.env.PORT || 5100;


// =================================================== MONGOOSE ============================================================= //
import mongoose from "mongoose";

try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}...`);
    });    
} catch (error) {
    console.log(error);
    process.exit(1);
};

// =================================================== END MONGOOSE ========================================================= //


