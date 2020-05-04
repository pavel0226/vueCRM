<template>
  <v-app  id="vcrm">
    <!-- <vue-progress-bar> </vue-progress-bar> -->
    <template v-if="!signedIn">
      <router-view></router-view>
    </template>
    <template v-if="signedIn" >
      <v-navigation-drawer class="blue lighten-5" width="250" light :mini-variant.sync="mini" v-model="drawer" app>
        <!-- mini-variant.sync="true" -->
        <v-list class="pa-0">
          <v-list-item  tag="div">
            <v-list-item-action>
              <img src="/assets/img/avatar0.png" />
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ user.firstName }}{{ user.lastName }}</v-list-item-title>
            </v-list-item-content>
            <v-spacer></v-spacer>
            <v-list-item-action style="min-width:30px;">
              <v-menu bottom right offset-y origin="bottom right" transition="v-slide-y-transition">
                <template v-slot:activator="{ on }">
                <v-btn icon light slot="activator" v-on="on"> 
                  <v-icon>more_vert</v-icon>
                </v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="item in userMenus" :key="item.title" value="true" :to="item.link" router>
                     <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
            <v-list-item-action style="min-width:30px;">
              <v-btn icon @click.native.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-list>
          <v-list-item v-for="item in items" :key="item.title" @click="clickMenu(item)" router>
            <v-list-item-action class="pr-1 pl-2 mr-1">
              <v-icon
                :class="activeMenuItem.includes(item.title) ? 'blue--text' : ''"
                :title="item.title"
                light
                v-html="item.icon"
              ></v-icon>
            </v-list-item-action>
            <v-list-item-content :class="activeMenuItem.includes(item.title) ? 'blue--text' : ''">
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar app>
        <v-app-bar-nav-icon @click.native.stop="drawer = !drawer" light></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <div class="text-xs-center pr-3">
          <v-badge left="">
            <span slot="badge">6</span>
            <v-icon large color="grey lighten-1">shopping_cart</v-icon>
          </v-badge>

          <v-badge color="red">
            <span slot="badge">!</span>
            <v-icon large color="grey">mail</v-icon>
          </v-badge>
        </div>
       
        <v-btn light text href="https://github.com/harryho/vue2crm" target="_blank">
          <svg height="30" class="octicon octicon-mark-github" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            ></path>
          </svg>
          <span style="margin-left:0.4rem;">GitHub</span>
        </v-btn>
      </v-app-bar>
      <v-content>
        <v-container fluid>
          <!-- <v-layout>
            <v-flex row=""> -->
          <router-view></router-view>
          <!-- </v-flex>
          </v-layout> -->
        </v-container>
      </v-content>
      <!-- <canvas id="canvas"></canvas> -->
      <v-footer :inset="true" style="justify-content:center; text-align: center" app>
        <span>&copy; Vue-CRM 2020</span>
      </v-footer>
    </template>
  </v-app>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';

// import auth from './utils/auth';
// import { mapState } from 'vuex';
import Vue from 'vue';
import { State, Getter, Action, Mutation, namespace } from 'vuex-class';
// import { Watch } from 'vue-property-decorator';
import {userModule} from '@/store/modules/user';
import { User } from './types';

@Component
export default class App extends Vue {
   get signedIn(){
    return userModule.isSignedIn; 
   }

  get user(){
    return userModule.user;
  }

  private dialog = false;
  private mini = false;
  private dialogText = '';
  private dialogTitle = '';
  // private loggedIn = userModule.isSignedIn; //auth.loggedIn();
  private isRootComponent = true;
  // clipped: false;
  public drawer = window.innerWidth > 960;
  private fixed = false;
  private items: TODO = [
    {
      icon: 'dashboard',
      title: 'Dashboard',
      vertical: 'Dashboard',
      link: 'dashboard'
    },
    {
      icon: 'shopping_cart',
      title: 'Orders',
      vertical: 'Order',
      link: 'orders'
    },
    {
      icon: 'perm_identity',
      title: 'Customers',
      vertical: 'Customer',
      link: 'customers'
    },
    {
      icon: 'bubble_chart',
      title: 'Products',
      vertical: 'Product',
      link: 'products'
    },
    {
      icon: 'thumbs_up_down',
      title: 'About',
      vertical: 'About',
      link: 'about'
    }
  ];
  private userMenus: TODO = [
    {
      icon: 'bubble_chart',
      title: 'Logout',
      link: '/logout'
    },
    {
      icon: 'bubble_chart',
      title: 'Change Password',
      link: '/changepassword'
    }
  ];
  private miniVariant = false;
  private right = true;
  private rightDrawer = false;
  private menuItem = 'Orders';

  // @Watch('LoggedIn')
  // get loggedIn(){
  //   return userModule.isSignedIn;
  // }

  created() {
    // // auth.onChange = loggedIn: TODO => {
    // //   console.log('loggedIn', loggedIn);
    // //   this.loggedIn = loggedIn;
    // // };
    // //  [App.vue specific] When App.vue is first loaded start the progress bar
    // this.$Progress.start();
    // //  hook the progress bar to start before we move router-view
    // this.$router.beforeEach((to, from, next) => {
    //   //  does the page we want to go to have a meta.progress object
    //   if (to.meta.progress !== undefined) {
    //     let meta = to.meta.progress;
    //     // parse meta tags
    //     this.$Progress.parseMeta(meta);
    //   }
    //   //  start the progress bar
    //   this.$Progress.start();
    //   //  continue to next page
    //   next();
    // });
    // //  hook the progress bar to finish after we've finished moving router-view
    // this.$router.afterEach((to, from) => {
    //   if (to.name !== 'ErrorPage') {
    //     this.menuItem = to.name;
    //   }
    //   //  finish the progress bar
    //   this.$Progress.finish();
    // });
  }

  // computed: {
  //   ...mapState('user', {
  //     user: 'user'
  //   }),


  

  // @State('user') user
  get auth() {
    // return auth;
    return userModule;
  }
  get activeMenuItem() {
    return this.menuItem;
  }
  // }
  // methods: {
  clickMenu(item: TODO) {
    this.menuItem = item.title;
    this.$router.push({
      name: item.title
    });
  }
  // }

  mounted() {
    // this.$Progress.finish();
  }
}
</script>


