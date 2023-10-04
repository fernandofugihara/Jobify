// A data model is the structure of our data. In this application we'll be creating jobs and each job will have a position, a 
// company, a job location, a job status and a job type.
// In order to organize our app and organize our server.js we create a separate folder named models and a JobModel file to made
// the code organized and great for debugging.


import mongoose from "mongoose";

import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";

const JobSchema = new mongoose.Schema(
    {
        company: String,
        position: String,
        jobStatus: {
            type: String,
            // enum is a predefined set of values for a select box for example.
            // Object.values(object) returns an array with the object values.
            enum: Object.values(JOB_STATUS),
            // in case if the jobStatus is not specified, it set the value to pending.
            default: JOB_STATUS.PENDING
        },
        jobType: {
            type: String,
            enum: Object.values(JOB_TYPE),
            default: JOB_TYPE.FULL_TIME
        },
        jobLocation: {
            type: String,
            default: "my-city"
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    },
    {
        // Whenever we create data, we're going to receive the data _id and the created at and updated at field.
        timestamps: true
    }
);

// We're creating a collection named Job (will be jobs in mongodb), that within are the data fields that we've created. To specify
// the data structure, the model() method receives two parameters the name of the collection and the data schema.
// collection is where all the jobs are going to be stored.
// The job that we're going to create using the model will be in the jobs collection.
export default mongoose.model("Job", JobSchema);