import { Router } from "express";
import { me } from "../controllers/auth.controller";

const router = Router();

router.post("/me", me);

export default router;
