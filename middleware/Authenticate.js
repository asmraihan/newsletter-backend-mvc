import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || authHeader === null || authHeader === undefined) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const token = authHeader.split(" ")[1]

    // verify token
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return res.status(403).json({ message: "Forbidden" })
        }
        req.user = user
        next()
    })
}

export default authMiddleware