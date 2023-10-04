// All the CRUD structures are going basically to the URL localhost:5100/api/v1/jobs or localhost:5100/api/v1/jobs/:id, so to avoid
// repetition and make it more organized, we've create the routes folder and the jobRouter file to make it separated.

// We will use the Router() from the express module, this will make the same thing that we were doing in the server.js, make the 
// requests to those routes/URLs.
import {Router} from "express";
const router = Router();

// Import the controllers/CRUD functions that we've created.
import {getAllJobs, createJob, getJob, updateJob, DeleteJob} from "../controllers/jobControllers.js";

// ================================================= Validation Input ======================================================== //
import { ValidationJobInput } from "../middleware/validationMiddleware.js";
// we will use the validation middleware only in the controllers that create or update data.
// =========================================================================================================================== //

// ================================================= Validate id param  =======================================================//
import { validateIdParam } from "../middleware/validationMiddleware.js";
// we will use the validation id params middleware only in the controllers that use the id or have the id param route.
// =========================================================================================================================== //
import { checkForTestUser } from "../middleware/authMiddleware.js";

import { showStats } from "../controllers/jobControllers.js";

router.route("/").get(getAllJobs).post(checkForTestUser, ValidationJobInput, createJob);

router.route("/stats").get(showStats);

router.route("/:id")
.get(validateIdParam, getJob)
.patch(checkForTestUser, ValidationJobInput, validateIdParam, updateJob)
.delete(checkForTestUser, validateIdParam, DeleteJob);

export default router;