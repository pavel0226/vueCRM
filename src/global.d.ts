declare module 'vue-cli-plugin-vuetify-preset-fortnightly/preset'

type TODO = any;

type Pagination = {
  page: number;
  totalItems: number;
  rowsPerPage: number;
  pages: number;
};

type SearchFilterOps = {
  Equals: '';
  GreaterThan: '_gte';
  LessThan: '_lte';
  GreaterThanOrEqual: '_gte';
  LessThanOrEqual: '_lte';
  Contains: '_like';
  StartsWith: '_like';
  EndsWith: '_like';
  Between: '';
};
