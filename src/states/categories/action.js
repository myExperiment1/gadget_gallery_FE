import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { setAlertActionCreator } from '../alert/action';
import api from '../../constants/api';
import { setCategoryPaginationActionCreator } from '../categoryPagination/action';

const ActionType = {
  GET_CATEGORIES: 'GET_CATEGORIES',
  CREATE_CATEGORY: 'CREATE_CATEGORY',
  EDIT_CATEGORY: 'EDIT_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
};

function getCategoriesActionCreator(categories) {
  return {
    type: ActionType.GET_CATEGORIES,
    payload: { categories },
  };
}

function createCategoryActionCreator(category) {
  return {
    type: ActionType.CREATE_CATEGORY,
    payload: { category },
  };
}

function editCategoryActionCreator(category) {
  return {
    type: ActionType.EDIT_CATEGORY,
    payload: { category },
  };
}

function deleteCategoryActionCreator(categoryId) {
  return {
    type: ActionType.DELETE_CATEGORY,
    payload: { categoryId },
  };
}

function asyncGetCategories({
  search,
  sortBy,
  orderBy,
  pagination = false,
  page,
  perPage,
} = {}) {
  return async (dispatch) => {
    try {
      dispatch(showLoading());

      const searchQ = search ? `search=${encodeURIComponent(search)}&` : '';
      const sortByQ = sortBy ? `sortBy=${encodeURIComponent(sortBy)}&` : '';
      const orderByQ = orderBy ? `orderBy=${encodeURIComponent(orderBy)}&` : '';
      const paginationQ =
        pagination === true ? `pagination=${encodeURIComponent(true)}&` : '';
      const pageQ = page ? `page=${encodeURIComponent(page)}&` : '';
      const perPageQ = perPage ? `perPage=${encodeURIComponent(perPage)}&` : '';
      const allQuery = `?${searchQ}${sortByQ}${orderByQ}${paginationQ}${pageQ}${perPageQ}`;

      const { data } = await api.get(`/categories${allQuery}`);
      dispatch(getCategoriesActionCreator(data.data));
      dispatch(setCategoryPaginationActionCreator(data.info));
    } catch (err) {
      dispatch(setAlertActionCreator({ err }));
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncCreateCategory(formData) {
  return async (dispatch) => {
    try {
      dispatch(showLoading());
      const { data } = await api.post('/categories', formData);
      dispatch(createCategoryActionCreator(data.data));
      dispatch(setAlertActionCreator());
      return true;
    } catch (err) {
      dispatch(setAlertActionCreator({ err }));
      return false;
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncEditCategory({ categoryId, formData }) {
  return async (dispatch) => {
    try {
      dispatch(showLoading());
      const { data } = await api.patch(`/categories/${categoryId}`, formData);
      dispatch(editCategoryActionCreator(data.data));
      dispatch(setAlertActionCreator());
      return true;
    } catch (err) {
      dispatch(setAlertActionCreator({ err }));
      return false;
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncDeleteCategory(categoryId) {
  return async (dispatch) => {
    try {
      dispatch(showLoading());
      await api.delete(`/categories/${categoryId}`);
      dispatch(deleteCategoryActionCreator(categoryId));
      dispatch(setAlertActionCreator());
    } catch (err) {
      dispatch(setAlertActionCreator({ err }));
    } finally {
      dispatch(hideLoading());
    }
  };
}

export {
  ActionType,
  getCategoriesActionCreator,
  createCategoryActionCreator,
  editCategoryActionCreator,
  deleteCategoryActionCreator,
  asyncGetCategories,
  asyncCreateCategory,
  asyncEditCategory,
  asyncDeleteCategory,
};
