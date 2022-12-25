import { Router } from "express";
import billingRouter from "../controllers/billings/routes";

const routes = Router();

// Billing routes
routes.use("/billing/", billingRouter);

export default routes;
