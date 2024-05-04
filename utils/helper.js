import {v4 as uuidv4} from "uuid"


export const imageValidator = (size, mimeType) => {
    if (bytesToMb(size) > 2) {
        return { status: false, message: "Image size should not be more than 2MB" }
    }
    if (!supportedMimeTypes.includes(mimeType)) {
        return { status: false, message: "Image type not supported" }
    }
    return { status: true, message: "Image is valid" }
}

export const bytesToMb = (bytes) => {
    return bytes / 1024 / 1024
}

export const supportedMimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/svg", "image/gif", "image/webp"]


export const generateRandomNumber = () => {
    return uuidv4()
}