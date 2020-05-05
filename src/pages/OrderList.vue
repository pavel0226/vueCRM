<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <span class="title"
            >Orders {{ pagination ? '(' + pagination.totalItems + ')' : '' }}
            <v-text-field append-icon="search" label="Quick Search" single-line hide-details v-model="quickSearch"></v-text-field>
          </span>
          <v-spacer></v-spacer>
          <v-btn class="blue-grey" fab small dark @click.native.stop="rightDrawer = !rightDrawer">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn class="brown lighten-1" fab small dark @click.native="reloadData()">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-btn class="teal darken-2" fab small dark @click.native="print()">
             <v-icon>mdi-printer</v-icon>
          </v-btn>
          <v-btn class="deep-orange darken-3" fab small dark @click.native="add">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-card-title>
        <Table v-if="loading === false" :headers="headers" :items="items" :pagination="pagination" @edit="edit" @remove="remove"></Table>
      </v-card>
    </v-flex>
    <search-panel :rightDrawer="showSearchPanel" @cancelSearch="cancelSearch" @searchData="searchOrders">
      <v-layout row>
        <v-flex xs11 offset-xs1>
          <v-text-field name="reference" label="Reference" light v-model="searchVm.contains.reference"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs11 offset-xs1>
          <v-text-field name="customer" label="Customer" light v-model="searchVm.contains.customer"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs11 offset-xs1>
          <label class="heading text-sm-central" light>Amount Range</label>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs8 offset-xs1>
          <v-slider class="text-xs-central" label="Price 1" light v-bind:max="100" v-model="searchVm.between.amount.former"></v-slider>
        </v-flex>
        <v-flex xs3>
          <v-text-field type="number" light v-model="searchVm.between.amount.former"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs8 offset-xs1>
          <v-slider class="text-xs-central" label="Price 2" light v-bind:max="9999" v-model="searchVm.between.amount.latter"></v-slider>
        </v-flex>
        <v-flex xs3>
          <v-text-field type="number" light v-model="searchVm.between.amount.latter"></v-text-field>
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
import { Component, Prop, Emit } from 'vue-property-decorator';
import store from '@/store';
import Vue from 'vue';
import { Customer, Entity } from '../types';
import { getDefaultPagination } from '@/utils/store-util';
import { getData } from '@/utils/demo-api';
import { userModule } from '../store/modules/user';
import { customerModule } from '@/store/modules/customers';
import { orderModule } from '@/store/modules/orders';
import { productModule } from '@/store/modules/products';
import { appModule } from '@/store/modules/app';

@Component({
  components: {
    Table,
    SearchPanel,
    ConfirmDialog
  }
})
export default class OrderList extends Vue {
  public dialog = false;
  public dialogTitle = 'Customer Delete Dialog';
  public dialogText = 'Do you want to delete this customer?';
  public showSearchPanel = false;
  public right = true;
  public search = '';
  public headers = [
    {
      text: 'Reference',
      left: true,
      value: 'reference'
    },
    { text: 'Order Items', value: 'quantity' },
    { text: 'Amount', value: 'amount' },
    { text: 'Customer', value: 'customer' },
    { text: 'Order Date', value: 'orderDate' },
    { text: 'Shipping Date', value: 'shippedDate' }
  ];
  private searchVm = {
    contains: {
      reference: '',
      customer: ''
    },
    between: {
      amount: { former: 0, latter: 0 }
    }
  };
  private orderId = '';
  private query = '';
  private snackbarStatus = false;
  private timeout = 2000;
  private color = '';
  private quickSearchFilter = '';
  private itemId = -1;
  // };
  // },
  // methods: {
  print() {
    window.print();
  }
  edit(item) {
    // this.$router.push({ name: 'Order', params: { id: item.id } });
    this.$router.push(`order/${item.id}`);
  }
  add() {
    this.$router.push('NewOrder');
  }
  remove(item) {
    this.orderId = item.id;
    this.dialog = true;
  }
  onConfirm() {
    // Store.dispatch('orders/deleteOrder', this.orderId).then(() => {
    //   Store.dispatch('orders/searchOrders', this.query, this.pagination);
    //   Store.dispatch('orders/closeSnackBar', 2000);
    // });
    // this.dialog = false;
    orderModule.deleteOrder(this.itemId);
    this.dialog = false;
  }
  onCancel() {
    this.orderId = '';
    this.dialog = false;
  }
  searchOrders() {
    this.showSearchPanel = !this.showSearchPanel;
    buildSearchFilters(this.searchVm);
    this.query = buildJsonServerQuery(this.searchVm);
    this.quickSearch = '';
    orderModule.searchOrders(this.query, this.pagination);
    // this.rightDrawer = !this.rightDrawer;
    // this.appUtil.buildSearchFilters(this.searchVm);
    // this.query = this.appUtil.buildJsonServerQuery(this.searchVm);
    // this.quickSearch = '';
    // Store.dispatch('orders/searchOrders', this.query, this.pagination);
  }
  reloadData() {
    this.query = '';
    orderModule.getAllOrders();
  }

  cancelSearch() {
    this.showSearchPanel = false;
  }

  closeSnackbar() {
    appModule.closeNotice();
  }

  quickSearchCustomers = debounce(function() {
    orderModule.quickSearch(this.headers, this.quickSearchFilter, this.pagination);
  }, 500);

  // computed: {
  //   ...mapState('orders', {
  //     items: 'items',
  //     pagination: 'pagination',
  //     loading: 'loading',
  //     mode: 'mode',
  //     snackbar: 'snackbar',
  //     notice: 'notice'
  //   }),

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

  get quickSearch() {
    return this.quickSearchFilter;
  }
  set quickSearch(val) {
    this.quickSearchFilter = val;
    this.quickSearchFilter && this.quickSearchCustomers();
  }

  //  quickSearch: {
  //     get: function() {
  //       return this.quickSearchFilter;
  //     }
  //     set: function(val) {
  //       this.quickSearchFilter = val;
  //       this.quickSearchFilter && this.quickSearchOrders();
  //     }
  //   }
  // }
  created() {
    orderModule.getAllOrders();
  }
  mounted() {
    // this.$nextTick(() => {
    //   console.log(this.headers);
    // });
  }
}
</script>
