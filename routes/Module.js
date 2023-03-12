const Router = require("express").Router;
const router = Router();
const modules = require("../Controller/moduleController");

router.get("/module/", modules.getModule);
router.get("/modules", modules.getModules);
router.get("/search", modules.getModulesByName);
router.post("/module", modules.addModule);
router.put("/module", modules.updateModule);
router.delete("/module/", modules.deleteModule);
router.get("/LIC/", modules.getLIC);

module.exports = router;