const postService = require("../services/postService");

class PostController {

    async upload(req, res) {
        try {
            const { name, description } = req.body;
            const file = req.file;

            if (!file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const post = await postService.uploadMedia(file, name, description);
            res.status(201).json(post);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getPosts(req, res) {
        try {
            const posts = await postService.getAllPosts();
            res.json(posts);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new PostController();