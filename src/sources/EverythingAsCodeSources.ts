import { EaCDevOpsActionAsCode } from "./EaCDevOpsActionAsCode.ts";
import { EaCSourceAsCode } from "./EaCSourceAsCode.ts";
import { EaCSourceConnectionAsCode } from "./EaCSourceConnectionAsCode.ts";

export type EverythingAsCodeSources = {
  DevOpsActions?: Record<string, EaCDevOpsActionAsCode>;

  SourceConnections?: Record<string, EaCSourceConnectionAsCode>;

  Sources?: Record<string, EaCSourceAsCode>;
};

export function isEverythingAsCodeSources(
  eac: unknown,
): eac is EverythingAsCodeSources {
  const sourcesEaC = eac as EverythingAsCodeSources;

  return (
    sourcesEaC.SourceConnections !== undefined &&
    sourcesEaC.Sources !== undefined
  );
}
