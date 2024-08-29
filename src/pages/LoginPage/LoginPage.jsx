import React from "react";

import { Header } from "../../components/Header/Header";
import { LoginForm } from "../../components/LoginForm/LoginForm";

import "./loginPage.scss";

export const LoginPage = () => {
  return (
    <div className="LoginPage">
      <Header title={"Login"} icon={"fa-solid fa-arrow-right-to-bracket"} />

      <main className="LoginPage__main">
        <LoginForm />

        <p className="LoginPage__main-text">
          Don't have an account? {" "}
          <a href="/registration" className="LoginPage__main-link">Registration</a>
        </p>
      </main>
    </div>
  );
};
