const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); 
const postController = require('../controllers/postController');

router.post('/upload', upload.single('file'), postController.upload);
router.get('/', postController.getPosts);

module.exports = router;