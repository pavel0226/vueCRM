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

import { UserState } from './modules/user';
import { OrderState } from './modules/orders';
import { CustomerState } from './modules/customers';
import { ProductState } from './modules/products';
// import CustomerModule from '@/store/modules/customers'

Vue.use(Vuex);

interface RootState {
  userState: UserState;
  orderState: OrderState;
  customerState: CustomerState;
  productState: ProductState;
}

export default new Vuex.Store<RootState>({
  plugins: [createPersistedState({ storage: window.sessionStorage })], // !debug ? [createPersistedState({ storage: window.sessionStorage })] : [],
  // modules:{
  // customerModule: CustomerModule,
// }
});
