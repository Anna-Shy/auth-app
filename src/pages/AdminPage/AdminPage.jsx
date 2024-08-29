import React from "react";

import { Header } from "../../components/Header/Header";
import { AdminPanel } from "../../components/AdminPanel/AdminPanel";

import "./adminPage.scss";

export const AdminPage = () => {
  return (
    <div className="AdminPage">
      <Header title={"Admin"} icon={"fa-solid fa-user-tie"} />

      <main className="RegisterPage__main">
        <AdminPanel />
      </main>
    </div>
  );
};
