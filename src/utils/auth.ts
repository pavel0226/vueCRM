// /* globals Store */
// // import api from './backend-api'
// import api from './demo-api';
// import store from '@/store';
// import userModule from '@/store/modules/user';
// import { getModule } from 'vuex-module-decorators';
// // import store from 'vuex'

// // const Store: TODO = store;
// // const uerModule = getModule( UserModule, store);
// export default {
//   login(email: string, pass: string, goto: TODO, cb:TODO) {
//     // cb = [...arguments]; // arguments[arguments.length - 1];
//     const data = 'username=' + email + '&password=' + pass;
//     api.login('token', data).then(
//       (res:TODO) => {
//         const token = res.accessToken || res.data.accessToken;
//         const user = res.user || res.data.user;
//         // store.dispatch('user/updateUser', { user, token });
//         userModule.updateUser({ user, token } );
//         // if (cb) cb(true, null);
//         // this.onChange(true);
//       },
//       (err:TODO) => {
//         console.log(err);
//         if (cb) cb(false, err);
//         // this.onChange(false);
//       }
//     );
//   },
//   getToken(): TODO {
//     return store.state.user.token;
//   },
//   logout(cb: TODO) {
//     // delete localStorage.token
//     // Store.commit('setToken', null)
//     store.dispatch('user/logout');
//     if (cb) cb(false);
//     // this.onChange(false);
//   },
//   loggedIn() {
//     return !!store.state.user.token;
//   }
// };
// import router from './router'
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
// import { Message } from 'element-ui'
// import { Route } from 'vue-router'
// import user from '@/store/modules/user'
// import { PermissionModule } from '@/store/modules/permission'
// import i18n from '@/lang' // Internationalization
// import settings from './settings'

// NProgress.configure({ showSpinner: false })

// const whiteList = ['/login', '/auth-redirect']

// const getPageTitle = (key: string) => {
//   const hasKey = i18n.te(`route.${key}`)
//   if (hasKey) {
//     const pageName = i18n.t(`route.${key}`)
//     return `${pageName} - ${settings.title}`
//   }
//   return `${settings.title}`
// }

// router.beforeEach(async(to: Route, _: Route, next: any) => {
//   // Start progress bar
//   NProgress.start()

//   // Determine whether the user has logged in
//   if (UserModule.token) {
//     if (to.path === '/login') {
//       // If is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       // Check whether the user has obtained his permission roles
//       if (UserModule.roles.length === 0) {
//         try {
//           // Note: roles must be a object array! such as: ['admin'] or ['developer', 'editor']
//           await UserModule.GetUserInfo()
//           const roles = UserModule.roles
//           // Generate accessible routes map based on role
//           PermissionModule.GenerateRoutes(roles)
//           // Dynamically add accessible routes
//           router.addRoutes(PermissionModule.dynamicRoutes)
//           // Hack: ensure addRoutes is complete
//           // Set the replace: true, so the navigation will not leave a history record
//           next({ ...to, replace: true })
//         } catch (err) {
//           // Remove token and redirect to login page
//           UserModule.ResetToken()
//           Message.error(err || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       } else {
//         next()
//       }
//     }
//   } else {
//     // Has no token
//     if (whiteList.indexOf(to.path) !== -1) {
//       // In the free login whitelist, go directly
//       next()
//     } else {
//       // Other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach((to: Route) => {
//   // Finish progress bar
//   NProgress.done()

//   // set page title
//   document.title = getPageTitle(to.meta.title)
// })
