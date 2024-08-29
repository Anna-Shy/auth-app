import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { LoginPage } from "./pages/LoginPage/LoginPage";
import { RegisterPage } from "./pages/RegisterPage/RegisterPage";
import { AdminPage } from "./pages/AdminPage/AdminPage";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";

import "./styles/global.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/registration",
    element: <RegisterPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
