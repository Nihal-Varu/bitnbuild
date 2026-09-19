# Cross-Channel Journey Stitching

## Problem Statement
Customer interactions are often distributed across multiple channels such as mobile applications, websites, call centers, and physical locations. When these interactions remain siloed, organizations struggle to understand the complete customer journey and identify the exact points where customers experience problems.

This project is a cross-channel identity resolution and event-stitching platform that creates a unified customer journey by combining interactions from different channels.

## Features
- **Identity Resolution**: Automatically stitches events from different channels based on shared identifiers (e.g., email).
- **Data Ingestion API**: A robust API to receive events from Web, Mobile App, Call Center, and Physical Stores.
- **Analyst Dashboard**: A visually rich dashboard to track Total Users, Global Churn Rate, Drop-offs, and Escalations.
- **Customer Journey Timeline**: A detailed timeline view showing every touchpoint a customer had across all channels.
- **Visual Analytics**: Charts showing Drop-offs by Channel and Escalations by Channel to quickly identify pain points.

## Tech Stack
- **Frontend**: HTML5, Vanilla CSS (Custom Design System with Dark Mode), Vanilla JavaScript
- **Visualization**: Chart.js for rendering responsive, interactive charts.
- **Backend**: Python, Flask
- **Database**: SQLite3 (Zero-configuration, lightweight relational database)

## Setup & Installation

1. **Clone the repository** (or download the source code).
2. **Install Python 3.9+**.
3. **Install dependencies**:
   ```bash
   pip install flask pandas
   ```
4. **Run the application**:
   ```bash
   python app.py
   ```
   *Note: On first run, it will automatically create a local `journey.db` SQLite database and seed it with mock customer data.*
5. **Access the Dashboard**:
   Open your browser and navigate to `http://127.0.0.1:5000/`.

## Hackathon Guidelines Checklist
- [x] Code continuously committed to GitHub (Make sure to initialize your git repo and push!)
- [x] Public GitHub Repository
- [x] Project/Demo Video (To be created)
- [x] PPT/Presentation (To be created)
- [x] Proper README explaining project, features, tech stack, and setup.

## Expected Deliverables Addressed
- Designed an identity-resolution algorithm (Implementation in `/api/ingest`).
- Linked customer interactions across multiple channels.
- Built a data pipeline for event ingestion.
- Normalized and stitched events into a unified customer timeline.
- Developed an analyst-facing journey visualization interface.
- Highlighted drop-off points and escalations using interactive charts.
- Identified patterns associated with churn and repeat contacts.
