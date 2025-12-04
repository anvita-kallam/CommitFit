# 🚀 CommitFit  
**Intelligent Candidate–Job Matching from GitHub Activity**  
https://commit-fit.vercel.app/

CommitFit is a full-stack application that analyzes GitHub profiles and matches them with job requirements to help recruiters and hiring managers quickly identify strong technical candidates. By combining GitHub repository analysis with NLP-driven job description parsing, CommitFit delivers data-backed skill matching through an intuitive, modern interface.

---

## 📌 Features

### 🔧 Backend (Python + FastAPI)

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
### 🎨 Frontend (React + Tailwind CSS)

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
- **Frontend**: React 18, Tailwind CSS, Chart.js, Axios
- **Deployment**: Docker, Docker Compose
- **APIs**: GitHub REST API
