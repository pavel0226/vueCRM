/* eslint-disable */
/* tslint-disable */
// @ts-ignore
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';
import {preset } from 'vue-cli-plugin-vuetify-preset-fortnightly/preset';

Vue.use(Vuetify);


export default new Vuetify({
    preset,
    theme: {
        dark: false,
        default: 'light'
    }
});
