const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); 
const postController = require('../controllers/postController');

router.post('/upload', upload.single('file'), postController.upload);
router.get('/', postController.getPosts);
router.delete('/posts/:id', postController.deletePost);

module.exports = router;