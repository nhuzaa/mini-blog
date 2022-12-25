import { Claim } from "../domain/claim.domain";

export const createClaim = async (): Promise<Claim> => {
  // here we write the logics where we achieve completing the particular usecase.

  // communication between usecases is done in this layer.

  // for achieving the usecases, we can call "service layer" as well
  const response: Claim = {
    activityId: "activity_id",
    createdDate: new Date(),
  };
  return response;
};
