import React, { useState } from "react";
import { navigate } from "@reach/router";
import axios from "axios";
import { Button } from "@material-ui/core";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState([]);

  // const { reloadBoolean, setReloadBoolean } = props;

  const loginHandler = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:8000/api/user/login",
        {
          email: email,
          password: password,
        },
        {
          // this will force the sending of the credentials / cookies so they can be updated
          // XMLHttpRequest from a different domain cannot set cookie values for their own domain
          // unless withCredentials is set to true before making the request
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        // use localStorage to persist login
        localStorage.setItem("userId", response.data.userLogged.userId);
        navigate("/games");
        // setReloadBoolean(!reloadBoolean);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.msg);
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <p className='error-text'>{errorMessage ? errorMessage : ""}</p>
      <form onSubmit={loginHandler}>
        <div>
          <label>Email</label>
          <input
            type='text'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='center'>
          <Button variant='outlined' style={{ color: "black" }} type='subit'>
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;