import React, { useEffect, useState } from "react";

function App() {

  const [leads, setLeads] = useState([]);

  useEffect(() => {

    fetch("http://127.0.0.1:8000/linkedin/live-monitoring")

      .then((res) => res.json())

      .then((data) => {

        setLeads(data.engagements);

      })

      .catch((err) => console.log(err));

  }, []);

  return (

    <div
      style={{
        background: "#0b0b0f",
        color: "white",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >

        <div>

          <h1
            style={{
              fontSize: "48px",
              color: "#8b5cf6",
              marginBottom: "10px",
            }}
          >
            Aladdyn AI CRM
          </h1>

          <p
            style={{
              color: "#9ca3af",
              fontSize: "18px",
            }}
          >
            Real-Time LinkedIn Lead Intelligence Platform
          </p>

        </div>

        <div
          style={{
            background: "#16a34a",
            padding: "10px 20px",
            borderRadius: "12px",
            fontWeight: "bold",
          }}
        >
          LIVE MONITORING
        </div>

      </div>

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "40px",
        }}
      >

        <div
          style={{
            background: "#15151d",
            padding: "25px",
            borderRadius: "18px",
          }}
        >
          <h3>Total Leads</h3>

          <h1
            style={{
              fontSize: "42px",
              color: "#8b5cf6",
            }}
          >
            {leads.length}
          </h1>
        </div>

        <div
          style={{
            background: "#15151d",
            padding: "25px",
            borderRadius: "18px",
          }}
        >
          <h3>HOT Leads</h3>

          <h1
            style={{
              fontSize: "42px",
              color: "#ef4444",
            }}
          >
            {
              leads.filter(
                (lead) => lead.priority === "HOT LEAD"
              ).length
            }
          </h1>
        </div>

        <div
          style={{
            background: "#15151d",
            padding: "25px",
            borderRadius: "18px",
          }}
        >
          <h3>Browser Engine</h3>

          <h2
            style={{
              color: "#22c55e",
            }}
          >
            Playwright
          </h2>
        </div>

        <div
          style={{
            background: "#15151d",
            padding: "25px",
            borderRadius: "18px",
          }}
        >
          <h3>Detection Status</h3>

          <h2
            style={{
              color: "#f59e0b",
            }}
          >
            Stealth Active
          </h2>
        </div>

      </div>

      {/* LIVE MONITORING */}

      <div
        style={{
          background: "#15151d",
          padding: "30px",
          borderRadius: "24px",
          marginBottom: "40px",
        }}
      >

        <h2
          style={{
            marginBottom: "20px",
            fontSize: "32px",
          }}
        >
          LinkedIn Engagement Monitoring
        </h2>

        <p
          style={{
            color: "#9ca3af",
            marginBottom: "25px",
          }}
        >
          Real-time engagement ingestion workflow using
          Playwright stealth browser automation and
          session-managed monitoring.
        </p>

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >

          <div
            style={{
              background: "#0b0b0f",
              padding: "12px 18px",
              borderRadius: "10px",
            }}
          >
            Session Persistence Active
          </div>

          <div
            style={{
              background: "#0b0b0f",
              padding: "12px 18px",
              borderRadius: "10px",
            }}
          >
            Anti-Bot Protection Enabled
          </div>

          <div
            style={{
              background: "#0b0b0f",
              padding: "12px 18px",
              borderRadius: "10px",
            }}
          >
            Randomized Delays Active
          </div>

          <div
            style={{
              background: "#0b0b0f",
              padding: "12px 18px",
              borderRadius: "10px",
            }}
          >
            Engagement Extraction Running
          </div>

        </div>

      </div>

      {/* TABLE */}

      <div
        style={{
          background: "#15151d",
          borderRadius: "24px",
          overflow: "hidden",
        }}
      >

        <div
          style={{
            padding: "25px",
            borderBottom: "1px solid #262626",
          }}
        >

          <h2
            style={{
              fontSize: "32px",
            }}
          >
            Live LinkedIn Engagements
          </h2>

        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >

          <thead
            style={{
              background: "#0f0f15",
            }}
          >

            <tr>

              <th style={tableHeader}>Lead Name</th>

              <th style={tableHeader}>Engagement</th>

              <th style={tableHeader}>Interest</th>

              <th style={tableHeader}>Lead Score</th>

              <th style={tableHeader}>Priority</th>

            </tr>

          </thead>

          <tbody>

            {leads.map((lead, index) => (

              <tr
                key={index}
                style={{
                  borderBottom: "1px solid #262626",
                }}
              >

                <td style={tableCell}>
                  {lead.name}
                </td>

                <td style={tableCell}>
                  {lead.engagement}
                </td>

                <td style={tableCell}>
                  {lead.interest}
                </td>

                <td
                  style={{
                    ...tableCell,
                    color: "#8b5cf6",
                    fontWeight: "bold",
                  }}
                >
                  {lead.lead_score}
                </td>

                <td style={tableCell}>

                  <span
                    style={{
                      background:
                        lead.priority === "HOT LEAD"
                          ? "#7f1d1d"
                          : "#78350f",

                      color:
                        lead.priority === "HOT LEAD"
                          ? "#fca5a5"
                          : "#fde68a",

                      padding: "8px 14px",

                      borderRadius: "999px",

                      fontSize: "14px",

                      fontWeight: "bold",
                    }}
                  >
                    {lead.priority}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

const tableHeader = {
  padding: "18px",
  textAlign: "left",
  color: "#9ca3af",
};

const tableCell = {
  padding: "18px",
};

export default App;