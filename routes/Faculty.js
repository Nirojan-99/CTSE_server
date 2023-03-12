const Router = require("express").Router;
const router = Router();
const faculty = require("../Controller/facultyController");

router.get("/faculty/", faculty.getFaculty);
router.get("/faculties", faculty.getFaculties);
router.post("/faculty", faculty.addFaculty);
router.put("/faculty", faculty.updateFaculty);
router.delete("/faculty", faculty.deleteFaculty);

module.exports = router;
