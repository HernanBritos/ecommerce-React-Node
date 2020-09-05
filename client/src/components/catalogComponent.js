import React from "react";
import cComponent from "../components/css/catalogComponent.module.css";
import ProductCard from "./productCard";
import axios from "axios";

class CatalogComponent extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
  }
  componentDidMount() {
    axios.get("http://localhost:3001/products").then((data) => {
      this.setState({ products: data.data });
    });
  }
  render() {
    console.log(this.state.products);
    return (
      <div className={cComponent.catalog}>
        {this.state.products.map((product) => {
          return (
            <div className={cComponent.pCard}>
              <div>
                <ProductCard producto={product} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default CatalogComponent;
