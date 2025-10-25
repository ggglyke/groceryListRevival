import http from "../http-common";

class ProductDataService {
  getAllUserProducts() {
    // userId extracted from JWT token by backend middleware
    // The :id parameter is ignored by backend, using req.userId instead
    return http.get(`/products/user/current`);
  }

  get(id) {
    // userId no longer needed - handled by requireAuth middleware
    return http.get(`/products/${id}`);
  }

  create(data) {
    return http.post("/products", data);
  }

  update(id, data) {
    // userId no longer needed - handled by requireAuth middleware
    return http.put(`/products/${id}`, data);
  }

  delete(id) {
    // userId no longer needed - handled by requireAuth middleware
    return http.delete(`/products/${id}`);
  }

  deleteAll() {
    // userId no longer needed - handled by requireAuth middleware
    return http.delete(`/products`);
  }
}

export default new ProductDataService();
