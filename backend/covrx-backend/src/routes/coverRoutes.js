const express = require('express');
const CoverController = require('../controllers/coverController');

const router = express.Router();
const coverController = new CoverController();

// Define routes for cover operations
router.post('/', coverController.createCover.bind(coverController));
router.get('/', coverController.getCovers.bind(coverController));
router.get('/:id', coverController.getCoverById.bind(coverController));
router.put('/:id', coverController.updateCover.bind(coverController));
router.delete('/:id', coverController.deleteCover.bind(coverController));

module.exports = router;