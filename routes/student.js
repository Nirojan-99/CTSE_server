const Router = require("express").Router;
const router = Router();
const student = require("../Controller/studentsController");

router.get("/search", student.getStudentsByName);
router.post("/student", student.addStudent);
router.get("/student", student.getStudent);
router.get("/students", student.getStudents);
router.put("/student", student.updateStudent);
router.delete("/student", student.deleteStudent);

module.exports = router;
