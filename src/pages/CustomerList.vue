<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <span class="title"
            >Customers {{ pagination ? '(' + pagination.totalItems + ')' : '' }}
            <v-text-field append-icon="mdi-magnify" label="Quick Search" single-line hide-details v-model="quickSearch"></v-text-field>
          </span>
          <v-spacer></v-spacer>
          <v-btn class="blue-grey mr-2" fab small dark @click.native.stop="rightDrawer = !rightDrawer">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn class="brown lighten-1  mr-2" fab small dark @click.native="reloadData()">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-btn class="teal darken-2  mr-2" fab small dark @click.native="print()">
            <v-icon>mdi-printer</v-icon>
          </v-btn>
          <v-btn class="deep-orange darken-3" fab small dark @click.native="add">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-card-title>
        <Table v-if="loading === false" :headers="headers" :items="items" :pagination="pagination" @edit="edit" @remove="remove"></Table>
      </v-card>
    </v-flex>
    <search-panel :rightDrawer="rightDrawer" @cancelSearch="cancelSearch" @searchData="searchCustomers">
      <v-layout row>
        <v-flex xs11 offset-xs1>
          <v-text-field name="input-1-3" label="Frist Name" light v-model="searchVm.contains.firstName"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs11 offset-xs1>
          <v-text-field name="input-1-3" label="Last Name" light v-model="searchVm.contains.lastName"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs11 offset-xs1>
          <v-subheader class="text-sm-central" light>Reward range between Reward 1 and Reward 2 </v-subheader>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs8 offset-xs1>
          <v-slider label="Reward 1" light v-bind:max="50" v-model="searchVm.between.rewards.former"></v-slider>
        </v-flex>
        <v-flex xs3>
          <v-text-field type="number" light v-model="searchVm.between.rewards.former"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs8 offset-xs1>
          <v-slider label="Reward 2" light v-bind:max="100" v-model="searchVm.between.rewards.latter"></v-slider>
        </v-flex>
        <v-flex xs3>
          <v-text-field type="number" light v-model="searchVm.between.rewards.latter"></v-text-field>
        </v-flex>
      </v-layout>
    </search-panel>

    <confirm-dialog
      :dialog="dialog"
      :dialogTitle="dialogTitle"
      :dialogText="dialogText"
      @onConfirm="onConfirm"
      @onCancel="onCancel"
    ></confirm-dialog>
    <v-snackbar v-if="loading === false" :right="true" :timeout="timeout" :color="mode" v-model="snackbar">
      {{ notice }}
      <v-btn dark text @click.native="closeSnackbar">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>
<script lang="ts">
import Table from '@/components/Table.vue';
import SearchPanel from '@/components/SearchPanel.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { debounce } from 'lodash';
import { buildSearchFilters, buildJsonServerQuery, clearSearchFilters } from '@/utils/app-util';
import { Component } from 'vue-property-decorator';
import Vue from 'vue';
import {  Entity } from '../types';
import { customerModule } from '@/store/modules/customers';
import { appModule } from '@/store/modules/app';

@Component({
  components: {
    Table,
    SearchPanel,
    ConfirmDialog
  }
})
export default class CustomerList extends Vue {
  public dialog = false;
  public dialogTitle = 'Customer Delete Dialog';
  public dialogText = 'Do you want to delete this customer?';
  private showSearchPanel = false;
  public right = true;
  public search = '';
  public headers = [
    {
      text: 'First Name',
      left: true,
      value: 'firstName'
    },
    { text: 'Last Name', value: 'lastName' },
    { text: 'Email', value: 'email' },
    { text: 'Mobile', value: 'mobile' },
    { text: 'Reward', value: 'rewards' },
    { text: 'Previous Order(s)', value: 'orderAmount' },
    { text: 'Membership', value: 'membership' },
    { text: '', value: 'actions', sortable: false }
  ];
  private searchVm = {
    contains: {
      firstName: '',
      lastName: ''
    },
    between: {
      rewards: { former: 0, latter: 0 }
    }
  };
  private customerId = '';
  private query = '';
  private snackbarStatus = false;
  private timeout = 2000;
  private color = '';
  private quickSearchFilter = '';
  private itemId = -1;

  print() {
    window.print();
  }

  edit(item: Entity) {
    this.$router.push(`customer/${item.id}`);
  }

  remove(item: Entity) {
    debugger;
    this.itemId = item.id;
    this.dialog = true;
  }

  add() {
    this.$router.push('NewCustomer');
  }

  onConfirm() {
    customerModule.deleteCustomer(this.itemId);
    this.dialog = false;
  }
  onCancel() {
    this.customerId = '';
    this.dialog = false;
  }

  searchCustomers() {
    buildSearchFilters(this.searchVm);
    this.query = buildJsonServerQuery(this.searchVm);
    this.quickSearch = '';
    customerModule.searchCustomers(this.query);
    this.showSearchPanel = false;
  }

  clearSearchFilters() {
    this.showSearchPanel = !this.showSearchPanel;
    clearSearchFilters(this.searchVm);
    customerModule.getAllCustomers();
  }

  reloadData() {
    this.query = '';
    customerModule.getAllCustomers();
  }

  cancelSearch() {
    this.showSearchPanel = false;
  }

  closeSnackbar() {
    appModule.closeNotice();
  }

  quickSearchCustomers = debounce(function() {
    customerModule.quickSearch(this.headers, this.quickSearchFilter);
  }, 500);

  get items() {
    return customerModule.items;
  }
  get pagination() {
    return customerModule.pagination;
  }
  get loading() {
    return appModule.loading;
  }
  get mode() {
    return appModule.mode;
  }

  get snackbar() {
    return appModule.snackbar;
  }

  get notice() {
    return appModule.notice;
  }

  get rightDrawer() {
    return this.showSearchPanel;
  }

  set rightDrawer(_showSearchPanel: boolean) {
    this.showSearchPanel = _showSearchPanel;
  }

  get quickSearch() {
    return this.quickSearchFilter;
  }
  set quickSearch(val) {
    this.quickSearchFilter = val;
    this.quickSearchFilter && this.quickSearchCustomers();
  }

  created() {
    customerModule.getAllCustomers();
  }

  mounted() {
    //  this.getCustomers()
  }
}
</script>
