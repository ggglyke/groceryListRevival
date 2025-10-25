import http from "../http-common";

class AisleDataService {
  getAllUserAisles() {
    // userId extracted from JWT token by backend middleware
    // The :id parameter is ignored by backend, using req.userId instead
    return http.get(`/rayons/user/current`);
  }
  getAll() {
    return http.get("/rayons");
  }

  get(id) {
    return http.get(`/rayons/${id}`);
  }

  create(data) {
    return http.post("/rayons", data);
  }

  insertMany(data) {
    return http.post("/rayons/many", data);
  }

  update(id, data) {
    // userId no longer needed - handled by requireAuth middleware
    return http.put(`/rayons/${id}`, data);
  }

  delete(id) {
    // userId no longer needed - handled by requireAuth middleware
    return http.delete(`/rayons/${id}`);
  }

  deleteAll() {
    // userId no longer needed - handled by requireAuth middleware
    return http.delete(`/rayons`);
  }

  findByTitle(title) {
    return http.get(`/rayons?title=${title}`);
  }
}

export default new AisleDataService();
