import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";

const router = Router()

router.post("/register", AuthController.register)
router.post("/login", AuthController.login)

// router.get('/test', (req, res) => {
//     return res.json({ message: 'Hello  test auth!' });
// });


export default router