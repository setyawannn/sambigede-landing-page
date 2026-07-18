/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as apbdes from "../apbdes.js";
import type * as auth from "../auth.js";
import type * as bansos from "../bansos.js";
import type * as berita from "../berita.js";
import type * as penduduk from "../penduduk.js";
import type * as seed from "../seed.js";
import type * as stunting from "../stunting.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  apbdes: typeof apbdes;
  auth: typeof auth;
  bansos: typeof bansos;
  berita: typeof berita;
  penduduk: typeof penduduk;
  seed: typeof seed;
  stunting: typeof stunting;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
