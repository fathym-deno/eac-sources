import {
  buildStewardApiPluginConfig,
  EaCRuntimeConfig,
  EaCRuntimePlugin,
  EaCRuntimePluginConfig,
  EaCStewardPluginOptions,
  EverythingAsCode,
  EverythingAsCodeApplications,
  EverythingAsCodeDenoKV,
} from "./.deps.ts";

export type EaCSourcesStewardPluginOptions = EaCStewardPluginOptions;

export default class EaCSourcesStewardPlugin implements EaCRuntimePlugin {
  constructor(protected options?: EaCSourcesStewardPluginOptions) {}

  public Setup(_config: EaCRuntimeConfig): Promise<EaCRuntimePluginConfig> {
    const stewardApiMetaPath = import.meta.resolve("../api/sources");

    const pluginConfig: EaCRuntimePluginConfig<
      EverythingAsCode & EverythingAsCodeApplications & EverythingAsCodeDenoKV
    > = buildStewardApiPluginConfig(
      EaCSourcesStewardPlugin.name,
      stewardApiMetaPath,
      "core",
      "steward-sources",
      "fathym:eac-sources/steward/api/sources",
      "/api/steward/sources*",
      "@fathym/eac-sources",
      this.options ?? {},
      "/src/steward/api/sources/",
    );

    return Promise.resolve(pluginConfig);
  }
}
