import { Router } from "express";
import tokenRoutes from "./token.routes";

const router = Router();

router.use("/token", tokenRoutes);

export default router;