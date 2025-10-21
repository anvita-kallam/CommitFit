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

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CommitFit
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```

4. **Run the backend**
   ```bash
   uvicorn main:app --reload
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## API Endpoints

### POST /analyze_candidate
Analyze a GitHub user's repositories and extract skills.

**Request Body:**
```json
{
  "github_username": "octocat"
}
```

**Response:**
```json
{
  "status": "success",
  "candidate_skills": ["Python", "JavaScript", "React"],
  "repo_insights": {
    "languages": {"Python": 50000, "JavaScript": 30000},
    "total_stars": 150,
    "total_forks": 25,
    "repo_count": 10
  }
}
```

### POST /analyze_job
Extract required skills from a job description.

**Request Body:**
```json
{
  "job_description": "We are looking for a Python developer with React experience..."
}
```

**Response:**
```json
{
  "status": "success",
  "job_skills": ["Python", "React", "JavaScript", "Django"]
}
```

### GET /match_report
Get a comprehensive match report between candidate and job.

**Response:**
```json
{
  "match_score": 75.5,
  "matching_skills": ["Python", "React"],
  "missing_skills": ["Django", "PostgreSQL"],
  "candidate_skills": ["Python", "React", "JavaScript"],
  "job_skills": ["Python", "React", "Django", "PostgreSQL"],
  "repo_insights": {
    "languages": {"Python": 50000, "JavaScript": 30000},
    "total_stars": 150,
    "total_forks": 25,
    "repo_count": 10
  }
}
```

## Usage

1. **Enter GitHub Username**: Input a GitHub username to analyze their public repositories
2. **Paste Job Description**: Add a job description to extract required skills
3. **Analyze & Match**: Click the "Analyze & Match Both" button to get a comprehensive report
4. **Review Results**: View match score, matching/missing skills, and repository insights

## Features in Detail

### GitHub Analysis
- Fetches all public repositories for a given username
- Analyzes programming languages used across repositories
- Calculates repository statistics (stars, forks, size)
- Extracts skills from repository names and descriptions

### Job Description Parsing
- Uses spaCy NLP model to extract technical skills
- Identifies programming languages, frameworks, and tools
- Handles various formats of job descriptions

### Matching Algorithm
- Compares candidate skills with job requirements
- Calculates percentage match score
- Identifies matching and missing skills
- Provides detailed insights for decision making

### Visual Dashboard
- Interactive forms for input
- Real-time progress indicators
- Chart visualizations for repository insights
- Color-coded match scores and skill categories

## Project Structure

```
CommitFit/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile          # Backend container config
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Tailwind CSS styles
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── package.json        # Node.js dependencies
│   ├── tailwind.config.js  # Tailwind configuration
│   └── Dockerfile          # Frontend container config
├── docker-compose.yml      # Multi-container setup
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Development

### Adding New Skills
To add new technical skills to the matching algorithm, update the `tech_keywords` list in the `extract_skills_from_text` function in `backend/main.py`.

### Customizing the UI
The frontend uses Tailwind CSS for styling. Modify `frontend/tailwind.config.js` to customize the design system.

### API Rate Limits
The application uses the GitHub REST API without authentication, which has rate limits. For production use, consider implementing GitHub API authentication.

## Troubleshooting

### Common Issues

1. **spaCy model not found**
   ```bash
   python -m spacy download en_core_web_sm
   ```

2. **CORS errors**
   - Ensure the backend is running on port 8000
   - Check that the frontend is configured to connect to the correct API URL

3. **GitHub API errors**
   - Verify the GitHub username exists and has public repositories
   - Check your internet connection

4. **Docker build failures**
   - Ensure Docker and Docker Compose are properly installed
   - Try rebuilding with `docker-compose up --build --force-recreate`

## Future Enhancements

- [ ] GitHub API authentication for higher rate limits
- [ ] User authentication and session management
- [ ] Database storage for analysis history
- [ ] Advanced matching algorithms (fuzzy matching, skill weights)
- [ ] Export functionality for match reports
- [ ] Integration with job boards and ATS systems
- [ ] Machine learning-based skill extraction
- [ ] Team collaboration features

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For questions or issues, please open an issue in the GitHub repository.
