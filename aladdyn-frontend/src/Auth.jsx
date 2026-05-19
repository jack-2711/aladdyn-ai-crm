import { useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://127.0.0.1:8000";

function Auth({ setLoggedIn, fetchLeads }) {

  const [isSignup, setIsSignup] = useState(false);

  const [authData, setAuthData] = useState({
    username: "",
    password: "",
  });

  const handleAuth = async () => {

    try {

      const endpoint = isSignup
        ? "signup"
        : "login";

      const response = await axios.post(
        `${API}/${endpoint}`,
        authData
      );

      if (!isSignup) {

        localStorage.setItem(
          "token",
          response.data.access_token
        );

        setLoggedIn(true);

        fetchLeads();
      }

      alert(
        isSignup
          ? "Signup Successful"
          : "Login Successful"
      );

    } catch (error) {

      console.log(error);

      alert("Authentication Failed");

    }
  };

  return (

    <div className="auth-container">

      <div className="auth-box">

        <h2>
          {isSignup
            ? "Create Account"
            : "Login"}
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={authData.username}
          onChange={(e) =>
            setAuthData({
              ...authData,
              username: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={authData.password}
          onChange={(e) =>
            setAuthData({
              ...authData,
              password: e.target.value,
            })
          }
        />

        <button onClick={handleAuth}>
          {isSignup
            ? "Signup"
            : "Login"}
        </button>

        <p
          style={{
            marginTop: "15px",
            cursor: "pointer",
            color: "#00C2FF",
          }}
          onClick={() =>
            setIsSignup(!isSignup)
          }
        >

          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Signup"}

        </p>

      </div>

    </div>
  );
}

export default Auth;