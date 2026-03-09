import { Router } from "express";
import { chatWithAi } from "../controllers/AI.js";

const router = Router();

router.post("/askai", chatWithAi);

export default router;
