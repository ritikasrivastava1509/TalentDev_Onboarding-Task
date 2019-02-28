import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Home from "./Component/Home.jsx";
import Product from "./Component/Product.jsx";
import Customer from "./Component/Customer.jsx";



ReactDOM.render(
    <Home/>,
    <Product />,
    <Customer />,
    document.getElementById("products"),
     document.getElementById("home"),
    document.getElementById("customers")
);