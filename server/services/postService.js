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
        const posts = await postRepository.getAllPosts();

        const postsWithFiles = await Promise.all(
            posts.map(async (post) => {
                const fileId = post.fileUrl.split('/files/')[1];

                try {
                    const file = await postRepository.getFileById(fileId);

                    if (file) {
                        return {
                            ...post.toJSON(),
                            file: {
                                _id: file._id,
                                filename: file.filename,
                                contentType: file.contentType,
                                data: file.data.toString('base64'),
                                url: post.fileUrl
                            }
                        };
                    }
                } catch (err) {
                    console.error(`Error fetching file ${fileId}:`, err);
                }

                return post.toJSON();
            })
        );

        return postsWithFiles;
    }

    async deletePost(id) {
        const post = await postRepository.getPostById(id);

        if (!post) {
            throw new Error('Post not found');
        }

        const fileId = post.fileUrl.split('/files/')[1];

        if (fileId) {
            try {
                await postRepository.deleteFile(fileId);
                console.log(`File ${fileId} deleted successfully`);
            } catch (err) {
                console.error(`Error deleting file ${fileId}:`, err);
            }
        }

        const result = await postRepository.deletePost(id);

        if (result === 0) {
            throw new Error('Post not found');
        }

        return { message: 'Post and file deleted successfully' };
    }
}

module.exports = new PostService();