import { Router } from "express";
import ProfileController from "../controllers/profile.controller.js";
import authMiddleware from "../middleware/Authenticate.js";

const router = Router()

router.get("/profile",authMiddleware, ProfileController.index)

router.put("/profile/:id",authMiddleware, ProfileController.update)


export default router