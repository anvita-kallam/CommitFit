# CommitFit  
**Automized Candidate to Job Matching from GitHub Activity**  

<p align="center">
  <a href="https://commit-fit.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Deployed%20Demo-CommitFit-purple?style=for-the-badge" alt="Live Demo"/>
  </a>
</p>

CommitFit is a full-stack application that analyzes GitHub profiles and matches them with job requirements to help recruiters and hiring managers quickly identify strong technical candidates. By combining GitHub repository analysis with NLP-driven job description parsing, CommitFit delivers data-backed skill matching through an intuitive, modern interface.

---

## Features

### Backend (Python + FastAPI)

- **GitHub Repo Analysis**  
  Fetches public repositories and extracts:
  - Programming languages  
  - Framework indicators  
  - Commit patterns and activity history  

- **Job Description Parsing (spaCy NLP)**  
  Automatically identifies key technologies, tools, and required skills from raw job descriptions.

- **Skill Matching Engine**  
  Computes similarity scores between candidate abilities and job requirements using weighted matching logic.

- **REST API Endpoints**
  - `/analyze/candidate` — GitHub profile + repo breakdown  
  - `/analyze/job` — extracted skills from job text  
  - `/match` — detailed compatibility scoring report  

---
### Frontend (React + Tailwind CSS)

- **Interactive Dashboard**  
  Clean UI for entering GitHub usernames and pasting job descriptions.

- **Visual Analytics (Chart.js)**  
  Displays:
  - Match scores  
  - Language distribution  
  - Repo activity summaries  

- **Real-Time Analysis**  
  Instant feedback as candidate and job info is processed.

- **Fully Responsive**  
  Optimized for desktop and mobile viewing.

---

## Tech Stack

- **Backend**: Python 3.11, FastAPI, spaCy, Pandas, Requests
- **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts, Axios
- **Deployment**: Docker, Docker Compose, Railway, Vercel
- **APIs**: GitHub REST API

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/anvita-kallam/CommitFit.git
cd CommitFit
```

2. Backend setup:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

3. Frontend setup:
```bash
cd frontend
npm install
```

### Running Locally

Backend:
```bash
cd backend
uvicorn main:app --reload
```

Frontend:
```bash
cd frontend
npm start
```

The app will be available at `http://localhost:3000` and the API at `http://localhost:8000`.

### Using Docker

```bash
docker-compose up --build
```

This will start both the backend and frontend services.

## API Endpoints

- `GET /` - API status and available endpoints
- `GET /health` - Health check endpoint
- `POST /analyze_candidate` - Analyze a GitHub user's repositories
- `POST /analyze_job` - Extract skills from a job description
- `GET /match_report` - Get match report between candidate and job

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
