const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); 
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

// hi hi
router.post('/upload', upload.single('file'), postController.upload);
router.get('/', postController.getPosts);
router.delete('/:id', authMiddleware, postController.deletePost);
router.get('/test', postController.testEndpoint);
router.get('/test1', postController.testEndpoint1);
router.get('/test2', postController.testEndpoint2);
router.get('/test3', postController.testEndpoint3);
router.get('/test4', postController.testEndpoint4);
router.get('/test5', postController.testEndpoint5);

module.exports = router;