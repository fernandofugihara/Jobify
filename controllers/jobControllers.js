// We've created a new folder named controllers and a new file named jobControllers to make the server.js more lean and organized
// and to make the controllers/CRUD operations second parameter funcionality reunite in one place. Then we will export these to 
// the server.js file.
// Our goal is to make our controllers as lean as possible.

// ================================================ Job Model ================================================================ //
import JobModel from "../models/JobModel.js"
// =========================================================================================================================== //


// ================================================ Async Errors ============================================================= //

// if we don't handle the async error correctly, our server will CRASH and will not return. To solve this we need to use try and
// catch for all the assync requests / controllers or use a library.
// This library will handle those async errors.
import 'express-async-errors';
// =============================================== ASYNC ERRORS ========================================================== //

// try {
//     // ================================= CREATE A DOCUMENT INSIDE OF THE JOBS COLLECTION ================================= //

//     // We use the create() method to create a new job documents inside the jobs collection.
//     const job = await JobModel.create(
//         // if we add data that is not in the data schema, this data gets ignored.
//         "something"
//     );

//     res.status(201).json(
//         {
//             job
//         }
//     );
        
//     // =================================================================================================================== //        
// } catch (error) {
//     // if we add a invalid constant inside of the create() method it brings out an error.
//     res.status(500).json(
//         {
//             msg: "server error"
//         }
//     );
// };
// ======================================================================================================================= //

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


// ================================================ Custon Error ============================================================= //

import { NotFoundError } from "../errors/custonErrors.js";
// we will not used, its be validated in the validation middleware.
// =========================================================================================================================== //

import mongoose from "mongoose";
import day from "dayjs";


// ====================================== GET ALL DATA / READ ALL DATA funcionality ========================================== //
export const getAllJobs = async (req, res) => {
    
    
    // ================================= GET/READ A DOCUMENT INSIDE OF THE JOBS COLLECTION =================================== //
    // In the JobModel, we specified the collection that the documents will be, using find() with an empty object as a parameter,
    // it will return all the documents from the collection. If we add an specific information as a parameter if will return the
    // data that has this information.

    const {search, jobStatus, jobType, sort} = req.query;

    const queryObject = {
        createdBy: req.user.userId,
    };

    if(search) {
        queryObject.$or = [
            {position: {$regex: search, $options: "i"}},
            {company: {$regex: search, $options: "i"}}
        ];
    };

    if(jobStatus && jobStatus !== "all") {
        queryObject.jobStatus = jobStatus
    };

    if(jobType && jobType !== "all") {
        queryObject.jobType = jobType
    };

    const sortOptions = {
        newest: "-createdAt",
        oldest: "createdAt",
        "a-z": "position",
        "z-a": "-position"
    };

    const sortKey = sortOptions[sort] || sortOptions.newest;

    //setup pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // We'll read only the data that a specific user created. Only the admin can read all of the jobs.
    const jobs = await JobModel.find(queryObject).sort(sortKey).skip(skip).limit(limit);

    const totalJobs = await JobModel.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalJobs / limit);
    // ======================================================================================================================= //

    // the built in status() method accepts an parameter that is the status code of the request if we send 200 it means that the
    // request was successfull. It is a good practice doing that.
    res.status(StatusCodes.OK).json(
        {   
            totalJobs,
            numOfPages,
            currentPage: page,
            jobs
        }
    );
};

// =========================================================================================================================== //


// ============================================ CREATE DATA funcionality ===================================================== //
export const createJob = async (req, res) => {


    // When we create a job we want to set the createdBy field to the user that created the job.
    req.body.createdBy = req.user.userId;

    // ================================= CREATE A DOCUMENT INSIDE OF THE JOBS COLLECTION ===================================== //

    // We use the create() method to create a new job documents inside the jobs collection.
    const job = await JobModel.create(
        // if we add data that is not in the data schema, this data gets ignored.
        // In the object req.body contains the data that the user send as a post request
        req.body
    );
    
    // res.json({key: value} will send back the json data specified in the parenthesis to the user that made the post request.
    res.status(StatusCodes.CREATED).json(
        {
            job
        }
    );
        
    // ======================================================================================================================= //        

    // if we add a invalid constant inside of the create() method it brings out an error.
    res.status(500).json(
        {
            msg: "server error"
        }
);

// =========================================================================================================================== //

};



