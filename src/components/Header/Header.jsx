import React from "react";
import { Link } from "react-router-dom";

import "./header.scss";

export const Header = ({ title, icon }) => {
  return (
    <header className="header">
      <Link to={"/"}>
        <h2 className="header-title">
          <i className={icon}></i>
          {title}
        </h2>
      </Link>
    </header>
  );
};
