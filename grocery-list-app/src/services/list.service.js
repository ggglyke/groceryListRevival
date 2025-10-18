import http from "../http-common";

class ListDataService {
  getAll() {
    return http.get("/lists/");
  }

  getAllUserLists(userId) {
    return http.get(`/lists/user/${userId}`);
  }

  get(id) {
    return http.get(`/lists/${id}`);
  }

  create(data) {
    return http.post("/lists", data);
  }

  update(id, data) {
    return http.put(`/lists/${id}`, data);
  }

  delete(id) {
    return http.delete(`/lists/${id}`);
  }

  deleteAll() {
    return http.delete(`/lists`);
  }
}

export default new ListDataService();
