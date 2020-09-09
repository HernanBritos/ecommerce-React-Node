import React, { useState } from "react";
import cComponent from "./css/formCategory.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

export default function FormCategory() {
  const [input, setInput] = useState({
    name: "",
  });

  const handleInputChange = function (e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
    // setErrors(
    //   validate({
    //     ...input,
    //     [e.target.name]: e.target.value,
    //   })
    // );
  };

  const handleSubmit = function (e) {
    e.preventDefault();
    axios
      .post("http://localhost:3001/categories", {
        name: `${input.name}`,
      })
      .then((data) => {
        return data;
      });
    return (window.location = "http://localhost:3000/admin");
  };

  return (
    <div className={cComponent.back}>
      <Link to="/admin">
        <button className="btn btn-primary">Volver al panel de admin</button>
      </Link>
      <form className={cComponent.form} onSubmit={handleSubmit}>
        <h1 className={`my-3 ${cComponent.tituloForm}`}>
          Añadir Categoria...{" "}
        </h1>
        <div className={cComponent.Fcontent}>
          <div className="form-group">
            <label htmlFor="name">Nombre de Categoria: </label>
            <input
              name="name"
              value={input.name}
              type="text"
              onChange={handleInputChange}
              className="form-control"
              id="Name"
            />
          </div>
          <button type="submit" className="btn-success">
            Añadir a Categorias
          </button>
        </div>
      </form>
    </div>
  );
}