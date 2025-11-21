import {
  EaCActuatorRequest,
  EaCActuatorResponse,
  EaCRuntimeHandlers,
} from "../.deps.ts";
import { EaCDevOpsActionAsCode } from "../../../sources/EaCDevOpsActionAsCode.ts";

export default {
  async POST(req, ctx) {
    const logger = ctx.Runtime.Logs;

    const handlerRequest: EaCActuatorRequest = await req.json();

    logger.Package.debug(
      `Processing EaC commit ${handlerRequest.CommitID} DevOps Action processes for action ${handlerRequest.Lookup}`,
    );

    const doaLookup = handlerRequest.Lookup;

    const doa = handlerRequest.Model as EaCDevOpsActionAsCode;

    return Response.json({
      Checks: [],
      Lookup: doaLookup,
      Messages: {
        Message: `The DevOps Action '${doaLookup}' has been handled.`,
      },
      Model: doa,
    } as EaCActuatorResponse);
  },
} as EaCRuntimeHandlers;
