import axios from 'axios';
import axiosInstance from '../lib/axiosInstance';


// Products
const buildQueryParams = (filters) => {
  return Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== '' && value !== null && value !== undefined )
  );
};
export const getProducts = (filters = {}, page = 1) => {
  const params = buildQueryParams(filters);

  return axiosInstance.get('v1/products/', {
    params: {
      page,
      ...params,
    },
  });
};

export const getProduct = (id) => axiosInstance.get(`v1/products/${id}/`);
export const createProduct = (data) => axiosInstance.post('v1/products/', data);
export const updateProduct = (id, data) => axiosInstance.put(`/products/${id}/`, data);
export const deleteProduct = (id) => axiosInstance.delete(`/products/${id}/`);

// Categories
export const getCategories = () => axiosInstance.get('v1/categories/');
export const getCategory = (id) => axiosInstance.get(`v1/categories/${id}/`);
export const createCategory = (data) => axiosInstance.post('v1/categories/', data);

// Suppliers
export const getSuppliers = (params) => axiosInstance.get('v1/suppliers/', { params });
export const createSupplier = (data) => axiosInstance.post('v1/suppliers/', data);

// Stock In
export const getStockIns = (params) => axiosInstance.get('v1/stockin/', { params });
export const createStockIn = (data) => axiosInstance.post('v1/stockin/', data);



export const createsales = (data) => axiosInstance.post('v1/sales/', data);
export const getsales = (params)=>axiosInstance.get('v1/sales/',params)
export const getsalesId = (id)=>axiosInstance.get(`v1/sales/${id}/`)

export const products_grouped_by_category = ()=> axiosInstance.get('v1/products_grouped_by_category/');


//Stats
export const total_revenue = ()=> axiosInstance.get('v1/revenue/');


export const login = (data) => axiosInstance.post(`auth-url/auth/login/`, data);
export const registercompany = (data) => axiosInstance.post(`auth-url/auth/register_client/`, data);
export const create_manager = (data) => axiosInstance.post(`auth-url/auth/create_manager/`, data);
export const create_staff = (data) => axiosInstance.post(`auth-url/auth/create_staff/`, data);

export const my_team =()=> axiosInstance.get('auth-url/auth/my_team/')
export const delete_user =(id) =>axiosInstance.delete(`auth-url/auth/${id}/delete_user/`)
export const userdetail =()=>axiosInstance.get(`auth-url/auth/me/`);

export default axiosInstance;


