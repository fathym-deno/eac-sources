import { components, RestEndpointMethodTypes } from "./.deps.ts";

export type ShortBranch = components["schemas"]["short-branch"];

export type ProtectedBranch = components["schemas"]["protected-branch"];

export type Branch = ShortBranch; // & ProtectedBranch;

export type ContentFile = components["schemas"]["content-file"];

export type Installation = components["schemas"]["installation"];

export type Organization = components["schemas"]["organization-full"];

export type RepositoryCreateInOrgParameters =
  RestEndpointMethodTypes["repos"]["createInOrg"]["parameters"];

export type RepositoryCreateForAuthenticatedUserParameters =
  RestEndpointMethodTypes["repos"]["createInOrg"]["parameters"];

export type NewRepository =
  | RepositoryCreateInOrgParameters
  | RepositoryCreateForAuthenticatedUserParameters;

export type Repository = components["schemas"]["repository"];

export type SimpleUser = components["schemas"]["simple-user"];