// ================================== GET SINGLE DATA / READ SINGLE DATA funcionality ======================================== //
export const getJob = async (req, res) => {

    const {id} = req.params;

    // ================================= GET/READ A SINGLE DOCUMENT INSIDE OF THE JOBS COLLECTION ============================ //
    // This will find an document inside the collection that we specified in the model() with an specific id.
    const job = await JobModel.findById(id);

    // ======================================================================================================================= //

    // We're making the job validation in the validation middleware.

    res.status(StatusCodes.OK).json(
        {
            job
        }
    );
};
// =========================================================================================================================== //


// ============================================== UPDATE DATA functionality ================================================== //
export const updateJob = async (req, res) => {

    const {id} = req.params;

    // ================================= UPDATE A DOCUMENT INSIDE OF THE JOBS COLLECTION ===================================== //

    // Model.findByIdAndUpdate(id, json that we want to update, {options}) will update from the collection the document with a 
    // specific id, update the data to the new json in the second parameter and send the new data specified in the options.
    // By default it will send the old data before the updated data, setting {new: true} it will send the only the new data.
    // If we change only one field, the rest will stay the same.
    // The default is to return the original, unaltered document. If you want the new, updated document to be returned you have to 
    // pass an additional argument: an object with the new property set to true.
    const updatedJob = await JobModel.findByIdAndUpdate(id, req.body, {
        new: true
    });

    // ======================================================================================================================= //

    // We're making the job validation in the validation middleware.

    res.status(StatusCodes.OK).json(
        {
            msg: "job has been updated",
            job: updatedJob
        }
    );

};
// =========================================================================================================================== //


// ================================================ DELETE JOB funcionality. ================================================= //
export const DeleteJob = async (req, res) => {

    const {id} = req.params;

    // ================================= REMOVE A DOCUMENT INSIDE OF THE JOBS COLLECTION ===================================== //

    // Model.findByIdAndDelete(id) will delete from the collection the document with a specific id.
    const removedJob = await JobModel.findByIdAndDelete(id);

    // ======================================================================================================================= //

    // We're making the job validation in the validation middleware.

    res.status(StatusCodes.OK).json(
        {
            msg: `the job with id ${id} has been deleted.`,
            deletedJob: removedJob
        }
    );

};
// =========================================================================================================================== //

export const showStats = async (req, res) => {

    let stats = await JobModel.aggregate([
        {
            $match: {createdBy: new mongoose.Types.ObjectId(req.user.userId)}
        },
        {
            $group: {_id: "$jobStatus", count: {$sum: 1}}
        }
    ]);

    stats = stats.reduce((acc, curr) => {
        const {_id: title, count} = curr;
        acc[title] = count;
        return acc;
    }, {});

    console.log(stats)

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0
    };

    let monthlyApplications = await JobModel.aggregate([
        {
            $match: {createdBy: new mongoose.Types.ObjectId(req.user.userId)}
        },
        {
            $group: {
                _id: {year: {$year: "$createdAt"}, month: {$month: "$createdAt"}},
                count: {$sum: 1}
            }
        },
        {
            $sort: {"_id.year": -1, "_id.month": -1}
        },
        {
            $limit: 6
        }
    ]);

    monthlyApplications = monthlyApplications.map((item) => {
        const {_id: {year, month}, count} = item;

        const date = day().month(month - 1).year(year).format("MMM YY");

        return {date, count}
    }).reverse();

    console.log(monthlyApplications)


    res.status(StatusCodes.OK).json(
        {
            defaultStats,
            monthlyApplications
        }
    )
};
