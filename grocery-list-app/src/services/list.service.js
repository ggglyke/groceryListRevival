import http from "../http-common";

class ListDataService {
  getAll() {
    return http.get("/lists/");
  }

  getAllUserLists(userId) {
    return http.get(`/lists/user/${userId}`);
  }

  get(id, userId) {
    return http.get(`/lists/${id}?userId=${userId}`);
  }

  create(data) {
    return http.post("/lists", data);
  }

  update(id, data, userId) {
    return http.put(`/lists/${id}?userId=${userId}`, data);
  }

  delete(id, userId) {
    return http.delete(`/lists/${id}`, { data: { userId } });
  }

  deleteAll(userId) {
    return http.delete(`/lists`, { data: { userId } });
  }
}

export default new ListDataService();
