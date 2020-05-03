import { getData, putData, postData, deleteData } from '@/utils/demo-api';
import { Customer, Order, Entity } from '@/types';
import { sendSuccessNotice, sendErrorNotice, closeNotice, commitPagination, getDefaultPagination } from '@/utils/store-util';

import { get } from 'lodash';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';

export interface CustomerState {
  items: Entity[];
  pagination: Pagination;
  loading: boolean;
  mode: string;
  snackbar: boolean;
  notice: string;
  customer: Customer; //= new Customer() ;
  customers: Customer[] ;
  orders: Order[];
  orderList: Order[];
}

@Module({ store, dynamic: true, name: 'customers' })
class CustomerModule extends VuexModule implements CustomerState {

  public items: Entity[] = [];
  public pagination = getDefaultPagination();
  public loading = true;
  public mode = '';
  public snackbar = false;
  public notice = '';
  public customer = {} as Customer; //= new Customer() ;
  public customers : Customer[] = [];
  public orders: Order[] = [];
  public orderList: Order[] = [];

  get getCustomers(){
    return this.customers;
  }

  @Action getOrders(): void {
    getData('orders/').then((res: TODO) => {
      if (res.data && res.data.length > 0) {
        const orderList = res.data.map((c: TODO) => {
          c.text = c.firstName + ' ' + c.lastName;
          c.value = c.id;
          return c;
        });
        this.context.commit('setOrderList', orderList);
      }
    });
  }
  @Action getCustomerById(id: string): void {
    this.context.commit('setLoading', { loading: true });
    if (id) {
      getData('customers/' + id).then(
        (res: TODO) => {
          const customer = res.data;
          this.context.commit('setCustomer', { customer });
          this.context.commit('setLoading', { loading: false });
        },
        (err: TODO) => {
          console.log(err);
        }
      );
    } else {
      this.context.commit('setCustomer', { customer: {} as Customer });
      this.context.commit('setLoading', { loading: false });
    }
  }
  @Action getAllCustomers(): void {
    this.context.commit('setLoading', { loading: true });
    getData('customers?_embed=orders').then((res: TODO) => {
      const customers = res.data;
      customers.forEach((item: Customer) => {
        item.orderAmount = item.orders.length; //? item.orders.length : 0;
      });
      commitPagination(this.context.commit, customers);
      this.context.commit('setLoading', { loading: false });
    });
  }
  searchCustomers(searchQuery: string, pagination: TODO): void {
    getData('customers?_embed=orders&' + searchQuery).then((res: TODO) => {
      const customers = res.data;
      customers.forEach((p: TODO) => {
        p.orderAmount = p.orders.length;
      });
      commitPagination(this.context.commit, customers);
    });
  }
  @Action quickSearch({ headers, qsFilter, pagination }: TODO): void {
    // TODO: Following solution should be replaced by DB full-text search for production
    getData('customers?_embed=orders').then((res: TODO) => {
      const customers = res.data.filter((r: TODO) =>
        headers.some((header: TODO) => {
          const val = get(r, [header.value]);
          return (
            (val &&
              val
                .toString()
                .toLowerCase()
                .includes(qsFilter)) ||
            false
          );
        })
      );
      customers.forEach((item: TODO) => {
        item.orderAmount = item.orders.length;
      });
      commitPagination(this.context.commit, customers);
    });
  }
  @Action deleteCustomer(id: string): void {
    deleteData('customers/', id.toString())
      .then((res: TODO) => {
        return new Promise((resolve, reject) => {
          sendSuccessNotice(this.context.commit, 'Operation is done.');
          resolve();
        });
      })
      .catch((err: TODO) => {
        console.log(err);
        sendErrorNotice(this.context.commit, 'Operation failed! Please try again later. ');
        closeNotice(this.context.commit, 1500);
      });
  }
  @Action saveCustomer(customer: Customer): void {
    if (!customer.id) {
      postData('customers/', customer)
        .then((res: TODO) => {
          const customer = res.data;
          this.context.commit('setCustomer', { customer });
          sendSuccessNotice(this.context.commit, 'New customer has been added.');
        })
        .catch((err: TODO) => {
          console.log(err);
          sendErrorNotice(this.context.commit, 'Operation failed! Please try again later. ');
          closeNotice(this.context.commit, 1500);
        });
    } else {
      putData('customers/' + customer.id.toString(), customer)
        .then((res: TODO) => {
          const customer = res.data;
          this.context.commit('setCustomer', { customer });
          sendSuccessNotice(this.context.commit, 'Customer has been updated.');
        })
        .catch((err: TODO) => {
          console.log(err);
          sendErrorNotice(this.context.commit, 'Operation failed! Please try again later. ');
          closeNotice(this.context.commit, 1500);
        });
    }
  }
  @Action closeSnackBar(timeout: number): void {
    closeNotice(this.context.commit, timeout);
  }

  @Mutation setOrderList(orders: Order[]): void {
    this.orders = orders;
  }
  @Mutation setItems(customers: Customer[]): void {
    this.items = customers;
  }
  @Mutation setPagination(pagination: TODO): void {
    this.pagination = pagination;
  }
  @Mutation setLoading(loading: boolean): void {
    this.loading = loading;
  }
  @Mutation setNotice(notice: string): void {
    console.log(' notice .... ', notice);
    this.notice = notice;
  }
  @Mutation setSnackbar(snackbar: boolean): void {
    this.snackbar = snackbar;
  }
  @Mutation setMode(mode: string): void {
    this.mode = mode;
  }
  @Mutation setCustomer(customer: Customer): void {
    this.customer = customer;
  }
}

export const customerModule = getModule(CustomerModule); // Customers;

