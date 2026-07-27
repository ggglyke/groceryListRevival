import React, { useState, useEffect, useCallback } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from "react-toastify";
import AdminDataService from "../services/admin.service";
import AlertModal from "./ui/AlertModal";
import PageLayout from "./layout/PageLayout";
import Loader from "./ui/Loader";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await AdminDataService.listUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des comptes", {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await AdminDataService.deleteUser(userToDelete._id);
      toast.success(`Compte "${userToDelete.username}" supprimé`, {
        position: "top-right",
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Erreur lors de la suppression",
        { position: "top-right" }
      );
    } finally {
      setUserToDelete(null);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <PageLayout breadcrumbs={[{ label: "Admin" }]} title="Administration">
      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Email</th>
            <th>Vérifié</th>
            <th>Créé le</th>
            <th>Listes</th>
            <th>Magasins</th>
            <th>Produits</th>
            <th>Rayons</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.isVerified ? "✅" : "❌"}</td>
              <td>{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>
              <td>{u.counts?.lists ?? 0}</td>
              <td>{u.counts?.magasins ?? 0}</td>
              <td>{u.counts?.products ?? 0}</td>
              <td>{u.counts?.rayons ?? 0}</td>
              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setUserToDelete(u)}
                >
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <AlertModal
        show={!!userToDelete}
        title="Supprimer ce compte"
        message={
          userToDelete && (
            <>
              Voulez-vous vraiment supprimer le compte "{userToDelete.username}
              " ({userToDelete.email}) ?
              <br />
              <br />
              Cette action est irréversible et supprimera aussi{" "}
              {userToDelete.counts?.lists ?? 0} liste(s),{" "}
              {userToDelete.counts?.magasins ?? 0} magasin(s),{" "}
              {userToDelete.counts?.products ?? 0} produit(s) et{" "}
              {userToDelete.counts?.rayons ?? 0} rayon(s).
            </>
          )
        }
        confirmButtonText="Oui, supprimer ce compte"
        variant="danger"
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
      />

      <ToastContainer />
    </PageLayout>
  );
}
