/* globals Store */

import { getData, putData, postData, deleteData } from '@/utils/demo-api';
import { Customer, Order, Entity, Product, Category } from '@/types';
import { sendSuccessNotice, sendErrorNotice, closeNotice, getDefaultPagination, commitPagination } from '@/utils/store-util';

import { get } from 'lodash';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';

export interface ProductState {
  items: Entity[];
  pagination: Pagination;
  loading: boolean;
  mode: string;
  snackbar: boolean;
  notice: string;
  product: Product;
  categories: Category[];
}

@Module({ store, dynamic: true, name: 'products' })
class ProductModule extends VuexModule implements ProductState {
  // const state = {
  public items: Entity[] = [];
  public pagination = getDefaultPagination();
  public loading = false;
  public mode = '';
  public snackbar = false;
  public notice = '';
  public product = {} as Product;
  public categories: Category[] = [];

  @Action
  getCategories() {
    getData('categories/').then((res: TODO) => {
      // const categories = [];
      res.data.forEach((c: TODO) => {
        const category = { ...c };
        category.text = c.categoryName;
        category.value = c.id;
        this.categories.push(category);
      });
      this.context.commit('setCategories', this.categories);
    });
  }
  @Action getProductById(id: number) {
    if (id) {
      this.context.commit('setLoading', { loading: true });
      getData('products/' + id + '?_expand=category').then(
        (res: TODO) => {
          const product = res.data;
          this.context.commit('setProduct', { product });
        },
        (err: TODO) => {
          console.log(err);
        }
      );
      this.context.commit('setLoading', { loading: false });
    } else {
      this.context.commit('setProduct', { product: {} as Product });
    }
  }
  @Action getAllProducts() {
    this.context.commit('setLoading', { loading: true });
    getData('products?_expand=category').then((res: TODO) => {
      const products = res.data;
      products.forEach((p: Product) => {
        p.categoryName = p.category.categoryName;
      });
      commitPagination(this.context.commit, products);
      this.context.commit('setLoading', { loading: false });
    });
  }
  @Action searchProducts(searchQuery: string) {
    getData('products?_expand=category&' + searchQuery).then((res: TODO) => {
      const products = res.data;
      products.forEach((p: Product) => {
        p.categoryName = p.category.categoryName;
      });
      commitPagination(this.context.commit, products);
    });
  }
  @Action quickSearch({ headers, qsFilter, pagination }: TODO) {
    // TODO: Following solution should be replaced by DB full-text search for production
    getData('products?_expand=category').then((res: TODO) => {
      const products = res.data.filter((r: TODO) =>
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
      products.forEach((p: Product) => {
        p.categoryName = p.category.categoryName;
      });
      commitPagination(this.context.commit, products);
    });
  }
  @Action deleteProduct(id: number) {
    deleteData('products/', id.toString())
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
  @Action saveProduct(product: Product) {
    delete product.category;
    if (!product.id) {
      postData('products/', product)
        .then((res: TODO) => {
          const product = res.data;
          this.context.commit('setProduct', { product });
          sendSuccessNotice(this.context.commit, 'New product has been added.');
          closeNotice(this.context.commit, 1500);
        })
        .catch((err: TODO) => {
          console.log(err);
          sendErrorNotice(this.context.commit, 'Operation failed! Please try again later. ');
          closeNotice(this.context.commit, 1500);
        });
    } else {
      putData('products/' + product.id.toString(), product)
        .then((res: TODO) => {
          const product = res.data;
          this.context.commit('setProduct', { product });
          sendSuccessNotice(this.context.commit, 'Product has been updated.');
          closeNotice(this.context.commit, 1500);
        })
        .catch((err: TODO) => {
          console.log(err);
          sendErrorNotice(this.context.commit, 'Operation failed! Please try again later. ');
          closeNotice(this.context.commit, 1500);
        });
    }
  }
  @Action closeSnackBar(timeout: number) {
    closeNotice(this.context.commit, timeout);
  }
  // };

  // const mutations = {
  @Mutation setCategories(categories: Category[]) {
    this.categories = categories;
  }
  @Mutation setItems(products: Product[]) {
    this.items = products;
  }
  @Mutation setPagination(pagination: Pagination) {
    this.pagination = pagination;
  }
  @Mutation setLoading(loading: boolean) {
    this.loading = loading;
  }
  @Mutation setNotice(notice: string) {
    console.log(' notice .... ', notice);
    this.notice = notice;
  }
  @Mutation setSnackbar(snackbar: boolean) {
    this.snackbar = snackbar;
  }
  @Mutation setMode(mode: string) {
    this.mode = mode;
  }
  @Mutation setProduct(product: Product) {
    this.product = product;
  }
  // };
}

export  const productModule = getModule(ProductModule); // default Products;
//  {
//   namespaced: false,
//
//   actions,
//   mutations,
//   getters
// };
