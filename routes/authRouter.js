import { Router } from "express";
import { login, logout, register } from "../controllers/authController.js";


const router = Router();

// ================================================= Validation User ========================================================= //
import { validateUserInput, validateLoginInput } from "../middleware/validationMiddleware.js";
// =========================================================================================================================== //

router.post("/register", validateUserInput ,register);
router.post("/login", validateLoginInput, login);
router.get("/logout", logout);

export default router;