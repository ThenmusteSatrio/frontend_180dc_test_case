import api from "./api";

export const getProducts = async(params: {page?: number; search?: string; limit?: number; sort_by?: string; sort_order?: 'asc' | 'desc';}) => {
    const response = await api.get('/products', {params});
    return response.data
}

export const createProduct = async (data: { name: string; price: number }) => {
  const response = await api.post('/products', data);
  return response.data;
};

export const updateProduct = async (id: number, data: { name?: string; description?: string; price?: number }) => {
  const response = await api.patch(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};