import { EaCDetails } from "./.deps.ts";
import { EaCArtifactAsCode } from "./EaCArtifactAsCode.ts";
import { EaCSourceDetails } from "./EaCSourceDetails.ts";

export type EaCSourceAsCode = {
  Artifacts?: Record<string, EaCArtifactAsCode>;

  SecretLookups?: Record<string, string>;
} & EaCDetails<EaCSourceDetails>;
