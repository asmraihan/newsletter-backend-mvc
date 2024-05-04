import prisma from "../utils/db.config.js";
import { generateRandomNumber, imageValidator } from "../utils/helper.js";
import { uploadImage } from "../utils/imageHandler.js";
class NewsController {
    static async index(req, res) {
        try {
            const page = +req.query.page || 1
            const limit = +req.query.limit || 10

            if (page <= 0) {
                page = 1
            }

            if (limit <= 0 || limit > 100) {
                limit = 10
            }

            const skip = (page - 1) * limit

            const news = await prisma.news.findMany({
                take: limit,
                skip: skip,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    }
                }
            })

            const totalNews = await prisma.news.count()
            const totalPages = Math.ceil(totalNews / limit)

            return res.status(200).json({
                news, metadata: {
                    totalNews,
                    totalPages,
                    currentPage: page,
                    currentLimit: limit
                }
            })
        } catch (error) {
            return res.status(500).json({ error: error.message, message: "Something went wrong" })
        }
    }

    static async store(req, res) {
        try {
            const user = req.user
            const body = req.body

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ message: "Image is required" })
            }

            const image = req.files.image
            const message = imageValidator(image?.size, image?.mimetype)

            if (message.status !== true) {
                return res.status(400).json({ message })
            }

            const result = await uploadImage(image);

            console.log(result.imageName)

            const news = await prisma.news.create({
                data: {
                    title: body.title,
                    content: body.content,
                    image: result.imageName,
                    user_id: user.id
                }
            })

            return res.status(200).json({ news, message: "News created successfully" })

        } catch (error) {
            return res.status(500).json({ error: error.message, message: "Something went wrong" })
        }
    }

    static async show(req, res) {
        try {

        } catch (error) {
            return res.status(500).json({ error: error.message, message: "Something went wrong" })
        }
    }


    static async update(req, res) {
        try {

        } catch (error) {
            return res.status(500).json({ error: error.message, message: "Something went wrong" })
        }
    }

    static async destroy(req, res) {
        try {

        } catch (error) {
            return res.status(500).json({ error: error.message, message: "Something went wrong" })
        }
    }


}


export default NewsController