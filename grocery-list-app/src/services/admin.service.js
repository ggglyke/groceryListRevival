import http from "../http-common";

const listUsers = () => http.get("/admin/users");
const deleteUser = (id) => http.delete(`/admin/users/${id}`);

export default { listUsers, deleteUser };
