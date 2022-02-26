import React from "react";
import { navigate } from "@reach/router";
import Login from "../components/Login";
import RegisterUser from "../components/RegisterUser";
import { Button } from "@material-ui/core";

const LogReg = () => {
  return (
    <div className='container-flex'>
      <Login />
      <hr />
      <RegisterUser />
      <div>
        <Button
          variant='outlined'
          style={{ color: "black" }}
          onClick={() => navigate("/games")}
        >
          See All Games
        </Button>
      </div>
    </div>
  );
};

export default LogReg;