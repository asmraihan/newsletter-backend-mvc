import { Router } from "express";
import NewsController from "../controllers/news.controller.js";
import authMiddleware from "../middleware/Authenticate.js";
import redisCache from "../config/redis.config.js";

const router = Router()

router.get("/news", redisCache.route(), NewsController.index)

router.post("/news",authMiddleware, NewsController.store)

router.get("/news/:id", NewsController.show)

router.put("/news/:id",authMiddleware, NewsController.update)

router.delete("/news/:id",authMiddleware, NewsController.destroy)


export default router