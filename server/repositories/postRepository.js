const Post = require('../models/post');
const File = require('../models/file');


class PostRepository {
    async saveFile(file) {
        const newFile = new File({
            filename: file.originalname,
            contentType: file.mimetype,
            data: file.buffer
        });
        return await newFile.save();
    }

    async savePost(postData) {
        return await Post.create(postData);
    }

    async getPostById(id) {
        return await Post.findByPk(id);
    }

    async getAllPosts() {
        return await Post.findAll();
    }

    async getFileById(fileId) {
        return await File.findById(fileId);
    }
}

module.exports = new PostRepository();