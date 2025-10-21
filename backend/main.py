from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import requests
import pandas as pd
import re
import spacy
from collections import Counter
import json

app = FastAPI(title="CommitFit API", version="1.0.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load spaCy model for NLP
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Please install spaCy model: python -m spacy download en_core_web_sm")
    nlp = None

# Pydantic models
class GitHubAnalysisRequest(BaseModel):
    github_username: str
    github_token: Optional[str] = None

class JobAnalysisRequest(BaseModel):
    job_description: str

class MatchReport(BaseModel):
    match_score: float
    matching_skills: List[str]
    missing_skills: List[str]
    candidate_skills: List[str]
    job_skills: List[str]
    repo_insights: Dict

# GitHub API functions
def fetch_user_repos(username: str, github_token: Optional[str] = None) -> List[Dict]:
    """Fetch public repositories for a GitHub user"""
    url = f"https://api.github.com/users/{username}/repos"
    headers = {"Accept": "application/vnd.github.v3+json"}
    
    # Add authentication if token is provided
    if github_token:
        headers["Authorization"] = f"token {github_token}"
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 403:
            error_data = response.json()
            if "rate limit" in error_data.get("message", "").lower():
                raise HTTPException(
                    status_code=429, 
                    detail="GitHub API rate limit exceeded. Please try again in a few minutes or use GitHub authentication for higher limits."
                )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"GitHub API error: {str(e)}")

def analyze_repo_languages(repos: List[Dict], github_token: Optional[str] = None) -> Dict:
    """Analyze programming languages from repositories"""
    language_stats = Counter()
    total_stars = 0
    total_forks = 0
    total_size = 0
    
    headers = {}
    if github_token:
        headers["Authorization"] = f"token {github_token}"
    
    for repo in repos:
        # Get language data for each repo
        if repo.get('languages_url'):
            try:
                lang_response = requests.get(repo['languages_url'], headers=headers)
                if lang_response.status_code == 200:
                    repo_languages = lang_response.json()
                    for lang, bytes_count in repo_languages.items():
                        language_stats[lang] += bytes_count
            except:
                continue
        
        total_stars += repo.get('stargazers_count', 0)
        total_forks += repo.get('forks_count', 0)
        total_size += repo.get('size', 0)
    
    return {
        'languages': dict(language_stats.most_common(10)),
        'total_stars': total_stars,
        'total_forks': total_forks,
        'total_size': total_size,
        'repo_count': len(repos)
    }

def extract_skills_from_text(text: str) -> List[str]:
    """Extract technical skills from job description using spaCy"""
    if not nlp:
        # Fallback to simple regex if spaCy not available
        tech_keywords = [
            'python', 'javascript', 'java', 'react', 'angular', 'vue', 'node.js',
            'django', 'flask', 'fastapi', 'spring', 'express', 'mongodb', 'postgresql',
            'mysql', 'redis', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
            'git', 'github', 'gitlab', 'jenkins', 'ci/cd', 'rest api', 'graphql',
            'microservices', 'agile', 'scrum', 'tensorflow', 'pytorch', 'pandas',
            'numpy', 'scikit-learn', 'machine learning', 'ai', 'data science'
        ]
        
        found_skills = []
        text_lower = text.lower()
        for keyword in tech_keywords:
            if keyword in text_lower:
                found_skills.append(keyword)
        return found_skills
    
    doc = nlp(text.lower())
    tech_keywords = [
        'python', 'javascript', 'java', 'react', 'angular', 'vue', 'node.js',
        'django', 'flask', 'fastapi', 'spring', 'express', 'mongodb', 'postgresql',
        'mysql', 'redis', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
        'git', 'github', 'gitlab', 'jenkins', 'ci/cd', 'rest api', 'graphql',
        'microservices', 'agile', 'scrum', 'tensorflow', 'pytorch', 'pandas',
        'numpy', 'scikit-learn', 'machine learning', 'ai', 'data science'
    ]
    
    found_skills = []
    for token in doc:
        if token.text in tech_keywords or any(keyword in token.text for keyword in tech_keywords):
            found_skills.append(token.text)
    
    return list(set(found_skills))

def calculate_match_score(candidate_skills: List[str], job_skills: List[str]) -> float:
    """Calculate match score between candidate and job skills"""
    if not job_skills:
        return 0.0
    
    candidate_skills_lower = [skill.lower() for skill in candidate_skills]
    job_skills_lower = [skill.lower() for skill in job_skills]
    
    matching = set(candidate_skills_lower) & set(job_skills_lower)
    return len(matching) / len(job_skills_lower) * 100

# Global storage for analysis results
candidate_data = {}
job_data = {}

@app.post("/analyze_candidate")
async def analyze_candidate(request: GitHubAnalysisRequest):
    """Analyze GitHub candidate repositories"""
    try:
        repos = fetch_user_repos(request.github_username, request.github_token)
        repo_insights = analyze_repo_languages(repos, request.github_token)
        
        # Extract skills from repository languages and names
        candidate_skills = list(repo_insights['languages'].keys())
        
        # Add skills from repository names and descriptions
        for repo in repos:
            repo_text = f"{repo.get('name', '')} {repo.get('description', '')}"
            additional_skills = extract_skills_from_text(repo_text)
            candidate_skills.extend(additional_skills)
        
        candidate_skills = list(set(candidate_skills))
        
        candidate_data[request.github_username] = {
            'skills': candidate_skills,
            'repo_insights': repo_insights
        }
        
        return {
            "status": "success",
            "candidate_skills": candidate_skills,
            "repo_insights": repo_insights
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze_job")
async def analyze_job(request: JobAnalysisRequest):
    """Analyze job description and extract required skills"""
    try:
        job_skills = extract_skills_from_text(request.job_description)
        
        job_data['current_job'] = {
            'skills': job_skills,
            'description': request.job_description
        }
        
        return {
            "status": "success",
            "job_skills": job_skills
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/match_report")
async def get_match_report():
    """Get match report between candidate and job"""
    if not candidate_data or not job_data:
        raise HTTPException(status_code=400, detail="Please analyze both candidate and job first")
    
    # Get the most recent candidate and job data
    latest_candidate = list(candidate_data.values())[-1]
    current_job = job_data['current_job']
    
    candidate_skills = latest_candidate['skills']
    job_skills = current_job['skills']
    
    match_score = calculate_match_score(candidate_skills, job_skills)
    
    candidate_skills_lower = [skill.lower() for skill in candidate_skills]
    job_skills_lower = [skill.lower() for skill in job_skills]
    
    matching_skills = list(set(candidate_skills_lower) & set(job_skills_lower))
    missing_skills = list(set(job_skills_lower) - set(candidate_skills_lower))
    
    return MatchReport(
        match_score=match_score,
        matching_skills=matching_skills,
        missing_skills=missing_skills,
        candidate_skills=candidate_skills,
        job_skills=job_skills,
        repo_insights=latest_candidate['repo_insights']
    )

@app.get("/")
async def root():
    return {"message": "CommitFit API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
