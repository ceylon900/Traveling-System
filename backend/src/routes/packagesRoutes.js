const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); 
const {
    createPackage,
    updatePackage,
    deletePackage,
    getAllPackages,
    getPackageById,
    getCategories
} = require('../controllers/packageController');

router.get('/', getAllPackages);
router.get('/categories', getCategories);
router.get('/:id', getPackageById);

router.post('/', upload.single('image'), createPackage);
router.put('/:id', upload.single('image'), updatePackage);
router.delete('/:id', deletePackage);

module.exports = router;