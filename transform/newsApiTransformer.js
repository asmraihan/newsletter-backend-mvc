import { getImageUrl } from "../utils/helper.js";

class NewsApiTransform {
    static transform(data) {
        return {
            id: data.id,
            title: data.title,
            content: data.content,
            image: getImageUrl(data.image),
        }
    }
}

export default NewsApiTransform;