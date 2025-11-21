import {
  delay,
  EaCActuatorErrorResponse,
  EaCActuatorRequest,
  EaCActuatorResponse,
  eacGetSecrets,
  EaCGitHubAppProviderDetails,
  EaCRuntimeHandlers,
  EaCSourceActionType,
  EaCSourceAsCode,
  ensureSource,
  ensureSourceArtifacts,
  ensureSourceSecrets,
  EverythingAsCode,
  EverythingAsCodeClouds,
  EverythingAsCodeGitHub,
  EverythingAsCodeIdentity,
  EverythingAsCodeSources,
  loadSecretClient,
} from "../.deps.ts";

export default {
  async POST(req, ctx) {
    const logger = ctx.Runtime.Logs;

    try {
      // const username = ctx.state.Username;

      const handlerRequest: EaCActuatorRequest = await req.json();

      logger.Package.debug(
        `Processing EaC commit ${handlerRequest.CommitID} Source processes for source ${handlerRequest.Lookup}`,
      );

      const eac:
        & EverythingAsCode
        & EverythingAsCodeSources
        & EverythingAsCodeClouds = handlerRequest.EaC;

      const currentSources = eac.Sources || {};

      let [sourceLookup, actionValue] = handlerRequest.Lookup.split("|")
        .reverse();

      const action = actionValue as EaCSourceActionType | undefined;

      const current = currentSources[sourceLookup] || {};

      let source = handlerRequest.Model as EaCSourceAsCode;

      if (source.Details || source.SourceLookups) {
        const parentEaC:
          & EverythingAsCode
          & EverythingAsCodeGitHub
          & EverythingAsCodeClouds
          & EverythingAsCodeIdentity = handlerRequest.ParentEaC!;

        const sourceConnection = eac.SourceConnections![
          `${(source.Details || current.Details!).Type}://${(
            source.Details || current.Details!
          ).Username!}`
        ];

        const gitHubApp =
          parentEaC.GitHubApps![sourceConnection.GitHubAppLookup!];

        const provider =
          parentEaC.Providers![gitHubApp.Details!.ProviderLookup];

        const details = provider.Details! as EaCGitHubAppProviderDetails;

        const secretClient = await loadSecretClient(
          parentEaC,
          gitHubApp.CloudLookup!,
          gitHubApp.KeyVaultLookup!,
        );

        const secreted = await eacGetSecrets(secretClient, {
          ClientSecret: details.ClientSecret!,
          PrivateKey: details.PrivateKey!,
          WebhooksSecret: details.WebhooksSecret!,
        });

        const providerDetails = {
          ...details,
          ...secreted,
        } as EaCGitHubAppProviderDetails;

        if (source.Details) {
          source = await ensureSource(
            providerDetails,
            sourceConnection,
            sourceLookup,
            current,
            source,
            action,
          );

          sourceLookup = `${source.Details!.Type}://${
            source.Details!.Organization
          }/${source.Details!.Repository}`;

          await delay(5000);
        }

        await ensureSourceSecrets(
          eac,
          providerDetails,
          sourceConnection,
          current,
          source,
        );

        await delay(1000);

        await ensureSourceArtifacts(
          logger.Package,
          eac,
          providerDetails,
          sourceConnection,
          current,
          source,
        );
      }

      return Response.json({
        Checks: [],
        Lookup: sourceLookup,
        Messages: {
          Message: `The source '${sourceLookup}' has been handled.`,
        },
        Model: source,
      } as EaCActuatorResponse);
    } catch (err) {
      logger.Package.error("There was an error setting up the sources", err);

      return Response.json({
        HasError: true,
        Messages: {
          Error: JSON.stringify(err),
        },
      } as EaCActuatorErrorResponse);
    }
  },
} as EaCRuntimeHandlers;
