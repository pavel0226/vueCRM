import { User, SearchFilter } from "@/types";

const SearchFilterOps = {
  equals: "",
  greaterThan: "_gt",
  lessThan: "_lt",
  greaterThanOrEqual: "_gte",
  lessThanOrEqual: "_lte",
  contains: "_like",
  startsWith: "_startsWith",
  endsWith: "_endsWith",
  between: "_between",
};

const SESSION_TOKEN_KEY = "vue-crm-token";
const SESSION_USER_KEY = "vue-crm-user";

export function setToken(token: string): void {
  if (sessionStorage) {
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  }
}

export function setUser(userData: string): void {
  if (sessionStorage) {
    sessionStorage.setItem(SESSION_USER_KEY, userData);
  }
}

export function getToken(): string {
  let token = "";
  if (sessionStorage) {
    const _token = sessionStorage.getItem(SESSION_TOKEN_KEY);
    token = _token ? _token : token;
  }
  return token;
}

export function getUser(): User {
  let user = {} as User;
  if (sessionStorage) {
    const userData = sessionStorage.getItem(SESSION_USER_KEY);
    user = userData ? (JSON.parse(userData) as User) : ({} as User);
  }
  return user;
}

export function cleanSession() {
  if (sessionStorage) {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_USER_KEY);
  }
}

export function capFirstLetter(s: string) {
  return s && s[0].toUpperCase() + s.slice(1);
}

export function clearSearchFilters(searchFilter: SearchFilter) {
  if (searchFilter) {
    if (searchFilter.filters) delete searchFilter.filters;

    Object.keys(searchFilter).forEach(filter => {
      if (searchFilter[filter]) {
        if (filter !== "between") {
          Object.keys(searchFilter[filter]).forEach(prop => {
            searchFilter[filter][prop] = null;
          });
        } else {
          Object.keys(searchFilter[filter]).forEach(prop => {
            searchFilter[filter][prop]["former"] = 0;
            searchFilter[filter][prop]["latter"] = 0;
          });
        }
      }
    });
  }
}

export function buildSearchFilters(searchVm: TODO) {
  if (searchVm) {
    searchVm.filters = [];

    Object.keys(searchVm).forEach((filter) => {
      if (filter === "between") {
        Object.keys(searchVm[filter]).forEach(propName => {
          if (
            searchVm.between[propName]["former"] > 0 ||
            searchVm.between[propName]["latter"] > 0
          ) {
            if (searchVm.between[propName]["former"] < searchVm.between[propName]["latter"]) {
              searchVm.filters.push({
                property: propName,
                op: SearchFilterOps.greaterThanOrEqual,
                val: searchVm.between[propName]["former"],
              });
              searchVm.filters.push({
                property: propName,
                op: SearchFilterOps.lessThanOrEqual,
                val: searchVm.between[propName]["latter"],
              });
            } else {
              searchVm.filters.push({
                property: propName,
                op: SearchFilterOps.lessThanOrEqual,
                val: searchVm.between[propName]["former"],
              });
              searchVm.filters.push({
                property: propName,
                op: SearchFilterOps.greaterThanOrEqual,
                val: searchVm.between[propName]["latter"],
              });
            }
          }
        });
      } else {
        Object.keys(searchVm[filter]).forEach(propName => {
          searchVm.filters.push({
            property: propName,
            op: SearchFilterOps[filter],
            val: searchVm[filter][propName],
          });
        });
      }
    });
  }
}

export function buildJsonServerQuery(searchVm: TODO) {
  let filterQuery = "";
  if (searchVm && searchVm.filters) {
    searchVm.filters.forEach((f: TODO) => {
      filterQuery += f.property;
      filterQuery += f.op;
      filterQuery += "=";
      filterQuery += f.val;
      filterQuery += "&";
    });
  }
  return filterQuery;
}

export function getRootComponent(vueComponent: TODO): any {
  const root = null;
  if (vueComponent && vueComponent._isVue) {
    if (vueComponent.isRootComponent) {
      return vueComponent;
    } else if (vueComponent.$parent) {
      return getRootComponent(vueComponent.$parent);
    } else {
      return root;
    }
  } else {
    return root;
  }
}

export function isValidRewards(rewards: number) {
  if (rewards < 0 || rewards > 9999) {
    return "Reward is required. It must be bewteen 0 and 9999";
  }
  return true;
}

export function isValidEmail(email: string) {
  /* eslint-disable no-useless-escape */
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email && !re.test(email)) return "Email is invalid.";
  return true;
}
