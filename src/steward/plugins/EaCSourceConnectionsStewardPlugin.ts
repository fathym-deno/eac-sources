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

export type EaCSourceConnectionsStewardPluginOptions = EaCStewardPluginOptions;

export default class EaCSourceConnectionsStewardPlugin
  implements EaCRuntimePlugin {
  constructor(protected options?: EaCSourceConnectionsStewardPluginOptions) {}

  public Setup(_config: EaCRuntimeConfig): Promise<EaCRuntimePluginConfig> {
    const stewardApiMetaPath = import.meta.resolve(
      "../steward/api/connections",
    );

    const pluginConfig: EaCRuntimePluginConfig<
      EverythingAsCode & EverythingAsCodeApplications & EverythingAsCodeDenoKV
    > = buildStewardApiPluginConfig(
      EaCSourceConnectionsStewardPlugin.name,
      stewardApiMetaPath,
      "core",
      "steward-source-connections",
      "fathym:eac-sources/steward/api/connections",
      "/api/steward/source-connections*",
      "@fathym/eac-sources",
      this.options ?? {},
      "/src/steward/api/connections/",
    );

    return Promise.resolve(pluginConfig);
  }
}
