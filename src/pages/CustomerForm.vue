<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card class="grey lighten-4 elevation-0">
        <v-card-title class="title">
          {{ title }}
          <v-spacer></v-spacer>
          <v-btn fab small class="grey mr-2" @click.native="cancel()">
            <v-icon dark="">mdi-close-circle-outline</v-icon>
          </v-btn>
          &nbsp;
          <v-btn fab small class="blue" @click.native="save()">
            <v-icon>mdi-content-save-all</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="loading !== true">
          <v-container fluid grid-list-sm>
            <v-layout row wrap>
              <v-flex md3 sm12>
                <!-- <v-img   class="profile" eager=true :src="customer.avatar"/></v-img> -->
            <!-- <v-img   class="profile" eager=true :src="customer.avatar"/> -->
           {{customer.avatar}}
            <img :src="customer.avatar" />
            <img src="../assets/img/avatar1.png">
              </v-flex>
              <v-flex md9 sm12>
                <v-container fluid grid-list-sm>
                  <v-layout row wrap>
                    <v-flex md4 sm12 xs12 class="mx-1 px-0">
                      <v-text-field
                        name="firstName"
                        label="First Name"
                        hint="Last name is required"
                        value="Input text"
                        v-model="customer.firstName"
                        class="input-group--focused"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex md4 sm12 class="mx-1 px-0">
                      <v-text-field
                        name="lastName"
                        label="Last Name"
                        maxlength="10"
                        hint="Last name is required"
                        value="Input text"
                        v-model="customer.lastName"
                        class="input-group--focused"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex md4 sm12 xs12 class="mx-1 px-0">
                      <v-text-field
                        name="email"
                        type="email"
                        label="Email"
                        value="Input text"
                        v-model="customer.email"
                        v-bind:rules="rules.email"
                        class="input-group--focused"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex md4 sm12 xs12 class="mx-1 px-0">
                      <v-text-field
                        name="mobile"
                        type="text"
                        label="Mobile"
                        v-model="customer.mobile"
                        class="input-group--focused"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex md4 sm12 class="mx-1 px-0">
                      <v-text-field
                        name="workphone"
                        type="text"
                        label="Work Phone"
                        v-model="customer.workphone"
                        class="input-group--focused"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex md4 sm12 xs12 class="mx-1 px-0">
                      <v-text-field
                        name="rewards"
                        type="number"
                        label="Rewards"
                        hint="number between 0 and 9999"
                        v-bind:rules="rules.rewards"
                        v-model="customer.rewards"
                        class="input-group--focused"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex md6 sm12 class="mx-1 px-0">
                      <v-switch label="Membership" v-model="customer.membership" light></v-switch>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
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
import { appModule } from '@/store/modules/app';
import { isValidEmail, isValidRewards } from '@/utils/app-util';

@Component
export default class CustomerForm extends Vue {
  title = '';
  rules = {
    rewards: [() => isValidRewards(this.customer.rewards)],
    email: [() => isValidEmail(this.customer.email)]
  };
  // customerAvatar = customerModule.customer.avatar;

  get customerAvatar() {
    return { src: require(customerModule.customer.avatar)};
  }

  get customer() {
    console.log(customerModule.customer);
    return customerModule.customer;
  }

  get orders() {
    return customerModule.getOrders();
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

  save() {
    // const customer = { ...this.customer };
    // delete order.customer
    // console.log(customer);
    // Store.dispatch('customers/saveCustomer', customer).then(() => {
    //   Store.dispatch('customers/closeSnackBar', 2000);
    // });
    customerModule.saveCustomer(this.customer);
  }
  cancel() {
    this.$router.push({ name: 'Customers' });
  }

  closeSnackbar() {
    appModule.closeNotice();
  }
  created() {
    // Store.dispatch('customers/getCustomerById', this.$route.params.id);
    customerModule.getCustomerById(this.$route.params.id);
  }
  mounted() {
    if (this.$route.params.id) {
      this.title = 'Edit Customer';
    } else this.title = 'New Customer';
    // this.customerAvatar =customerModule.customer.avatar
  }
}
</script>
 