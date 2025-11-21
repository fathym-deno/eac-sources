import {
  EaCActuatorConnectionsRequest,
  EaCActuatorConnectionsResponse,
  eacGetSecrets,
  EaCGitHubAppProviderDetails,
  EaCRuntimeHandlers,
  EverythingAsCode,
  EverythingAsCodeClouds,
  EverythingAsCodeGitHub,
  EverythingAsCodeIdentity,
  loadSecretClient,
} from "../.deps.ts";
import { EaCSourceConnectionAsCode } from "../../../sources/EaCSourceConnectionAsCode.ts";
import { EverythingAsCodeSources } from "../../../sources/EverythingAsCodeSources.ts";
import { loadOctokit } from "../../../utils/loadOctokit.ts";
import { SimpleUser } from "../../../utils/types.ts";

export default {
  async POST(req, ctx) {
    const handlerRequest: EaCActuatorConnectionsRequest = await req.json();

    const eac: EverythingAsCode & EverythingAsCodeSources = handlerRequest.EaC;

    const parentEaC:
      & EverythingAsCode
      & EverythingAsCodeIdentity
      & EverythingAsCodeGitHub
      & EverythingAsCodeClouds = handlerRequest.ParentEaC!;

    const sourceConnDef = handlerRequest.Model as EaCSourceConnectionAsCode;

    const sourceConn = handlerRequest.Current as EaCSourceConnectionAsCode;

    const gitHubApp = parentEaC.GitHubApps![sourceConn.GitHubAppLookup!];

    const provider = parentEaC.Providers![gitHubApp.Details!.ProviderLookup];

    const secretClient = await loadSecretClient(
      parentEaC,
      gitHubApp.CloudLookup!,
      gitHubApp.KeyVaultLookup!,
    );

    const details = provider.Details as EaCGitHubAppProviderDetails;

    const secreted = await eacGetSecrets(secretClient, {
      ClientSecret: details?.ClientSecret!,
      PrivateKey: details?.PrivateKey!,
      WebhooksSecret: details?.WebhooksSecret!,
    });

    const providerDetails = {
      ...details,
      ...secreted,
    } as EaCGitHubAppProviderDetails;

    const organizationLookups = Object.keys(sourceConnDef.Organizations || {});

    const [_type, username] = handlerRequest.Lookup.split("://");

    const organizations: Record<
      string,
      Record<
        string,
        {
          Branches: string[];
        }
      >
    > = {
      // [username]: {},
    };

    const query = `query paginate($cursor: String) {
      viewer {
        organizations(first: 100, after: $cursor) {
          nodes {
            login
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }`;

    try {
      const octokit = await loadOctokit(
        providerDetails,
        gitHubApp.Details!,
        sourceConn.Details!,
      );

      const installs = await octokit.rest.apps
        .listInstallationsForAuthenticatedUser();

      installs.data.installations.forEach((installation) => {
        const account = installation.account! as SimpleUser;

        organizations[account.login] = {};
      });
    } catch (err) {
      // err.toString();
    }

    return Response.json({
      Model: {
        Organizations: organizations,
      } as EaCSourceConnectionAsCode,
    } as EaCActuatorConnectionsResponse);
  },
} as EaCRuntimeHandlers;
