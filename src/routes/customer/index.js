import { Router } from "express";
const router = Router();

router.post("/test", (req, res) => {
  res.send("Hello World2!");
});

export default router;
