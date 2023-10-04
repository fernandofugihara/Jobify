import { StatusCodes } from "http-status-codes";

import UserModel from "../models/UserModel.js";

import JobModel from "../models/JobModel.js";


// Read the user
export const getCurrentUser = async (req, res) => {

    const id = req.user.userId;

    const user = await UserModel.findOne({_id: id});

    const userWithoutPassword = user.toJSON();

    res.status(StatusCodes.OK).json(
        {
            user: userWithoutPassword
        }
    );
};


// get application stats
// This will be an admin controller that the admin will be able to check how many users are in the application and the jobs.
// We need to create a validation middleware to avoid that users can have this admin only access.
export const getApplicationStats = async (req, res) => {

    // Model.countDocuments() is a mongoose method that counts how many documents are in the model collection.
    const users = await UserModel.countDocuments();
    const jobs = await JobModel.countDocuments();


    res.status(StatusCodes.OK).json(
        {
            users,
            jobs
        }
    );
};

// update user
import cloudinary from "cloudinary";
import {promises as fs} from "fs";

export const updateUser = async (req, res) => {
    
    // The user will not be able to update his password.
    const newUser = {...req.body};
    // delete will delete the password from the obj.
    delete newUser.password

    if(req.file) {
        const response = await cloudinary.v2.uploader.upload(req.file.path);
        await fs.unlink(req.file.path);
        newUser.avatar = response.secure_url;
        newUser.avatarPublicId = response.public_id;
    }

    const id = req.user.userId;
    
    // We're returning the old data because new = false.
    const updatedUser = await UserModel.findByIdAndUpdate(id, newUser);

    if(req.file && updatedUser.avatarPublicId) {
        await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId)
    }

    res.status(StatusCodes.OK).json(
        {
            msg: "update user",
            user: updatedUser,
        }
    );
};