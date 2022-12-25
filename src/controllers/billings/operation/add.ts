import { Request, Response } from "express";
import { ClaimRequest } from "../dto/claim.dto";

import otelApi, {
  defaultTextMapGetter,
  ROOT_CONTEXT,
} from "@opentelemetry/api";
import { W3CTraceContextPropagator } from "@opentelemetry/core";

const addClaim = async (req: Request, res: Response) => {
  const tracer = otelApi.trace.getTracer(process.env.NODE_ENV || "development");
  const propagator = new W3CTraceContextPropagator();

  /**
   * If this microservice needs the context of its parent, then carrier object should have following kind of object passed from its parent.
   * {
   *    traceparent : "00-alsklshlhoiaisudhfno239023-90onoasndoih-29"
   * }
   * then,
   *
   * const carrier = {
   *    traceparent : "00-alsklshlhoiaisudhfno239023-90onoasndoih-29"
   * }
   *
   * else,
   *
   * create empty object
   *
   *
   */

  const carrier = {};

  /**
   * If this microservice needs the context of its parent, then carrier object should have following kind of object passed from its parent.
   *
   *
   * we need to extract the context of its parent by carrier and then write the following.
   *
   * const parentCtx = propagator.extract(
   *  ROOT_CONTEXT,
   *  carrier,
   *  defaultTextMapGetter
   * );
   *
   *
   * Start the trace with parentcontext
   * const childSpan = tracer.startSpan('Consumer', undefined, parentCtx);
   *
   * else do the following
   */

  const childSpan = tracer.startSpan("Fetch all billing records");

  // call DTO for changing request body to domain object. "folder: /controllers/billings/dto"
  const params: ClaimRequest = req.body;

  // call validation if necessary "folder: /controllers/billings/validation"

  // call usecase 'createClaim' "folder: /modules/billings/usecase"

  // change the response to DTO object "folder: /controllers/billings/dto"

  // return response to JSON or any other format

  childSpan.addEvent(`Payload: ${JSON.stringify(params)}`);
  childSpan.end();

  // res.send({
  //   message: "Saved",
  // });
};

export default addClaim;
