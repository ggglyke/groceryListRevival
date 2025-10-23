import http from "../http-common";

class MagasinDataService {
  getAll() {
    return http.get("/magasins");
  }

  get(id) {
    return http.get(`/magasins/${id}`);
  }

  create(data) {
    return http.post("/magasins", data);
  }

  findManyByCondition(data) {
    return http.post("/magasins/findManyByCondition", data);
  }

  findOneByCondition(data) {
    return http.post("/magasins/findOneByCondition", data);
  }

  update(id, data, userId) {
    return http.put(`/magasins/${id}?userId=${userId}`, data);
  }

  delete(id, userId) {
    return http.delete(`/magasins/${id}`, { data: { userId } });
  }

  deleteAll(userId) {
    return http.delete(`/magasins`, { data: { userId } });
  }
}

export default new MagasinDataService();
