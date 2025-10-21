# CommitFit

A full-stack application that analyzes GitHub profiles and matches them with job requirements to help recruiters find the best candidates.

## Features

### Backend (Python + FastAPI)
- **GitHub Repo Analysis**: Fetches public repositories and extracts programming languages, frameworks, and commit history
- **Job Description Parsing**: Uses spaCy NLP to extract key technologies and skills from job descriptions
- **Matching Engine**: Compares candidate skills with job requirements and computes match scores
- **REST API**: Provides endpoints for candidate analysis, job parsing, and match reporting

### Frontend (React + Tailwind CSS)
- **Interactive Dashboard**: Clean, modern UI for inputting GitHub usernames and job descriptions
- **Visual Analytics**: Chart.js integration for displaying match scores and repository insights
- **Real-time Analysis**: Live updates as you analyze candidates and jobs
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Backend**: Python 3.11, FastAPI, spaCy, Pandas, Requests
- **Frontend**: React 18, Tailwind CSS, Chart.js, Axios
- **Deployment**: Docker, Docker Compose
- **APIs**: GitHub REST API
