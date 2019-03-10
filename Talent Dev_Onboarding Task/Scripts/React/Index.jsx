import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Home from "./Component/Home.jsx";
import Product from "./Component/Product.jsx";
import Customer from "./Component/Customer.jsx";
import Store from "./Component/Store.jsx";
import Sale from "./Component/Sale.jsx";


ReactDOM.render(
    <Home/>,
    <Product/>,
    <Customer/>,
    <Store />,
    < Sale />,
    document.getElementById("products"),
     document.getElementById("home"),
    document.getElementById("customers"),
    document.getElementById("stores"),
    document.getElementById("sales")
);