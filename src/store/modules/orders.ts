import { getData, putData, postData, deleteData } from '@/utils/demo-api';
import { Customer, Order, Entity, Product, Category } from '@/types';
import { sendSuccessNotice, sendErrorNotice, closeNotice, commitPagination, getDefaultPagination } from '@/utils/store-util';

import { get } from 'lodash';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';

export interface OrderState {
  items: Entity[];
  pagination: Pagination;
  loading: boolean;
  mode: string;
  snackbar: boolean;
  notice: string;
  order: Order;
  customer: string;
  products: Product[];
  customers: Customer[];
  categories: Category[];
}

@Module({ store, dynamic: true, name: 'orders' })
class OrderModule extends VuexModule implements OrderState {
  // const state = {
  public items: Entity[] = [];
  public pagination = getDefaultPagination();
  public loading = false;
  public mode = '';
  public snackbar = false;
  public notice = '';
  public order = {} as Order;
  public customer = '';
  public products: Product[] = [];
  public customers: Customer[] = [];
  public categories: Category[] = [];

  @Action
  getCustomers() {
    getData('customers/').then((res: TODO) => {
      if (res.data) {
        const customers = res.data.map((c: Customer) => {
          c.text = c.firstName + ' ' + c.lastName;
          c.value = c.id;
          return c;
        });
        this.context.commit('setCustomers', customers);
      }
    });
  }
  @Action
  getCategories() {
    getData('categories/').then((res: TODO) => {
      if (res.data && res.data.length > 0) {
        const categories = res.data.map((c: Category) => {
          // c.text = c.firstName + " " + c.lastName;
          // c.value = c.id;
          c.text = c.categoryName;
          c.value = c.id;
          return c;
        });
        this.context.commit('setCategories', categories);
      }
    });
  }
  @Action
  getOrderById(id: number) {
    if (id) {
      getData('orders/' + id + '?_expand=customer').then(
        (res: TODO) => {
          const order = res.data;
          order.products.filter((p: Product) => p !== null && p !== undefined);
          order.customerId = order.customer.id;
          this.context.commit('setOrder', { order });
        },
        (err: TODO) => {
          console.log(err);
        }
      );
    } else {
      this.context.commit('setOrder', { order: {} as Order });
    }
  }
  @Action
  getProductsByCategory(categoryId: number) {
    if (categoryId) {
      getData('products?_expand=category&categoryId=' + categoryId).then(
        (res: TODO) => {
          const products = res.data.map((p: Product) => {
            p.text = p.productName;
            p.value = p.id;
            return p;
          });
          console.log(products);
          this.context.commit('setProducts', products);
        },
        (err: TODO) => {
          console.log(err);
        }
      );
    }
  }
  @Action
  getAllOrders() {
    this.context.commit('setLoading', { loading: true });
    getData('orders?_expand=customer').then((res: TODO) => {
      const orders = res.data;

      orders.forEach((item: TODO) => {
        item.amount = item.products.reduce((p: TODO, c: TODO) => p + ((c && c.unitPrice) || 0), 0);
        item.quantity = item.products.length;
        item.customer = item.customer ? item.customer.firstName + ' ' + item.customer.lastName : '';
      });
      commitPagination(this.context.commit, orders);
      this.context.commit('setLoading', { loading: false });
    });
  }
  @Action
  searchOrders(searchQuery: string, pagination: TODO) {
    getData('orders?_expand=customer&' + searchQuery).then((res: TODO) => {
      const orders = res.data;
      orders.forEach((item: TODO) => {
        item.amount = item.products.reduce((p: TODO, c: TODO) => p + c.unitPrice, 0);
        item.quantity = item.products.length;
        item.customer = item.customer ? item.customer.firstName + ' ' + item.customer.lastName : '';
      });
      commitPagination(this.context.commit, orders);
    });
  }
  @Action
  quickSearch({ headers, qsFilter, pagination }: TODO) {
    // TODO: Following solution should be replaced by DB full-text search for production
    getData('orders?_expand=customer').then((res: TODO) => {
      const orders = res.data.filter((r: TODO) =>
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
      orders.forEach((item: TODO) => {
        let amount = 0;
        item.products.forEach((e: TODO) => {
          amount += e.unitPrice;
        });
        item.amount = amount;
        item.quantity = item.products.length;
        item.customer = item.customer ? item.customer.firstName + ' ' + item.customer.lastName : '';
      });
      commitPagination(this.context.commit, orders);
    });
  }
  @Action
  deleteOrder({ state, commit, dispatch }: TODO, id: number) {
    deleteData('orders/', id.toString())
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
  @Action
  addProductToOrder(productId: number) {
    if (productId) {
      const products = Object.assign([], this.order.products);
      const product = this.products.find((p: Product) => p.id === productId);
      product && products.push(product);
      this.context.commit('setOrderProducts', products);
    }
  }
  @Action
  deleteProduct(product: Product) {
    if (product) {
      const { products } = this.order;
      products.splice(
        products.findIndex((p: Product) => p.id === product.id),
        1
      );
      this.context.commit('setOrderProducts', products);
    }
  }
  saveOrder(order: Order) {
    // delete order;
    if (!order.id) {
      postData('orders/', order)
        .then((res: TODO) => {
          const order = res.data;
          this.context.commit('setOrder', { order });
          sendSuccessNotice(this.context.commit, 'New order has been added.');
        })
        .catch((err: TODO) => {
          console.log(err);
          sendErrorNotice(this.context.commit, 'Operation failed! Please try again later. ');
          closeNotice(this.context.commit, 1500);
        });
    } else {
      putData('orders/' + order.id.toString(), order)
        .then((res: TODO) => {
          const order = res.data;
          this.context.commit('setOrder', { order });
          sendSuccessNotice(this.context.commit, 'Order has been updated.');
        })
        .catch((err: TODO) => {
          console.log(err);
          sendErrorNotice(this.context.commit, 'Operation failed! Please try again later. ');
          closeNotice(this.context.commit, 1500);
        });
    }
  }
  @Action
  closeSnackBar(timeout: number) {
    closeNotice(this.context.commit, timeout);
  }
  // };

  // const mutations = {
  @Mutation
  setCustomers(customers: Customer[]) {
    this.customers = customers;
  }
  @Mutation
  setCategories(categories: Category[]) {
    this.categories = categories;
  }
  @Mutation
  setProducts(products: Product[]) {
    console.log(products);
    this.products = products;
  }
  @Mutation
  setOrderProducts(products: Product[]) {
    this.order.products = products;
  }
  @Mutation
  setItems(orders: Order[]) {
    this.items = orders;
  }
  @Mutation
  setPagination(pagination: TODO) {
    this.pagination = pagination;
  }
  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading;
  }
  @Mutation
  setNotice(notice: string) {
    console.log(' notice .... ', notice);
    this.notice = notice;
  }
  @Mutation
  setSnackbar(snackbar: boolean) {
    this.snackbar = snackbar;
  }
  @Mutation
  setMode(mode: string) {
    this.mode = mode;
  }
  @Mutation
  setOrder(order: Order) {
    this.order = order;
  }
}

export const orderModule = getModule(OrderModule); // Orders;
