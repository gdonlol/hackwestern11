import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import userService from "./services/userService";

type Props = {}

function Header({}: Props) {
  const token = localStorage.getItem("token");
  const user = token ? userService.getUser(token) : null;


  return (
  
    <div className="header">
        <Link to="/" className='logo-title'><img src={'./long_logo.png'} style={{width: '300px'}}/></Link>
        {user && <>
        <Link to="/login" className='login-btn'>Login</Link>
        <Link to="/signup" className='signup-btn'>Signup</Link></>}
    </div>
  )
}

export default Header;