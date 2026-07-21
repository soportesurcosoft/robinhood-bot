import { Router } from "express";
import { tokenController } from "../controllers/token.controller";

const router = Router();

router.get("/:contract", tokenController);

export default router;