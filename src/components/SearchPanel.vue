<template>
  <v-navigation-drawer right v-model="rightDrawerVal" :disable-resize-watcher="true" fixed>
    <v-list>
      <!-- <v-list-item-title>&nbsp;</v-list-item-title> -->
      <v-list-item class="my-2">
        <v-list-item-title class="title">Advanced Search</v-list-item-title>
      </v-list-item>
      <!-- <v-list-item-title>&nbsp;</v-list-item-title> -->
      <slot></slot>
      <v-layout class="pl-1 pt-3 ml-1" row>
        <v-btn class="purple" fab small @click.native="$emit('searchData')">
          <v-icon dark="">mdi-magnify</v-icon>
        </v-btn>
        <v-btn class="grey" fab small @click.native="$emit('cancelSearch')">
          <v-icon dark="">mdi-close-circle-outline</v-icon>
        </v-btn>
      </v-layout>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import Vue from 'vue';

@Component
export default class SearchPanel extends Vue {
  @Prop({ required: true }) rightDrawer: boolean;
  @Prop()  searchFilter: TODO;

  get rightDrawerVal() {
    return this.rightDrawer;
  }
  set rightDrawerVal(r: boolean) {
    this.rightDrawer = r;
  }

  public right = true;
  // public searchFilter: TODO = {
  //   contains: {
  //     productName: '',
  //     category: ''
  //   },
  //   between: {
  //     price: {
  //       former: 0,
  //       latter: 0
  //     }
  //   }
  // };

  created() {
    // this.rightDrawer = true


  }
  mounted() {
    this.$nextTick(() => {});
  }
}
</script>
