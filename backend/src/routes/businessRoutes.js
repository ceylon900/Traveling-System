const router = require("express").Router();
const bizCtrl = require("../controllers/businessController");


router.post("/", bizCtrl.registerBusiness);
router.get("/businesses", bizCtrl.getAllBusinesses);
router.get("/business-details", bizCtrl.getDetailedBusinesses);
router.delete("/business/suspend/:id", bizCtrl.suspendBusiness);

router.put("/:id", bizCtrl.updateBusiness);
router.get("/user/:userId", bizCtrl.getUserBusiness);
router.get("/package-info/:packageId", bizCtrl.getBusinessByPackage);

module.exports = router;