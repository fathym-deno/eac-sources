import { buildStewardApiPluginConfig, EaCRuntimeConfig, EaCRuntimePlugin, EaCRuntimePluginConfig, EaCStewardPluginOptions, EverythingAsCode, EverythingAsCodeApplications, EverythingAsCodeDenoKV } from "./.deps.ts";

export type EaCSourcesStewardPluginOptions = EaCStewardPluginOptions;

export default class EaCSourcesStewardPlugin implements EaCRuntimePlugin {
  constructor(protected options?: EaCSourcesStewardPluginOptions) {}

  public Setup(_config: EaCRuntimeConfig): Promise<EaCRuntimePluginConfig> {
    const stewardApiMetaPath = import.meta.resolve("../api/devops-actions");

    const pluginConfig: EaCRuntimePluginConfig<
      EverythingAsCode & EverythingAsCodeApplications & EverythingAsCodeDenoKV
    > = buildStewardApiPluginConfig(
      EaCSourcesStewardPlugin.name,
      stewardApiMetaPath,
      "core",
      "steward-devops-actions",
      "fathym:eac-sources/steward/api/devops-actions",
      "/api/steward/devops-actions*",
      "@fathym/eac-sources",
      this.options ?? {},
      "/src/steward/api/devops-actions/",
    );

    return Promise.resolve(pluginConfig);
  }
}
