const Router = require("express").Router;
const router = Router();
const staff = require("../Controller/staffController");

router.get("/search", staff.getStaffsByName);
router.post("/staff", staff.addStaff);
router.get("/staff", staff.getStaff);
router.get("/HOD", staff.getStaffHOD);
router.get("/staffs", staff.getStaffs);
router.put("/staff", staff.updateStaff);
router.delete("/staff", staff.deleteStaff);

module.exports = router;
