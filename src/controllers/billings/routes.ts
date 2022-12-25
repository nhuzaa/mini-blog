import { Router } from "express";
import addClaim from "./operation/add";
import allClaim from "./operation/all";

const billingRouter = Router();

billingRouter.post("/claims", addClaim);
billingRouter.get("/claims", allClaim);

export default billingRouter;
