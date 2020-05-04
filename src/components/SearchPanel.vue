<template>
  <v-navigation-drawer right v-model="rightDrawer" :disable-resize-watcher="true" fixed>
    <v-list>
      <!-- <v-list-item-title>&nbsp;</v-list-item-title> -->
      <v-list-item class="my-2">
        <v-list-item-title class="title">Advanced Search</v-list-item-title>
      </v-list-item>
      <!-- <v-list-item-title>&nbsp;</v-list-item-title> -->
      <slot></slot>

      <v-layout class="pl-1 pt-3 ml-1" row>
        <v-btn class="purple" fab small @click.native="$emit('searchData')">
          <v-icon dark="">search</v-icon>
        </v-btn>
        <!-- <v-btn class="grey" fab small @click.native="rightDrawer = !rightDrawer"> searchData-->
        <v-btn class="grey" fab small @click.native="$emit('cancelSearch')">
          <v-icon dark="">clear</v-icon>
        </v-btn>
      </v-layout>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import Vue from 'vue';
import { State, Getter, Action, Mutation, namespace } from 'vuex-class';
// import { Watch } from 'vue-property-decorator';
// import {userModule} from '@/store/modules/user';
// import { User } from './types';

// export default  {
@Component(
  {name: 'search-panel'}
)
export default class SearchPanel extends Vue {
  // props: {
  @Prop() rightDrawer = ''

  public  right = true;
  public    searchVm: TODO = {
        contains: {
          productName: '',
          category: ''
        },
        between: {
          price: {
            former: 0,
            latter: 0
          }
        }
      };
  // methods: {
    cancelSearch() {}
    searchData() {}
  // },

  created() {}
  mounted() {
    this.$nextTick(() => {});
  }
}
</script>
