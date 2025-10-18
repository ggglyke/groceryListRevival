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

  update(id, data) {
    return http.put(`/magasins/${id}`, data);
  }

  delete(id) {
    return http.delete(`/magasins/${id}`);
  }

  deleteAll() {
    return http.delete(`/magasins`);
  }
}

export default new MagasinDataService();
