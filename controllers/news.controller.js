import prisma from "../utils/db.config.js";
import { imageValidator } from "../utils/helper.js";
import { removeImage, uploadImage } from "../utils/imageHandler.js";
import logger from "../utils/logger.js";
import redisCache from "../utils/redis.config.js";
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


            const news = await prisma.news.create({
                data: {
                    title: body.title,
                    content: body.content,
                    image: result.imageName,
                    user_id: user.id
                }
            })

            // remove cache from redis
            redisCache.del("/api/news" , (err, count) => {
                if(err){
                    throw err
                }
            })

            return res.status(200).json({ news, message: "News created successfully" })

        } catch (error) {
            // log error
            logger.error(error?.message)
            return res.status(500).json({ error: error.message, message: "Something went wrong" })
        }
    }

    static async show(req, res) {
        try {
            const { id } = req.params
            const news = await prisma.news.findUnique({
                where: {
                    id: +id
                },
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

            if (!news) {
                return res.status(404).json({ message: "Not found" })
            }

            return res.status(200).json({ news })

        } catch (error) {
            return res.status(500).json({ error: error.message, message: "Something went wrong" })
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params
            const user = req.user
            const body = req.body

            const news = await prisma.news.findUnique({
                where: {
                    id: +id
                }
            })

            if(user.id !== news.user_id && user.role !== "ADMIN"){
                return res.status(403).json({message: "You are not authorized to perform this action"})
            }

            const image = req?.files?.image
            let imageName = undefined

            if (image) {
                const message = imageValidator(image?.size, image?.mimetype)

                if (message.status !== true) {
                    return res.status(400).json({ message })
                }

                // upload new image
                const newImage = await uploadImage(image);
                imageName = newImage.imageName

                // delete old image
                await removeImage(news.image)
            }

            await prisma.news.update({
                where: {
                    id: +id
                },
                data: {
                    title: body.title,
                    content: body.content,
                    image: imageName
                }
            })

            return res.status(200).json({ message: "News updated successfully" })
        } catch (error) {
            return res.status(500).json({ error: error.message, message: "Something went wrong" })
        }
    }

    static async destroy(req, res) {

        try {
            const { id } = req.params
            const user = req.user

            const news = await prisma.news.findUnique({
                where: {
                    id: +id
                }
            })

            if (!news) {
                return res.status(404).json({ message: "Not found" })
            }

            if (user.id !== news.user_id && user.role !== "ADMIN") {
                return res.status(403).json({ message: "You are not authorized to perform this action" })
            }

            await removeImage(news.image)

            await prisma.news.delete({
                where: {
                    id: +id
                }
            })

            return res.status(200).json({ message: "News deleted successfully" })
        } catch (error) {
            return res.status(500).json({ error: error.message, message: "Something went wrong" })
        }
    }


}


export default NewsController