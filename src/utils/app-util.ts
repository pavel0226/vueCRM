// import {TODO} from '@/types'

import { User } from '@/types';

/* eslint-disable */
const SearchFilterOps = {
  Equals: '',
  GreaterThan: '_gte',
  LessThan: '_lte',
  GreaterThanOrEqual: '_gte',
  LessThanOrEqual: '_lte',
  Contains: '_like',
  StartsWith: '_like',
  EndsWith: '_like',
  Between: ''
};

const SESSION_TOKEN_KEY = "vue-crm-token";
const SESSION_USER_KEY = "vue-crm-user";


// export default {
export function setToken(token: string) :void{
  // localStorage;
  if (sessionStorage){
      sessionStorage.setItem(SESSION_TOKEN_KEY , token);
  }
}

export function setUser(userData: string) :void{
  // localStorage;
  if (sessionStorage){
    sessionStorage.setItem(SESSION_USER_KEY , userData);
  }
}


export function getToken() :string{
  let token = "";
  if (sessionStorage){
     const _token  =  sessionStorage.getItem(SESSION_TOKEN_KEY);
     token = _token ? _token :token;
  }
  return token;
}

export function getUser() :User{
  let user = {} as User;
  if (sessionStorage){
    const userData = sessionStorage.getItem(SESSION_USER_KEY)
    user =  userData? JSON.parse(userData) as User: {} as User;
  }
  return user;
}

export function cleanSession(){
  if (sessionStorage){
    sessionStorage.removeItem(SESSION_TOKEN_KEY)
    sessionStorage.removeItem(SESSION_USER_KEY)
  }
}

export function capFirstLetter(s: string) {
  return s && s[0].toUpperCase() + s.slice(1);
}
export function clearSearchFilters(searchVm: TODO) {
  if (searchVm) {
    if (searchVm.filters) delete searchVm.filters;

    Object.keys(searchVm).forEach(K => {
      if (searchVm[K]) {
        if (K !== 'between') {
          Object.keys(searchVm[K]).forEach(prop => {
            searchVm[K][prop] = null;
          });
        } else {
          Object.keys(searchVm[K]).forEach(prop => {
            searchVm[K][prop]['former'] = 0;
            searchVm[K][prop]['latter'] = 0;
          });
        }
      }
    });
  }
}
export function buildSearchFilters(searchVm: TODO) {
  if (searchVm) {
    searchVm.filters = [];
    if (searchVm.contains) {
      Object.keys(searchVm.contains).forEach(k => {
        if (searchVm.contains.hasOwnProperty(k) && searchVm.contains[k]) {
          searchVm.filters.push({
            property: k,
            op: SearchFilterOps.Contains,
            val: searchVm.contains[k]
          });
        }
      });
    }

    if (searchVm.equals) {
      Object.keys(searchVm.equals).forEach(k => {
        if (searchVm.equals.hasOwnProperty(k) && searchVm.equals[k]) {
          searchVm.filters.push({
            property: k,
            op: SearchFilterOps.Equals,
            val: searchVm.equals[k]
          });
        }
      });
    }

    if (searchVm.startsWith) {
      Object.keys(searchVm.startsWith).forEach(k => {
        if (searchVm.startsWith.hasOwnProperty(k) && searchVm.startsWith[k]) {
          searchVm.filters.push({
            property: k,
            op: SearchFilterOps.StartsWith,
            val: searchVm.startsWith[k]
          });
        }
      });
    }

    if (searchVm.endsWith) {
      Object.keys(searchVm.endsWith).forEach(k => {
        if (searchVm.endsWith.hasOwnProperty(k) && searchVm.endsWith[k]) {
          searchVm.filters.push({
            property: k,
            op: SearchFilterOps.EndsWith,
            val: searchVm.endsWith[k]
          });
        }
      });
    }

    if (searchVm.between) {
      Object.keys(searchVm.between).forEach(k => {
        if (searchVm.between.hasOwnProperty(k) && searchVm.between[k]) {
          if (searchVm.between[k]['former'] > 0 || searchVm.between[k]['latter'] > 0) {
            if (searchVm.between[k]['former'] < searchVm.between[k]['latter']) {
              searchVm.filters.push({
                property: k,
                op: SearchFilterOps.GreaterThanOrEqual,
                val: searchVm.between[k]['former']
              });
              searchVm.filters.push({
                property: k,
                op: SearchFilterOps.LessThanOrEqual,
                val: searchVm.between[k]['latter']
              });
            } else {
              searchVm.filters.push({
                property: k,
                op: SearchFilterOps.LessThanOrEqual,
                val: searchVm.between[k]['former']
              });
              searchVm.filters.push({
                property: k,
                op: SearchFilterOps.GreaterThanOrEqual,
                val: searchVm.between[k]['latter']
              });
            }
          }
        }
      });
    }
  }
}
export function buildJsonServerQuery(searchVm: TODO) {
  let filterQuery = '';
  if (searchVm && searchVm.filters) {
    searchVm.filters.forEach((f: TODO) => {
      filterQuery += f.property;
      filterQuery += f.op;
      filterQuery += '=';
      filterQuery += f.val;
      filterQuery += '&';
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
// };
