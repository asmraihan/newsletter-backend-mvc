import prisma from "../config/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../config/nodemailer.config.js";
import logger from "../utils/logger.js";
import { emailQueue } from "../jobs/emailQueue.job.js";
class AuthController {
    static async register(req, res) {
        try {
            const body = req.body;

            // check if email already exists

            const userExists = await prisma.user.findUnique({
                where: {
                    email: body.email
                }
            })

            if (userExists) {
                return res.status(400).json({ message: "User with this email already exists" })
            }

            // encrypt password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(body.password, salt);
            body.password = hashedPassword;

            const user = await prisma.user.create({
                data: body
            })

            return res.status(201).json({ user, message: "User created successfully" })

        } catch (error) {
            return res.status(500).json({ error: error.message, message: "Something went wrong" })
        }
    }

    static async login(req, res) {
        try {
            const body = req.body;

            // find user by email
            const findUser = await prisma.user.findUnique({
                where: {
                    email: body.email
                }
            })

            if (!findUser) {
                return res.status(404).json({ message: "User not found" })
            }

            // compare password
            const comparePassword = bcrypt.compareSync(body.password, findUser.password);

            if (!comparePassword) {
                return res.status(400).json({ message: "Invalid credentials" })
            }

            // issue token
            const payload = {
                id: findUser.id,
                name: findUser.name,
                email: findUser.email,
                image: findUser.image

            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" })

            return res.status(200).json({ accessToken: `Bearer ${token}`, message: "Login successful" })

        } catch (error) {
            return res.status(500).json({ error: error.message, message: "Something went wrong" })
        }
    }

    // test email

    static async sendEmail(req, res) {
        try {
            const { email } = req.query

            const payload = [
                {
                    toEmail: email,
                    subject: "Test Email",
                    text: "This is a test email",
                    html: "<p>This is a test email</p>"
                },
                {
                    toEmail: email,
                    subject: "Test Email 2",
                    text: "This is a test email 2",
                    html: "<p>This is a test email 2</p>"
                }
            ]

            // await sendMail(payload.toEmail, payload.subject, payload.text, payload.html)

            await emailQueue.add("emailQueue", payload)

            return res.status(200).json({ message: "job added successfully" })

        } catch (error) {
            logger.error({ type: "email error", message: error.message })
            return res.status(500).json({ error: error.message, message: "Something went wrong" })
        }
    }


}


export default AuthController