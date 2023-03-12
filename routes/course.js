const Router = require("express").Router;
const router = Router();
const course = require("../Controller/courseController");

router.get("/course/", course.getCourse);
router.get("/courses", course.getCourses);
router.get("/faculty", course.getCoursesByFaculty);
router.post("/course", course.addCourse);
router.put("/course", course.updateCourse);
router.delete("/course", course.deleteCourse);
router.post("/modules", course.getModule);

module.exports = router;
