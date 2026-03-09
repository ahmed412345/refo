import { Router } from "express";
import { getSources } from "../controllers/sources.js";

const router = Router();

router.get("/sources", getSources);

export default router;
