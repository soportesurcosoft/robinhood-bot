import { Router } from "express";
import { tokenController } from "../controllers/token.controller.js";

const router = Router();

// Paper-mode token inspection. The address must be an EVM contract address.
router.get("/:contract", tokenController);

export default router;