import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';

type Props = {}

function Header({}: Props) {
  return (
    <div className="header">
        <Link to="/">Sketchu</Link>
    </div>
  )
}

export default Header;