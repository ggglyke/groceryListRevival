import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

import useLists from "./useLists";
import ListItem from "./ListItem";
import EmptyLists from "./EmptyLists";
import Loader from "../ui/Loader";
import PageLayout from "../layout/PageLayout";
import TooltipComponent from "../reusable/tooltip.component";

export default function Lists({ userId }) {
  const { lists, isLoading, error, createList } = useLists({ userId });

  if (!userId) return <Loader />;
  if (isLoading) return <Loader />;

  return (
    <>
      {lists.length > 0 ? (
        <PageLayout
          breadcrumbs={[{ label: "Listes", path: "/lists" }]}
          title="Toutes vos listes"
          error={error}
          headerActions={
            <button onClick={createList} className="btn btn-primary">
              Ajouter
            </button>
          }
        >
          <div className="list-group">
            {lists.map((list) => (
              <ListItem key={list._id} list={list} />
            ))}
          </div>

          <div className="mt-4 d-flex justify-content-center">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Créer une liste
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">
                  Liste simple
                  <TooltipComponent
                    config={{ size: ".75em" }}
                    text={[
                      "Des éléments à cocher, c'est tout.",
                      <br />,
                      " Idéal pour une TODO list.",
                    ]}
                  />
                </Dropdown.Item>
                <Dropdown.Item href="#/action-2">
                  Liste avancée
                  <TooltipComponent
                    config={{ size: ".75em" }}
                    text={[
                      "Une liste que vous attribuez à un magasin, avec des rayons dans un ordre que vous définissez. ",
                      <br />,
                      " Idéal pour une liste de courses.",
                    ]}
                  />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </PageLayout>
      ) : (
        <EmptyLists createList={createList} />
      )}
    </>
  );
}
