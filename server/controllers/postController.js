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

            console.log("Posts", posts)
            res.json(posts);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deletePost(req, res) {
        try {
            const { id } = req.params;

            const result = await postService.deletePost(id);
            res.json(result);
        } catch (err) {
            console.error(err);

            if (err.message === 'Post not found') {
                return res.status(404).json({ message: 'Post not found' });
            }

            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async testEndpoint(req, res) {
        try {
            const testData = {
                message: 'Test endpoint is working!',
                timestamp: new Date().toISOString(),
                status: 'success',
                data: {
                    query: req.query,
                    params: req.params,
                    body: req.body
                }
            };
            res.status(200).json(testData);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new PostController();