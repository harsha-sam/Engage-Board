import React from "react";
import "./Logo.css";

const Logo = ({ src, name }) => {
  return (
    <div className="brand-logo">
      {/* <img src={src} alt={name} /> */}
      <h2 style={{ color: "#fff" }}>{name}</h2>
    </div>
  );
};

export default Logo;
