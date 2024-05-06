import prisma from "../config/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateRandomNumber, imageValidator } from "../utils/helper.js";
class ProfileController {

    static async index(req, res) {
        try {
            const user = req.user
            return res.json({ user })
        } catch (error) {
            return res.status(500).json({ error: error.message, message: "Something went wrong" })
        }
    }

    static async show(req, res) {
        try {
            const { id } = req.params
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(id)
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    createdAt: true
                }
            })

            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }

            return res.status(200).json({ user })
        } catch (error) {
            return res.status(500).json({ error: error.message, message: "Something went wrong" })
        }
    }

    static async store(req, res) { } // Create user profile later

    // Update user profile
    static async update(req, res) {
        try {
            const { id } = req.params
            const authUser = req.user

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ message: "Profile image is required" })
            }

            const image = req.files.image
            const message = imageValidator(image?.size, image?.mimetype)

            if (message.status !== true) {
                return res.status(400).json({ message })
            }

            const imageExt = image.name.split(".").pop()
            const imageName = generateRandomNumber() + "." + imageExt
            const uploadPath = process.cwd() + "/public/images/" + imageName

            image.mv(uploadPath, async (err) => {
                if (err) {
                    return res.status(500).json({ message: "Failed to upload image" })
                }
            })

            await prisma.user.update({
                where: {
                    id: Number(id)
                },
                data: {
                    image: imageName
                }
            })

            return res.status(200).json({ message: "Profile image updated successfully" })

        } catch (error) {
            return res.status(500).json({ error: error.message, message: "Something went wrong" })
        }
    }
    static async destroy(req, res) { 
        try {
            const { id } = req.params
            const authUser = req.user

            if (authUser.role !== "ADMIN") {
                return res.status(403).json({ message: "You are not authorized to perform this action" })
            }

            await prisma.user.delete({
                where: {
                    id: Number(id)
                }
            })

            return res.status(200).json({ message: "User deleted successfully" })

        } catch (error) {
            return res.status(500).json({ error: error.message, message: "Something went wrong" })
        }
    }

}


export default ProfileController