import { generateRandomNumber } from "./helper.js";

const uploadImage = async (image) => {
    console.log(image)
    const imageExt = image.name.split(".").pop()
    const imageName = generateRandomNumber() + "." + imageExt
    const uploadPath = process.cwd() + "/public/images/" + imageName

    return new Promise((resolve, reject) => {
        image.mv(uploadPath, (err) => {
            if (err) {
                reject({ status: 500, message: "Failed to upload image" });
            } else {
                resolve({ status: 200, message: "Image uploaded successfully", imageName: imageName  });
            }
        });
    });
}


export { uploadImage }