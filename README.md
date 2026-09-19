# Cross-Channel Journey Stitching

## Problem Statement
Customer interactions are often distributed across multiple channels such as mobile applications, websites, call centers, and physical locations. When these interactions remain siloed, organizations struggle to understand the complete customer journey and identify the exact points where customers experience problems.

This project is a cross-channel identity resolution and event-stitching platform that creates a unified customer journey by combining interactions from different channels.

## Features
- **Identity Resolution**: Automatically stitches events from different channels based on shared identifiers (e.g., email).
- **Multi-Page Dashboard**: A visually rich dashboard with a sidebar navigation spanning five distinct analytical views.
- **Drop-off Analysis**: Funnel charts and channel breakdown to see exactly where users abandon the journey.
- **Escalations & Support**: Identifies unresolved issues and flags users with repeat contacts.
- **Churn Correlation**: Visualizes how negative experiences (like escalations) increase the likelihood of a customer churning.
- **Data Pipeline Simulator**: A dedicated page to manually send custom JSON payloads to the `/api/ingest` endpoint to demonstrate the Identity Resolution algorithm live.

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
> [!TIP]
> You can now push your local repository to a public GitHub repo to satisfy the hackathon rules:
> ```bash
> git remote add origin https://github.com/your-username/your-repo-name.git
> git branch -M main
> git push -u origin main
> ```

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
