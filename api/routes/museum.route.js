/* Created by Ahmed Eltahan - 2026 */
import { Router } from "express";
import { addMuseum } from "../controllers/museum.js";

const router = Router();

router.post("/museums", addMuseum);
router.post("/museum", addMuseum);

export default router;
