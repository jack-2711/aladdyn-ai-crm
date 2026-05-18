import { useState } from "react";

function Auth({ setIsLoggedIn }) {

  const [isSignup, setIsSignup] =
    useState(false);

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleAuth = async () => {

    const endpoint = isSignup
      ? "signup"
      : "login";

    const response = await fetch(
      `http://127.0.0.1:8000/${endpoint}`,
      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          username,
          password
        })
      }
    );

    const data =
      await response.json();

    alert(
      data.message ||
      "Authentication successful"
    );

    if (data.access_token) {

      localStorage.setItem(
        "token",
        data.access_token
      );

      setIsLoggedIn(true);
    }
  };

  return (

    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white"
      }}
    >

      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "40px",
          borderRadius: "20px",
          width: "350px"
        }}
      >

        <h1
          style={{
            marginBottom: "30px",
            textAlign: "center"
          }}
        >
          {isSignup
            ? "Signup"
            : "Login"}
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <button
          onClick={handleAuth}
          style={buttonStyle}
        >
          {isSignup
            ? "Signup"
            : "Login"}
        </button>

        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            cursor: "pointer"
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

const inputStyle = {

  width: "100%",

  padding: "12px",

  marginBottom: "20px",

  borderRadius: "8px",

  border: "none"
};

const buttonStyle = {

  width: "100%",

  padding: "12px",

  backgroundColor: "#06b6d4",

  color: "white",

  border: "none",

  borderRadius: "8px",

  cursor: "pointer"
};

export default Auth;