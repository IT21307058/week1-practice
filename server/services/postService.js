const postRepository = require("../repositories/postRepository");

class PostService {

    async uploadMedia(file, name, description) {
        const savedFile = await postRepository.saveFile(file);

        const post = await postRepository.savePost({
            name,
            description,
            fileUrl: `/files/${savedFile._id}`, 
        });

        return post;
    }

    async getAllPosts() {
        return await postRepository.getAllPosts();
    }
}

module.exports = new PostService();