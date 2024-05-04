import { Router } from "express";
import ProfileController from "../controllers/profile.controller.js";
import authMiddleware from "../middleware/Authenticate.js";

const router = Router()

router.get("/profile",authMiddleware, ProfileController.index)

router.put("/profile/:id",authMiddleware, ProfileController.update)

router.get("/profile/:id", ProfileController.show)

router.delete("/profile/:id",authMiddleware, ProfileController.destroy)


export default router