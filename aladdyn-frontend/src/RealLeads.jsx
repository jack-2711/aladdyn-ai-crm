import React, { useEffect, useState } from "react";

const RealLeads = () => {

  const [leads, setLeads] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Fetch Leads
  const fetchLeads = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/real-leads"
      );

      const data = await response.json();

      setLeads(data.leads || []);

    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Alerts
  const fetchAlerts = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/alerts"
      );

      const data = await response.json();

      setAlerts(data.alerts || []);

    } catch (error) {
      console.log(error);
    }
  };

  // Generate Instagram Leads
  const generateInstagramLeads = async () => {

    try {

      await fetch(
        "http://127.0.0.1:8000/instagram/posts"
      );

      fetchLeads();
      fetchAlerts();

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    fetchLeads();
    fetchAlerts();

  }, []);

  return (
    <div style={{ padding: "20px" }}>

      <h1>🚀 Aladdyn AI Lead Platform</h1>

      <button
        onClick={generateInstagramLeads}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          cursor: "pointer"
        }}
      >
        Fetch Instagram Leads
      </button>

      <h2>🔥 Alerts</h2>

      {
        alerts.map((alert, index) => (
          <div
            key={index}
            style={{
              background: "#ffcccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "10px"
            }}
          >
            {alert.message} | Score: {alert.score}
          </div>
        ))
      }

      <h2>📈 Real Leads</h2>

      {
        leads.map((lead, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px"
            }}
          >

            <h3>{lead.platform}</h3>

            <p>
              <strong>Caption:</strong> {lead.caption}
            </p>

            <p>
              <strong>AI Score:</strong> {lead.ai_score}
            </p>

            <p>
              <strong>Media Type:</strong> {lead.media_type}
            </p>

            {
              lead.media_url && (
                <img
                  src={lead.media_url}
                  alt="instagram"
                  width="250"
                  style={{ borderRadius: "10px" }}
                />
              )
            }

          </div>
        ))
      }

    </div>
  );
};

export default RealLeads;