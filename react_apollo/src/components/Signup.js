import React, { Component } from "react";
import { gql } from 'apollo-boost';
import { graphql} from 'react-apollo';
import { Link } from "react-router-dom";


const signupMutation = gql`

mutation AddUser($name: String!, $email: String!, $password: String! ) {

addUser(name:$name , email: $email, password: $password) {

    name
    id
}
}
`

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open: false
        };
    }

    handleChange = name => event => {
        this.setState({ error: "" });
        this.setState({ [name]: event.target.value });
    };

    clickSubmit = event => {
        event.preventDefault();
        const { name, email, password } = this.state;
        // console.log(name,email,password);
        this.props.signupMutation({

            variables: {


                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            }
        }).then((res,err) => {

            console.log(res);
            console.log(err);
        })
       
    };

    signupForm = (name, email, password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    onChange={this.handleChange("name")}
                    type="text"
                    className="form-control"
                    value={name}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={this.handleChange("email")}
                    type="email"
                    className="form-control"
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    onChange={this.handleChange("password")}
                    type="password"
                    className="form-control"
                    value={password}
                />
            </div>
            <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary"
            >
                Submit
            </button>
        </form>
    );

    render() {
        const { name, email, password, error, open } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Signup</h2>

                <div
                    className="alert alert-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>

                <div
                    className="alert alert-info"
                    style={{ display: open ? "" : "none" }}
                >
                    New account is successfully created. Please{" "}
                    <Link to="/signin">Sign In</Link>.
                </div>

                {this.signupForm(name, email, password)}
            </div>
        );
    }
}

export default graphql(signupMutation, { name: 'signupMutation'})(Signup);
