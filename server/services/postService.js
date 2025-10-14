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
        const posts =  await postRepository.getAllPosts();

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
}

module.exports = new PostService();