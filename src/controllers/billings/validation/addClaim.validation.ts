import Joi from "joi";

export const addClaimSchema = Joi.object().keys({
  name: Joi.string().required(),
  any_other: Joi.string().required(),
});

export default addClaimSchema;
