import prisma from "../utils/db.config.js";

class AuthController {
    static async register(req, res) {
        try {
            const body = req.body;
            return res.json(body)
        } catch (error) {
            // console.log(error)
            return res.status(500).json({ error: error.message })
        }
    }
}


export default AuthController