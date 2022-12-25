import { Claim } from "./domain/claim.domain";

export interface BillingRepository {
  createClaim(): Promise<Claim>;
}
