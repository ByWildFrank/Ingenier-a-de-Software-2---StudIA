const express = require('express');
const router = express.Router();
const controller = require('../controllers/apuntes.controller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

router.get('/materia/:materiaId', controller.obtenerPorMateria);
router.post('/', upload.single('archivo'), controller.crear);

module.exports = router;
