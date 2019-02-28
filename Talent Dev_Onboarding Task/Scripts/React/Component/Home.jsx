import React, { Component } from "react";


class Home extends Component {
    render() {
        return (
            <div>
                <h1>Welcome</h1>
                <ul className="header">
                    <li><a href="/">Home</a></li>
                    <li><a href="/stuff">Stuff</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
                <div className="content" />
            </div>
        );
    }
}
const app = document.getElementById('home');
ReactDOM.render(<div><h1 className="anim">Welcome To Shop</h1><Home /></div>, app);
export default Home;