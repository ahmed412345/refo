/* Created by Ahmed Eltahan - 2026 */
import { Router } from "express";
import { addTrip } from "../controllers/trip";

const router = Router();

router.post("/trip", addTrip);

export default router;
