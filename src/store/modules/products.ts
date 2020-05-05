import { getData, putData, postData, deleteData } from '@/utils/demo-api';
import {  Entity, Product, Category } from '@/types';
import { getDefaultPagination, getPagination } from '@/utils/store-util';
import { appModule } from './app';
import { get } from 'lodash';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';

export interface ProductState {
  items: Entity[];
  pagination: Pagination;
  loading: boolean;
  product: Product;
  categories: Category[];
}

@Module({ store, dynamic: true, name: 'products' })
class ProductModule extends VuexModule implements ProductState {
  public items: Entity[] = [];
  public pagination = getDefaultPagination();
  public loading = false;
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
      this.setDataTable(products);
      this.setLoading(false);
    });
  }
  @Action searchProducts(searchQuery: string, pagination: Pagination) {
    getData('products?_expand=category&' + searchQuery).then((res: TODO) => {
      const products = res.data;
      products.forEach((p: Product) => {
        p.categoryName = p.category.categoryName;
      });
      this.setDataTable(products);
      this.setLoading(false);
    });
  }
  @Action quickSearch(headers: TableHeader[], qsFilter: SeachQuery, pagination: Pagination): void {
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
      this.setDataTable(products);
      this.setLoading(false);
    });
  }
  @Action deleteProduct(id: number) {
    deleteData('products/', id.toString())
      .then((res: TODO) => {
        return new Promise((resolve, reject) => {
          appModule.sendSuccessNotice('Operation is done.');
          resolve();
        });
      })
      .catch((err: TODO) => {
        console.log(err);
        appModule.sendErrorNotice('Operation failed! Please try again later. ');
        appModule.closeNoticeWithDelay(1500);
      });
  }
  @Action saveProduct(product: Product) {
    delete product.category;
    if (!product.id) {
      postData('products/', product)
        .then((res: TODO) => {
          const product = res.data;
          this.context.commit('setProduct', { product });
          appModule.sendSuccessNotice('New product has been added.');
          appModule.closeNoticeWithDelay(1500);
        })
        .catch((err: TODO) => {
          console.log(err);
          appModule.sendErrorNotice('Operation failed! Please try again later. ');
          appModule.closeNoticeWithDelay(1500);
        });
    } else {
      putData('products/' + product.id.toString(), product)
        .then((res: TODO) => {
          const product = res.data;
          this.context.commit('setProduct', { product });
          appModule.sendSuccessNotice('Product has been updated.');
          appModule.closeNoticeWithDelay(1500);
        })
        .catch((err: TODO) => {
          console.log(err);
          appModule.sendErrorNotice('Operation failed! Please try again later. ');
          appModule.closeNoticeWithDelay(1500);
        });
    }
  }
  @Action setDataTable(items: Product[]) {
    const pagination = getPagination(items);
    this.setPagination(pagination);
    this.setItems(items);
  }
  

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
  @Mutation setProduct(product: Product) {
    this.product = product;
  }
}

export const productModule = getModule(ProductModule); // default Products;
