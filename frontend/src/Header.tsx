import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

type Props = {}

function Header({}: Props) {
  return (
    <div className="header">
        <h1>ArtMentor</h1>
    </div>
  )
}

export default Header;