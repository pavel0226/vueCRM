// import { Commit } from 'vuex-module-decorators'
import { Commit } from "vuex";
import { Entity } from "@/types";
export const DEFAULT_ROW_PER_PAGE = 10;

export function getDefaultPagination(): Pagination {
  return {
    page: 1,
    totalItems: 0,
    rowsPerPage: DEFAULT_ROW_PER_PAGE,
    pages: 0
  };
}

/**
 * Set pagination to the store
 * @param {*} commit -- commit funciton pass from caller
 * @param {*} page -- current page number
 * @param {*} totalItems  -- total amount of items
 * @param {*} rowsPerPage -- rows to display per pages
 * @param {*} pages -- total pages
 */
export function setPagination(
  commit: Commit,
  page: number,
  totalItems: Entity[],
  pages: number,
  rowsPerPage: number
) {
  commit("setPagination", {
    page,
    totalItems,
    pages,
    rowsPerPage: rowsPerPage || DEFAULT_ROW_PER_PAGE
  });
}

/**
 * Set pagination to the store
 * @param {*} commit -- commit funciton pass from caller
 * @param {*} items -- search result
 */
export function commitPagination(commit: Commit, items: Entity[]) {
  const totalItems = items ? items.length : 0;
  const pages = Math.ceil(totalItems / DEFAULT_ROW_PER_PAGE);

  commit("setItems", items);
  commit("setPagination", {
    totalItems,
    pages,
    page: 1,
    rowsPerPage: DEFAULT_ROW_PER_PAGE
  });
}

export function getPagination(items: Entity[]) {
  const totalItems = items ? items.length : 0;
  const pages = Math.ceil(totalItems / DEFAULT_ROW_PER_PAGE);
  return { totalItems, pages, page: 1, rowsPerPage: DEFAULT_ROW_PER_PAGE };
}
