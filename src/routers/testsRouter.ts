import { Router } from "express";
import { resetDatabase } from "../controllers/recommendationController.js";

const testsRouter = Router();

testsRouter.post("/reset-database", resetDatabase);

export default testsRouter;