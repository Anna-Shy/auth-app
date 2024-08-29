import React from "react";

import { Header } from "../../components/Header/Header";
import { RegisterForm } from "../../components/RegisterForm/RegisterForm";

import "./registerPage.scss";

export const RegisterPage = () => {
  return (
    <div className="RegisterPage">
      <Header title={"Registration"} icon={"fa-regular fa-registered"} />

      <main className="RegisterPage__main">
        <RegisterForm />

        <p className="LoginPage__main-text">
          Already have an account?{" "}
          <a href="/" className="LoginPage__main-link">
            Login
          </a>
        </p>
      </main>
    </div>
  );
};
