import http from "../http-common";

class ProductDataService {
  getAllUserProducts(userId) {
    return http.get(`/products/user/${userId}`);
  }

  get(id, userId) {
    return http.get(`/products/${id}?userId=${userId}`);
  }

  create(data) {
    return http.post("/products", data);
  }

  update(id, data, userId) {
    return http.put(`/products/${id}?userId=${userId}`, data);
  }

  delete(id, userId) {
    return http.delete(`/products/${id}?userId=${userId}`);
  }

  deleteAll(userId) {
    return http.delete(`/products?userId=${userId}`);
  }
}

export default new ProductDataService();
