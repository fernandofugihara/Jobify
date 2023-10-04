// In this app a user can create, read, delete, update a job. Each account will belong to different person with a unique name,
// email, password


import mongoose from "mongoose";


const UserSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        lastName: {
            type: String,
            default: "lastName"
        },
        location: {
            type: String,
            default: "my-city"
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        avatar: String,
        avatarPublicId: String
    }
);

// hide password in get current user controller.
UserSchema.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.password;
    return obj;
};

export default mongoose.model("User", UserSchema);