import React from "react";
import logo from "../../../../../public/cosinelens-icon.svg";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <img src={logo} alt="CosineLens logo" />
      <span className="font-bold text-xl text-foreground">
        Cosine
        <span className="text-primary">Lens</span>
      </span>
    </div>
  );
};

export default Logo;
