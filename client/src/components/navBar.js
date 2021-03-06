import React from "react";
import navbar from "./css/navBar.module.css";

class Navbar extends React.Component {
  render() {
    return (
      <div class="topnav" className={navbar.navbar} id="myTopnav">
        <a href="http://localhost:3000/" className={navbar.navbar_a}>
          Inicio
        </a>
        <a href="/" className={navbar.navbar_a}>
          Quienes somos
        </a>
        <a href="/" className={navbar.navbar_a}>
          Preguntas frecuentes
        </a>
        <a href="/" className={`${navbar.navbar_a} ${navbar.ultimo}`}>
          Contacto
        </a>
      </div>
    );
  }
}

export default Navbar;

