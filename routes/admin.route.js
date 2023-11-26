const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.get('/', adminController.getAdminPage);
router.post('/add-to-fav', adminController.addToFavorite);
router.delete('/remove-from-fav', adminController.removeFromFavorite);

module.exports = router;
