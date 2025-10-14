const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); 
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/upload', authMiddleware, upload.single('file'), postController.upload);
router.get('/', postController.getPosts);
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;