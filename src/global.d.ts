declare module "vue-cli-plugin-vuetify-preset-fortnightly/preset";

declare module "vue-progressbar" {
  import { PluginFunction } from "vue";

  export const install: PluginFunction<{}>;

  interface ProgressMethods {
    start(): void;
    finish(): void;
    parseMeta(m:any):void;
    fail(): void;
  }

  module "vue/types/vue" {
    interface Vue {
      $Progress: ProgressMethods;
    }
  }
}

type TODO = any;

type Pagination = {
  page: number;
  totalItems: number;
  rowsPerPage: number;
  pages: number;
};

type SearchFilterOps = {
  Equals: "";
  GreaterThan: "_gte";
  LessThan: "_lte";
  GreaterThanOrEqual: "_gte";
  LessThanOrEqual: "_lte";
  Contains: "_like";
  StartsWith: "_like";
  EndsWith: "_like";
  Between: "";
};

type TableHeader = {
  text: string;
  value: string;
  left?: boolean;
};

type SeachQuery = {
  contains?: {};
  between?: {};
  startsWith?: {};
  endsWith?: {};
  equals?: {};
  lessThen: {};
  greaterThan: {};
};
