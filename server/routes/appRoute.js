const { Router } = require("express");
const { initialApp, sendPrompt } = require("../controllers/controller");

const router = Router();

router.get("/", initialApp);

router.post("/", sendPrompt);

module.exports = router;
