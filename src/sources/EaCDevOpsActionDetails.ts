import { EaCVertexDetails } from "./.deps.ts";

export type EaCDevOpsActionDetails = {
  Path?: string;

  Templates?: string[];
} & EaCVertexDetails;
