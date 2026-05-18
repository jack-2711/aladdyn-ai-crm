import streamlit as st
import pandas as pd

# Read CSV
df = pd.read_csv("auto_leads.csv")

# Title
st.title("Aladdyn AI Lead Engine Dashboard")

# Metrics
st.subheader("Lead Statistics")

st.metric("Total Leads", len(df))

high_value = df[df["score"] >= 80]

st.metric("High Value Leads", len(high_value))

# SEARCH FEATURE
st.subheader("Search Leads")

search = st.text_input("Search by Username")

if search:
    filtered_df = df[df["username"].str.contains(search, case=False)]
else:
    filtered_df = df

# FILTER FEATURE
st.subheader("Filter by Category")

categories = df["category"].unique()

selected_category = st.selectbox(
    "Choose Category",
    ["All"] + list(categories)
)

if selected_category != "All":
    filtered_df = filtered_df[
        filtered_df["category"] == selected_category
    ]

# Display Data
st.subheader("Lead Data")

st.dataframe(filtered_df)

# Lifecycle Update Simulation
st.subheader("Lead Lifecycle Status")

selected_user = st.selectbox(
    "Select Lead",
    df["username"]
)

status = st.selectbox(
    "Update Status",
    ["New Lead", "Contacted", "Qualified", "Converted"]
)

st.success(f"{selected_user} marked as {status}")

# Charts
st.subheader("Lead Categories")

category_counts = df["category"].value_counts()

st.bar_chart(category_counts)