import http from "../http-common";

class MagasinDataService {
  getAll() {
    return http.get("/magasins");
  }

  get(id) {
    // userId no longer needed - handled by requireAuth middleware
    return http.get(`/magasins/${id}`);
  }

  create(data) {
    return http.post("/magasins", data);
  }

  findManyByCondition(data) {
    // userId will be attached automatically by backend middleware
    return http.post("/magasins/findManyByCondition", data);
  }

  findOneByCondition(data) {
    // userId will be attached automatically by backend middleware
    return http.post("/magasins/findOneByCondition", data);
  }

  update(id, data) {
    // userId no longer needed - handled by requireAuth middleware
    return http.put(`/magasins/${id}`, data);
  }

  delete(id) {
    // userId no longer needed - handled by requireAuth middleware
    return http.delete(`/magasins/${id}`);
  }

  deleteAll() {
    // userId no longer needed - handled by requireAuth middleware
    return http.delete(`/magasins`);
  }
}

export default new MagasinDataService();
