import { DB } from './demo-data';
import { Entity } from '@/types';

// const ds = db; // Object.assign({}, db);

const ds: TODO = DB;

function getModel(action: string) {
  if (action.includes('?') && action.includes('/')) {
    return action.indexOf('?') > action.indexOf('/') ? action.substring(0, action.indexOf('/')) : action.substring(0, action.indexOf('?'));
  } else {
    return action.includes('?') ? action.substring(0, action.indexOf('?')) : action.substring(0, action.indexOf('/'));
  }
}

function getId(action: string, model: TODO): number {
  action = action.substr(model.length + 1);
  const idStr = action.length > 0 && (action.includes('?') ? action.substring(0, action.indexOf('?')) : action);
  if (typeof idStr === 'string') {
    return parseInt(idStr);
  } else return -1;
}

function getExpand(action: string, model: string) {
  action = action.substr(action.indexOf('?'));
  return action.includes('_expand')
    ? action.includes('&')
      ? action.substring('_expand='.length + 1, action.indexOf('&'))
      : action.substring('_expand='.length + 1)
    : undefined;
}

// function getEmbed(action) {
//   return action.includes('?') ? action.substring(action.indexOf('/'), action.indexOf('?')) : action.substring(action.indexOf('/'));
// }

// export default{
export function getData(action: string): Promise<TODO> {
  return new Promise(function(resolve, reject) {
    const model = getModel(action);
    const id = getId(action, model);
    // const id :string = isNaN(idStr) ? undefined : parseInt(idStr);
    const exp = getExpand(action, model);
    const expandModel = exp ? (exp === 'category' ? 'categories' : exp + 's') : exp;
    // const embed = getEmbed(action);
    console.log(model);
    let result;
    let expand, expandId: TODO;
    console.log(expandModel);
    if (model in ds) {
      if (id) {
        result = ds[model][ds[model].findIndex((d: { id: number }) => d.id === id)];

        if (expandModel) {
          expand = expandModel === 'categories' ? 'category' : expandModel.substr(0, expandModel.length - 1);
          expandId = result[expand + 'Id'];
          result[expand] = ds[expandModel][ds[expandModel].findIndex((d: { id: any }) => d.id === expandId)];
        }
      } else {
        result = ds[model].map((m: { [x: string]: any }) => {
          if (expandModel) {
            expand = expandModel === 'categories' ? 'category' : expandModel.substr(0, expandModel.length - 1);
            expandId = m[expand + 'Id'];
            m[expand] = ds[expandModel][ds[expandModel].findIndex((d: { id: any }) => d.id === expandId)];
          }
          return m;
        });
      }
    }
    setTimeout(resolve, 200, { data: result });
  });
}
export function postData(action: string, data: Entity): Promise<TODO> {
  return new Promise(function(resolve, reject) {
    const model = getModel(action);
    // data.id = ds[model] + 1;
    ds[model].push(data);
    setTimeout(resolve, 200, { data: data });
  });
}
export function putData(action: string, data: Entity): Promise<TODO> {
  return new Promise(function(resolve, reject) {
    const model = getModel(action);
    const idx = ds[model].findIndex((d: { id: number }) => d.id === data.id);
    ds[model][idx] = Object.assign({}, data);
    setTimeout(resolve, 200, { data: data });
  });
}
export function deleteData(action: string, data: string): Promise<TODO> {
  return new Promise(function(resolve, reject) {
    const model = getModel(action);
    const id = getId(action, data);
    if (id > 0) {
      ds[model].splice(ds[model].findIndex((d: Entity) => d.id === id));
    }
    setTimeout(resolve, 200, { status: 200 });
  });
}
export function login(action: string, data: TODO): Promise<TODO> {
  // ds = ds || Object.assign({}, db);
  return new Promise(function(resolve, reject) {
    if (data.username === 'admin@test.com' && data.password === 'password') {
      const { accessToken: accessToken, user } = ds.token;
      setTimeout(resolve, 200, {
        data: {
          accessToken: accessToken,
          user
        }
      });
    } else {
      reject({
        code: 403,
        text: 'Your name or password is wrong'
      });
    }
  });
}
// };
