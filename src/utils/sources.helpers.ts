import {
  base64,
  Buffer,
  eacGetSecrets,
  EaCGitHubAppProviderDetails,
  EverythingAsCode,
  EverythingAsCodeClouds,
  Handlebars,
  loadSecretClient,
  sodium,
  TelemetryLogger,
} from "./.deps.ts";
import { EaCSourceActionType } from "../sources/EaCSourceActionType.ts";
import { EaCSourceAsCode } from "../sources/EaCSourceAsCode.ts";
import { EaCSourceConnectionAsCode } from "../sources/EaCSourceConnectionAsCode.ts";
import { EverythingAsCodeSources } from "../sources/EverythingAsCodeSources.ts";
import { configureRepository } from "./configureRepository.ts";
import { getOrCreateRepository } from "./getOrCreateRepository.ts";
import { loadOctokit } from "./loadOctokit.ts";
import { tryGetRepository } from "./tryGetRepository.ts";
import { ContentFile } from "./types.ts";

export async function ensureSource(
  providerDetails: EaCGitHubAppProviderDetails,
  connection: EaCSourceConnectionAsCode,
  sourceLookup: string,
  _currentSource: EaCSourceAsCode,
  source: EaCSourceAsCode,
  action?: EaCSourceActionType,
): Promise<EaCSourceAsCode> {
  const octokit = await loadOctokit(providerDetails, connection.Details!);

  let repository = await tryGetRepository(
    octokit,
    source.Details!.Organization!,
    source.Details!.Repository!,
  );

  if (action && !repository) {
    const [_type, orgRepo] = sourceLookup.split("://");

    const [organizationName, repositoryName] = orgRepo.split("/");

    switch (action) {
      case "fork": {
        const org = source.Details!.Organization === source.Details!.Username
          ? undefined
          : source.Details!.Organization!;

        const _forkResp = await octokit.rest.repos.createFork({
          owner: organizationName,
          repo: repositoryName,
          organization: org,
          name: source.Details!.Repository!,
        });

        repository = await tryGetRepository(
          octokit,
          source.Details!.Organization!,
          source.Details!.Repository!,
        );
        break;
      }

      case "import": {
        break;
      }

      case "template": {
        const tempResp = await octokit.rest.repos.createUsingTemplate({
          template_owner: organizationName,
          template_repo: repositoryName,
          owner: source.Details!.Organization!,
          name: source.Details!.Repository!,
        });

        // deno-lint-ignore no-explicit-any
        repository = tempResp.data! as any;

        break;
      }

      default: {
        repository = await getOrCreateRepository(octokit, source.Details!);
        break;
      }
    }
  }

  if (repository) {
    repository = await configureRepository(
      octokit,
      repository,
      source.Details!,
    );
  }

  return source;
}

export async function ensureSourceArtifacts(
  logger: TelemetryLogger,
  eac: EverythingAsCodeSources & EverythingAsCode,
  providerDetails: EaCGitHubAppProviderDetails,
  connection: EaCSourceConnectionAsCode,
  currentSource: EaCSourceAsCode,
  source: EaCSourceAsCode,
): Promise<EaCSourceAsCode> {
  if (source.SecretLookups) {
    const octokit = await loadOctokit(providerDetails, connection.Details!);

    const artifactLookups = Object.keys(source.Artifacts || {});

    const sourceDetails = source.Details || currentSource.Details!;

    for (const artifactLookup of artifactLookups) {
      const artifact = source.Artifacts![artifactLookup];

      const artifactDetails = artifact.Details ||
        currentSource.Artifacts![artifactLookup]?.Details!;

      const artifactParameters = artifact.Parameters ||
        currentSource.Artifacts![artifactLookup]?.Parameters ||
        {};

      const doaLookup = artifact.DevOpsActionTriggerLookup ||
        currentSource.Artifacts![artifactLookup]?.DevOpsActionTriggerLookup!;

      const doa = eac.DevOpsActions![doaLookup];

      const actionParts: string[] = [];

      for (const templatePath of doa.Details!.Templates || []) {
        const pathParts = templatePath.split("/");

        const file = pathParts[pathParts.length - 1];

        const templateContentsResp = await fetch(templatePath);

        let templateContents = await templateContentsResp.text();

        if (file.startsWith(".hbs.")) {
          templateContents = Handlebars.compile(templateContents)({
            ...artifactDetails,
            ...artifactParameters,
          });
        }

        actionParts.push(templateContents);
      }

      const action = actionParts.join("\n");

      let sha: string | undefined = undefined;

      try {
        const existingAction = await octokit.rest.repos.getContent({
          owner: sourceDetails.Organization!,
          repo: sourceDetails.Repository!,
          path: `.github/workflows/${doa.Details!.Path}`,
        });

        const file = existingAction.data as ContentFile;

        sha = file.sha;
      } catch (err) {
        logger.error("There was an error loading the github workflow action", {
          err,
        });
      }

      await octokit.rest.repos.createOrUpdateFileContents({
        owner: sourceDetails.Organization!,
        repo: sourceDetails.Repository!,
        content: base64.encodeBase64(action),
        path: `.github/workflows/${doa.Details!.Path}`,
        message: "Fathym configured GitHub action",
        sha,
      });

      // await octokit.rest.actions.enable
    }
  }

  return source;
}

export async function ensureSourceSecrets(
  eac: EverythingAsCodeClouds,
  providerDetails: EaCGitHubAppProviderDetails,
  connection: EaCSourceConnectionAsCode,
  currentSource: EaCSourceAsCode,
  source: EaCSourceAsCode,
): Promise<EaCSourceAsCode> {
  if (source.SecretLookups) {
    const octokit = await loadOctokit(providerDetails, connection.Details!);

    const secretLookups = Object.keys(source.SecretLookups);

    const sourceDetails = source.Details || currentSource.Details!;

    for (const secretLookup of secretLookups) {
      const secret = eac.Secrets![source.SecretLookups[secretLookup]]!;

      const secretClient = await loadSecretClient(
        eac,
        secret.CloudLookup!,
        secret.KeyVaultLookup!,
      );

      const secreted = await eacGetSecrets(secretClient, {
        Value: secret.Details!.Value!,
      });

      const publicKey = await octokit.rest.actions.getRepoPublicKey({
        owner: sourceDetails.Organization!,
        repo: sourceDetails.Repository!,
      });

      // const messageBytes = Buffer.from(secreted.Value);

      // const keyBytes = Buffer.from(publicKey.data.key, 'base64');

      const encryptedBytes = sodium.seal(publicKey.data.key, secreted.Value);

      const encValue = Buffer.from(encryptedBytes).toString("base64");

      await octokit.rest.actions.createOrUpdateRepoSecret({
        owner: sourceDetails.Organization!,
        repo: sourceDetails.Repository!,
        secret_name: secretLookup,
        encrypted_value: encValue,
        key_id: publicKey.data.key_id,
      });
    }
  }

  return source;
}
