import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [leads, setLeads] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);

  const [isSignup, setIsSignup] = useState(false);

  const [authData, setAuthData] = useState({
    username: "",
    password: "",
  });

  const [formData, setFormData] = useState({
    username: "",
    category: "Business",
    score: 50,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setLoggedIn(true);
      fetchLeads();
    }
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API}/leads`);

      setLeads(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAuth = async () => {
    try {
      const endpoint = isSignup ? "signup" : "login";

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

      alert("Authentication successful");
    } catch (error) {
      console.log(error);

      alert("Authentication failed");
    }
  };

  const addLead = async () => {
    try {
      await axios.post(`${API}/add-lead`, {
        ...formData,
        lifecycle: "New",
        timestamp: new Date().toISOString(),
      });

      fetchLeads();

      alert("Lead Added");
    } catch (error) {
      console.log(error);
    }
  };

  const runScraper = async () => {
    try {
      await axios.post(`${API}/run-scraper`);

      fetchLeads();

      alert("Scraper Completed");
    } catch (error) {
      console.log(error);
    }
  };

  if (!loggedIn) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h2>{isSignup ? "Signup" : "Login"}</h2>

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
            {isSignup ? "Signup" : "Login"}
          </button>

          <p
            onClick={() => setIsSignup(!isSignup)}
            style={{
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Signup"}
          </p>
        </div>
      </div>
    );
  }

  const totalLeads = leads.length;

  const convertedLeads = leads.filter(
    (lead) => lead.lifecycle === "Converted"
  ).length;

  const interestedLeads = leads.filter(
    (lead) => lead.lifecycle === "Interested"
  ).length;

  const highValueLeads = leads.filter(
    (lead) => lead.score >= 80
  ).length;

  const averageScore =
    totalLeads > 0
      ? (
          leads.reduce(
            (sum, lead) => sum + lead.score,
            0
          ) / totalLeads
        ).toFixed(1)
      : 0;

  const categoryData = [
    {
      name: "Business",
      value: leads.filter(
        (lead) => lead.category === "Business"
      ).length,
    },
    {
      name: "Creative",
      value: leads.filter(
        (lead) => lead.category === "Creative"
      ).length,
    },
    {
      name: "General",
      value: leads.filter(
        (lead) => lead.category === "General"
      ).length,
    },
  ];

  const COLORS = ["#00C2FF", "#8A5CFF", "#00E676"];

  return (
    <div className="dashboard">
      <h1>Aladdyn AI CRM Dashboard</h1>

      <div className="top-bar">
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({
              ...formData,
              username: e.target.value,
            })
          }
        />

        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value,
            })
          }
        >
          <option>Business</option>
          <option>Creative</option>
          <option>General</option>
        </select>

        <input
          type="number"
          placeholder="Score"
          value={formData.score}
          onChange={(e) =>
            setFormData({
              ...formData,
              score: e.target.value,
            })
          }
        />

        <button onClick={addLead}>
          Add Lead
        </button>

        <button onClick={runScraper}>
          Run Scraper
        </button>
      </div>

      <div className="stats-grid">
        <div className="card">
          <h3>Total Leads</h3>
          <p>{totalLeads}</p>
        </div>

        <div className="card">
          <h3>Converted Leads</h3>
          <p>{convertedLeads}</p>
        </div>

        <div className="card">
          <h3>Interested Leads</h3>
          <p>{interestedLeads}</p>
        </div>

        <div className="card">
          <h3>High Value Leads</h3>
          <p>{highValueLeads}</p>
        </div>

        <div className="card">
          <h3>Average Score</h3>
          <p>{averageScore}</p>
        </div>
      </div>

      <div className="chart-container">
        <h3>Lead Category Distribution</h3>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              outerRadius={120}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;