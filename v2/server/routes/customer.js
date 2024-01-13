const express = require("express");
const router = express.Router();
const customerController = require("../controller/customerController");

/**
 *  Customer Routes
 */
router.get("/", customerController.homepage);
router.get("/about", customerController.about);
router.get("/contact", customerController.contact);
router.get("/add", customerController.addCustomer);
router.post("/add", customerController.postCustomer);
router.get("/view/:id", customerController.view);
router.get("/edit/:id", customerController.edit);
router.put("/edit/:id", customerController.editPost);
router.delete("/edit/:id", customerController.deleteCustomer);
router.post("/search", customerController.searchCustomers);

module.exports = router;
