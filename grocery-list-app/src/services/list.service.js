import http from "../http-common";

class ListDataService {
  getAll() {
    return http.get("/lists/");
  }

  getAllUserLists() {
    // userId extracted from JWT token by backend middleware
    // The :id parameter is ignored by backend, using req.userId instead
    return http.get(`/lists/user/current`);
  }

  get(id) {
    // userId no longer needed - handled by requireAuth middleware
    return http.get(`/lists/${id}`);
  }

  create(data) {
    return http.post("/lists", data);
  }

  update(id, data) {
    // userId no longer needed - handled by requireAuth middleware
    return http.put(`/lists/${id}`, data);
  }

  delete(id) {
    // userId no longer needed - handled by requireAuth middleware
    return http.delete(`/lists/${id}`);
  }

  deleteAll() {
    // userId no longer needed - handled by requireAuth middleware
    return http.delete(`/lists`);
  }
}

export default new ListDataService();
