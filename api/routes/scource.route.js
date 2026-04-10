/* Created by Ahmed Eltahan - 2026 */
import { Router } from "express";
import { addSrcFromUser, getSources } from "../controllers/sources.js";

const router = Router();

router.get("/sources", getSources);

router.post("/sources", addSrcFromUser);

export default router;
