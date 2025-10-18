import http from "../http-common";

class AisleDataService {
  getAllUserAisles(userId) {
    return http.get(`/rayons/user/${userId}`);
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
    return http.put(`/rayons/${id}`, data);
  }

  delete(id) {
    return http.delete(`/rayons/${id}`);
  }

  deleteAll() {
    return http.delete(`/rayons`);
  }

  findByTitle(title) {
    return http.get(`/rayons?title=${title}`);
  }
}

export default new AisleDataService();
