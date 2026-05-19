import { useEffect, useState } from "react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

function RealLeads() {

  const [leads, setLeads] = useState([]);

  const [alerts, setAlerts] = useState([]);

  const [search, setSearch] = useState("");

  const [platformFilter, setPlatformFilter] = useState("");

  const [priorityFilter, setPriorityFilter] = useState("");

  // Auto Refresh
  useEffect(() => {

    const fetchLeads = () => {

      // Leads API
      axios
        .get("http://127.0.0.1:8000/real-leads")
        .then((response) => {
          setLeads(response.data);
        });

      // Alerts API
      axios
        .get("http://127.0.0.1:8000/alerts")
        .then((response) => {
          setAlerts(response.data);
        });

    };

    // Initial Fetch
    fetchLeads();

    // Auto Refresh Every 5 Seconds
    const interval = setInterval(fetchLeads, 5000);

    return () => clearInterval(interval);

  }, []);

  // Filter Leads
  const filteredLeads = leads.filter((lead) => {

    const matchesSearch =
      lead.company_name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesPlatform =
      platformFilter === "" ||
      lead.platform === platformFilter;

    const matchesPriority =
      priorityFilter === "" ||
      lead.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesPlatform &&
      matchesPriority
    );

  });

  // Analytics
  const totalLeads = leads.length;

  const hotLeads = leads.filter(
    (lead) => lead.priority === "HOT"
  ).length;

  const avgScore =
    leads.reduce((sum, lead) => sum + lead.ai_score, 0) /
    (leads.length || 1);

  const platforms = [...new Set(
    leads.map((lead) => lead.platform)
  )].length;

  // Pie Chart Data
  const platformData = [

    {
      name: "LinkedIn",
      value: leads.filter(
        (l) => l.platform === "LinkedIn"
      ).length
    },

    {
      name: "Crunchbase",
      value: leads.filter(
        (l) => l.platform === "Crunchbase"
      ).length
    },

    {
      name: "Instagram",
      value: leads.filter(
        (l) => l.platform === "Instagram"
      ).length
    },

    {
      name: "Google Maps",
      value: leads.filter(
        (l) => l.platform === "Google Maps"
      ).length
    },

    {
      name: "Product Hunt",
      value: leads.filter(
        (l) => l.platform === "Product Hunt"
      ).length
    }

  ];

  // Bar Chart Data
  const priorityData = [

    {
      priority: "HOT",
      count: leads.filter(
        (l) => l.priority === "HOT"
      ).length
    },

    {
      priority: "WARM",
      count: leads.filter(
        (l) => l.priority === "WARM"
      ).length
    },

    {
      priority: "COLD",
      count: leads.filter(
        (l) => l.priority === "COLD"
      ).length
    }

  ];

  return (

    <div
      style={{
        backgroundColor: "#020617",
        minHeight: "100vh",
        padding: "30px",
        color: "white"
      }}
    >

      {/* Title */}
      <h1
        style={{
          fontSize: "45px",
          marginBottom: "30px"
        }}
      >
        🚀 AI Lead Intelligence Dashboard
      </h1>

      {/* Live Alerts */}
      <div
        style={{
          marginBottom: "30px"
        }}
      >

        <h2>🚨 Live Alerts</h2>

        {alerts.map((alert, index) => (

          <div
            key={index}
            style={{
              backgroundColor: "#7f1d1d",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "10px"
            }}
          >

            {alert.message} — {alert.company_name}

          </div>

        ))}

      </div>

      {/* Analytics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "40px"
        }}
      >

        <div style={cardStyle}>
          <h2>Total Leads</h2>
          <h1>{totalLeads}</h1>
        </div>

        <div style={cardStyle}>
          <h2>HOT Leads</h2>
          <h1>{hotLeads}</h1>
        </div>

        <div style={cardStyle}>
          <h2>Platforms</h2>
          <h1>{platforms}</h1>
        </div>

        <div style={cardStyle}>
          <h2>Average AI Score</h2>
          <h1>{avgScore.toFixed(1)}</h1>
        </div>

      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginBottom: "50px"
        }}
      >

        {/* Pie Chart */}
        <div style={chartStyle}>

          <h2>Platform Distribution</h2>

          <ResponsiveContainer width="100%" height={300}>

            <PieChart>

              <Pie
                data={platformData}
                dataKey="value"
                outerRadius={100}
                fill="#38bdf8"
                label
              />

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* Bar Chart */}
        <div style={chartStyle}>

          <h2>Lead Priority</h2>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={priorityData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="priority" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="count" fill="#22c55e" />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Search + Filters */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap"
        }}
      >

        {/* Search */}
        <input
          type="text"
          placeholder="Search company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            width: "250px"
          }}
        />

        {/* Platform Filter */}
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "none"
          }}
        >

          <option value="">All Platforms</option>

          <option value="LinkedIn">LinkedIn</option>

          <option value="Crunchbase">Crunchbase</option>

          <option value="Instagram">Instagram</option>

          <option value="Google Maps">Google Maps</option>

          <option value="Product Hunt">Product Hunt</option>

        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "none"
          }}
        >

          <option value="">All Priorities</option>

          <option value="HOT">HOT</option>

          <option value="WARM">WARM</option>

          <option value="COLD">COLD</option>

        </select>

      </div>

      {/* Lead Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px"
        }}
      >

        {filteredLeads.map((lead, index) => (

          <div
            key={index}
            style={{
              backgroundColor: "#1e293b",
              padding: "20px",
              borderRadius: "15px",
              transition: "0.3s"
            }}
          >

            <h2 style={{ color: "#38bdf8" }}>
              {lead.company_name}
            </h2>

            <p>📱 Platform: {lead.platform}</p>

            <p>🏭 Industry: {lead.industry}</p>

            <p>📍 Location: {lead.location}</p>

            <p>🤖 AI Score: {lead.ai_score}</p>

            <p>🔥 Priority: {lead.priority}</p>

          </div>

        ))}

      </div>

    </div>
  );
}

// Analytics Card Style
const cardStyle = {
  backgroundColor: "#1e293b",
  padding: "25px",
  borderRadius: "15px",
  textAlign: "center"
};

// Chart Style
const chartStyle = {
  backgroundColor: "#1e293b",
  padding: "20px",
  borderRadius: "15px"
};

export default RealLeads;