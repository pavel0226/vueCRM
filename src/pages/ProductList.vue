<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <span class="title"
            >Products {{ pagination ? '(' + pagination.totalItems + ')' : '' }}
            <v-text-field append-icon="mdi-magnify" label="Quick Search" single-line hide-details v-model="quickSearch"></v-text-field>
          </span>
          <v-spacer></v-spacer>
          <v-btn class="blue-grey  mr-2" fab small dark @click.native.stop="rightDrawer = !rightDrawer">
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
    <search-panel :rightDrawer="rightDrawer" @cancelSearch="cancelSearch" @searchData="searchProducts">
      <v-layout row>
        <v-flex xs11 offset-xs1>
          <v-text-field name="productName" label="Product" light v-model="searchVm.contains.productName"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs11 offset-xs1>
          <label class="heading text-sm-central" light>Price Range</label>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs8 offset-xs1>
          <v-slider class="text-xs-central" label="Price 1" light v-bind:max="100" v-model="searchVm.between.unitPrice.former"></v-slider>
        </v-flex>
        <v-flex xs3>
          <v-text-field type="number" light v-model="searchVm.between.unitPrice.former"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs8 offset-xs1>
          <v-slider class="text-xs-central" label="Price 2" light v-bind:max="999" v-model="searchVm.between.unitPrice.latter"></v-slider>
        </v-flex>
        <v-flex xs3>
          <v-text-field type="number" light v-model="searchVm.between.unitPrice.latter"></v-text-field>
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
import { productModule } from '@/store/modules/products';
import { appModule } from '@/store/modules/app';

@Component({
  components: {
    Table,
    SearchPanel,
    ConfirmDialog
  }
})
export default class ProductList extends Vue {
  dialog = false;
  dialogTitle = 'Customer Delete Dialog';
  dialogText = 'Do you want to delete this customer?';
  _rightDrawer = false;
  right = true;
  search = '';
  headers = [
    { text: 'Product', left: true, value: 'productName' },
    { text: 'Category', value: 'category.categoryName' },
    { text: 'Price', value: 'unitPrice' },
    { text: 'In Stock', value: 'unitInStock' },
    { text: '', value: 'actions', sortable: false }
  ];
  searchVm= {
    contains: {
      productName: '',
      category: '',
    },
    between: {
      unitPrice: {
        former: 0,
        latter: 0
      }
    }
  };
  private productId = '';
  private query = '';
  private snackbarStatus = false;
  private timeout = 2000;
  private color = '';
  private quickSearchFilter = '';
  private itemId = -1;
  print() {
    window.print();
  }
  edit(item) {
    this.$router.push({
      name: 'Product',
      params: { id: item.id }
    });
  }
  add() {
    this.$router.push('NewProduct');
  }
  remove(item) {
    this.productId = item.id;
    this.dialog = true;
  }

  onConfirm() {
    productModule.deleteProduct(this.itemId);
    this.dialog = false;
  }
  onCancel() {
    this.productId = '';
    this.dialog = false;
  }
  searchProducts() {
    this.rightDrawer = !this._rightDrawer;
    buildSearchFilters(this.searchVm);
    this.query = buildJsonServerQuery(this.searchVm);
    this.quickSearch = '';
    productModule.searchProducts(this.query, this.pagination);
  }

  clearSearchFilters() {
    this.rightDrawer = !this._rightDrawer;
    clearSearchFilters(this.searchVm);
    productModule.getAllProducts();
  }

  reloadData() {
    this.query = '';
    productModule.getAllProducts();
  }

  cancelSearch() {
    this.rightDrawer = false;
  }

  closeSnackbar() {
    appModule.closeNotice();
  }

  quickSearchCustomers = debounce(function() {
    productModule.quickSearch(this.headers, this.quickSearchFilter, this.pagination);
  }, 500);

  get items() {
    return productModule.items;
  }
  get pagination() {
    return productModule.pagination;
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
    return this._rightDrawer;
  }

  set rightDrawer(rightDrawer: boolean) {
    this._rightDrawer = rightDrawer;
  }

  get quickSearch() {
    return this.quickSearchFilter;
  }
  set quickSearch(val) {
    this.quickSearchFilter = val;
    this.quickSearchFilter && this.quickSearchCustomers();
  }

  created() {
    productModule.getAllProducts();
  }
  mounted() {
    this.$nextTick(() => {
      console.log(this.headers);
    });
  }
}
</script>
