/* eslint-disable */
/* tslint-disable */
// @ts-ignore
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';
// import { VuetifyThemeItem } from 'vuetify/types/services/theme';
import {preset } from 'vue-cli-plugin-vuetify-preset-fortnightly/preset';

Vue.use(Vuetify);


export default new Vuetify({
    preset,
    rtl: true,
    theme: {
        dark: false,
        default: 'light'
    },
    // ...options
//   theme: {
//     themes: {
//       light: {
//         primary: { ...colors.purple },
//         secondary: colors.grey.darken1,
//         accent: colors.shades.black,
//         error: colors.red.accent3
//       }
//   }
});
