// import Vue from 'vue';
// import Vuex from 'vuex';

// Vue.use(Vuex);

// export default new Vuex.Store({
//   state: {},
//   mutations: {},
//   actions: {},
//   modules: {}
// });

import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
// import api from "@/utils/backend-api"
// import user from './modules/user';
// import products from '../utils/products';
// import orders from './modules/orders';
// import customers from './modules/customers';
// import { User } from '@/types';
import { UserState } from './modules/user';
import { OrderState } from './modules/orders';
import { CustomerState } from './modules/customers';
import { ProductState } from './modules/products';


Vue.use(Vuex);

interface GlobalState {
  users: UserState;
  orders: OrderState;
  customers: CustomerState;
  products: ProductState;
}

export default new Vuex.Store<GlobalState>({
  plugins: [createPersistedState({ storage: window.sessionStorage })], // !debug ? [createPersistedState({ storage: window.sessionStorage })] : [],
});
