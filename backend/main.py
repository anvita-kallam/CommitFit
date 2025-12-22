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
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="CommitFit API",
    version="1.0.0",
    description="API for analyzing GitHub profiles and matching them with job requirements",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for frontend communication
# Allow all origins for production deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load spaCy model for NLP
try:
    nlp = spacy.load("en_core_web_sm")
    logger.info("spaCy model loaded successfully")
except OSError:
    logger.warning("Please install spaCy model: python -m spacy download en_core_web_sm")
    nlp = None

# Pydantic models
class GitHubAnalysisRequest(BaseModel):
    github_username: str
    github_token: Optional[str] = None

class JobAnalysisRequest(BaseModel):
    job_description: str
    github_token: Optional[str] = None

class MatchReport(BaseModel):
    username: str
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
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 403:
            error_data = response.json()
            if "rate limit" in error_data.get("message", "").lower():
                raise HTTPException(
                    status_code=429, 
                    detail="GitHub API rate limit exceeded. Please try again in a few minutes or use GitHub authentication for higher limits."
                )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=408, detail="Request to GitHub API timed out. Please try again.")
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
                lang_response = requests.get(repo['languages_url'], headers=headers, timeout=10)
                if lang_response.status_code == 200:
                    repo_languages = lang_response.json()
                    for lang, bytes_count in repo_languages.items():
                        language_stats[lang] += bytes_count
            except requests.exceptions.RequestException:
                # Log but continue processing other repos
                continue
        
        total_stars += repo.get('stargazers_count', 0)
        total_forks += repo.get('forks_count', 0)
        total_size += repo.get('size', 0)
    
    # Sort languages by usage (bytes) in descending order
    sorted_languages = dict(language_stats.most_common(10))
    
    return {
        'languages': sorted_languages,
        'total_stars': total_stars,
        'total_forks': total_forks,
        'total_size': total_size,
        'repo_count': len(repos),
        'top_language': list(sorted_languages.keys())[0] if sorted_languages else None
    }

def extract_skills_from_text(text: str) -> List[str]:
    """Extract technical skills from job description using spaCy"""
    if not text or not text.strip():
        return []
    
    # Expanded tech keywords list with variations
        tech_keywords = [
        # Programming Languages
        'python', 'javascript', 'java', 'c++', 'cpp', 'cplusplus', 'c#', 'csharp',
        'typescript', 'go', 'golang', 'rust', 'swift', 'kotlin', 'scala', 'ruby',
        'php', 'r', 'matlab', 'perl', 'lua', 'dart', 'objective-c', 'objectivec',
        # Web Frameworks
        'react', 'angular', 'vue', 'vue.js', 'svelte', 'next.js', 'nextjs',
        'nuxt', 'ember', 'backbone', 'jquery',
        # Backend Frameworks
        'node.js', 'nodejs', 'express', 'django', 'flask', 'fastapi', 'spring',
        'spring boot', 'laravel', 'rails', 'ruby on rails', 'asp.net', 'aspnet',
        'nest.js', 'nestjs', 'koa', 'hapi',
        # Databases
        'mongodb', 'postgresql', 'postgres', 'mysql', 'sqlite', 'redis', 'cassandra',
        'elasticsearch', 'dynamodb', 'oracle', 'sql server', 'mariadb', 'neo4j',
        # Cloud & DevOps
        'docker', 'kubernetes', 'k8s', 'aws', 'azure', 'gcp', 'google cloud',
        'terraform', 'ansible', 'jenkins', 'github actions', 'gitlab ci',
        'ci/cd', 'cicd', 'devops',
        # Tools & Others
        'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence',
        'rest api', 'graphql', 'grpc', 'microservices', 'agile', 'scrum',
        # Data Science & ML
        'tensorflow', 'pytorch', 'keras', 'pandas', 'numpy', 'scikit-learn',
        'scikit learn', 'machine learning', 'ml', 'ai', 'artificial intelligence',
        'data science', 'deep learning', 'neural networks', 'opencv',
        # Frontend
        'html', 'css', 'sass', 'scss', 'less', 'webpack', 'babel', 'es6',
        'redux', 'mobx', 'zustand'
        ]
        
        found_skills = []
        text_lower = text.lower()
    
    # Handle special cases with regex patterns (these have special characters)
    # Pattern for c++ variations - handle + which is not a word character
    cpp_patterns = [
        r'(?<!\w)c\+\+(?!\w)',  # c++ with word boundaries (handles +)
        r'\bcpp\b',              # cpp as whole word
        r'\bcplusplus\b'         # cplusplus as whole word
    ]
    if any(re.search(pattern, text_lower, re.IGNORECASE) for pattern in cpp_patterns):
        found_skills.append('c++')
    
    # Pattern for c# variations - handle # which is not a word character
    csharp_patterns = [
        r'(?<!\w)c#(?!\w)',      # c# with word boundaries (handles #)
        r'\bcsharp\b'            # csharp as whole word
    ]
    if any(re.search(pattern, text_lower, re.IGNORECASE) for pattern in csharp_patterns):
        found_skills.append('c#')
    
    # Check for all other keywords
    for keyword in tech_keywords:
        # Skip c++ and c# as we handle them with regex above
        if keyword in ['c++', 'cpp', 'cplusplus', 'c#', 'csharp']:
            continue
            
        # Use word boundaries for better matching (case-insensitive)
        pattern = r'\b' + re.escape(keyword) + r'\b'
        if re.search(pattern, text_lower, re.IGNORECASE):
            # Normalize the keyword (use canonical form)
            if keyword in ['cpp', 'cplusplus']:
                found_skills.append('c++')
            elif keyword in ['csharp']:
                found_skills.append('c#')
            elif keyword in ['nodejs', 'node.js']:
                found_skills.append('node.js')
            elif keyword in ['nextjs', 'next.js']:
                found_skills.append('next.js')
            elif keyword in ['nestjs', 'nest.js']:
                found_skills.append('nest.js')
            elif keyword in ['vue.js', 'vue']:
                found_skills.append('vue')
            elif keyword in ['postgres', 'postgresql']:
                found_skills.append('postgresql')
            elif keyword in ['golang', 'go']:
                found_skills.append('go')
            elif keyword in ['scikit learn', 'scikit-learn']:
                found_skills.append('scikit-learn')
            else:
                found_skills.append(keyword)
    
    return list(set(found_skills))

def calculate_match_score(candidate_skills: List[str], job_skills: List[str]) -> float:
    """Calculate match score between candidate and job skills"""
    if not job_skills:
        return 0.0
    if not candidate_skills:
        return 0.0
    
    candidate_skills_lower = [skill.lower().strip() for skill in candidate_skills if skill]
    job_skills_lower = [skill.lower().strip() for skill in job_skills if skill]
    
    # Remove empty strings after stripping
    candidate_skills_lower = [s for s in candidate_skills_lower if s]
    job_skills_lower = [s for s in job_skills_lower if s]
    
    if not job_skills_lower:
        return 0.0
    
    matching = set(candidate_skills_lower) & set(job_skills_lower)
    return round(len(matching) / len(job_skills_lower) * 100, 2)

# Global storage for analysis results
# Note: In production, consider using Redis or a database for persistence
candidate_data = {}
job_data = {}

# Maximum number of candidates to keep in memory (prevent memory leaks)
MAX_CANDIDATES_IN_MEMORY = 100

@app.post("/analyze_candidate")
async def analyze_candidate(request: GitHubAnalysisRequest):
    """Analyze GitHub candidate repositories"""
    if not request.github_username or not request.github_username.strip():
        raise HTTPException(status_code=400, detail="GitHub username is required")
    
    try:
        logger.info(f"Analyzing candidate: {request.github_username}")
        repos = fetch_user_repos(request.github_username, request.github_token)
        logger.info(f"Found {len(repos)} repositories for {request.github_username}")
        repo_insights = analyze_repo_languages(repos, request.github_token)
        
        # Extract skills from repository languages and names
        candidate_skills = list(repo_insights['languages'].keys())
        
        # Add skills from repository names and descriptions
        for repo in repos:
            repo_text = f"{repo.get('name', '')} {repo.get('description', '')}"
            additional_skills = extract_skills_from_text(repo_text)
            candidate_skills.extend(additional_skills)
        
        # Remove duplicates and empty strings, normalize
        candidate_skills = [skill.strip().lower() for skill in candidate_skills if skill and skill.strip()]
        candidate_skills = list(set(candidate_skills))
        
        candidate_data[request.github_username] = {
            'skills': candidate_skills,
            'repo_insights': repo_insights
        }
        
        # Clean up old candidates if we exceed the limit (FIFO)
        if len(candidate_data) > MAX_CANDIDATES_IN_MEMORY:
            oldest_key = next(iter(candidate_data))
            del candidate_data[oldest_key]
            logger.debug(f"Removed oldest candidate {oldest_key} from memory")
        
        logger.info(f"Stored data for {request.github_username} with {len(candidate_skills)} skills")
        logger.debug(f"Current candidates in memory: {list(candidate_data.keys())}")
        
        return {
            "status": "success",
            "candidate_skills": candidate_skills,
            "repo_insights": repo_insights,
            "username": request.github_username
        }
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error analyzing {request.github_username}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/analyze_job")
async def analyze_job(request: JobAnalysisRequest):
    """Analyze job description and extract required skills"""
    if not request.job_description or not request.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description is required")
    
    try:
        job_skills = extract_skills_from_text(request.job_description)
        
        # Normalize job skills
        job_skills = [skill.strip().lower() for skill in job_skills if skill and skill.strip()]
        job_skills = list(set(job_skills))
        
        job_data['current_job'] = {
            'skills': job_skills,
            'description': request.job_description,
            'github_token': request.github_token
        }
        
        logger.info(f"Extracted {len(job_skills)} unique skills from job description")
        
        return {
            "status": "success",
            "job_skills": job_skills,
            "skill_count": len(job_skills)
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing job description: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/match_report")
async def get_match_report(username: Optional[str] = None):
    """Get match report between candidate and job"""
    logger.info(f"Match report requested for username: {username}")
    logger.debug(f"Candidates in memory: {list(candidate_data.keys())}")
    logger.debug(f"Job data exists: {bool(job_data)}")
    
    if not job_data:
        raise HTTPException(status_code=400, detail="Please analyze job description first")
    
    # Use provided username or get the most recent candidate
    if username and username in candidate_data:
        latest_candidate = candidate_data[username]
        latest_candidate_username = username
    elif candidate_data:
        # Fallback to most recent candidate
        latest_candidate_username = list(candidate_data.keys())[-1]
        latest_candidate = candidate_data[latest_candidate_username]
        logger.warning(f"Username not provided or not found, using most recent: {latest_candidate_username}")
    else:
        raise HTTPException(status_code=400, detail="Please analyze candidate first")
    
    current_job = job_data.get('current_job')
    if not current_job:
        raise HTTPException(status_code=400, detail="Job data not found. Please analyze job description again.")
    
    logger.info(f"Using candidate: {latest_candidate_username}")
    logger.debug(f"Candidate skills count: {len(latest_candidate.get('skills', []))}")
    logger.debug(f"Candidate skills: {latest_candidate.get('skills', [])[:5]}...")
    logger.debug(f"Job skills count: {len(current_job.get('skills', []))}")
    logger.debug(f"Job skills: {current_job.get('skills', [])[:5]}...")
    
    candidate_skills = latest_candidate.get('skills', [])
    job_skills = current_job.get('skills', [])
    
    if not candidate_skills:
        logger.warning(f"No candidate skills found for {latest_candidate_username}")
    if not job_skills:
        logger.warning("No job skills found")
    
    match_score = calculate_match_score(candidate_skills, job_skills)
    logger.info(f"Match score calculated: {match_score}%")
    
    # Skills are already normalized to lowercase
    candidate_skills_lower = [skill.lower().strip() for skill in candidate_skills if skill]
    job_skills_lower = [skill.lower().strip() for skill in job_skills if skill]
    
    # Remove empty strings
    candidate_skills_lower = [s for s in candidate_skills_lower if s]
    job_skills_lower = [s for s in job_skills_lower if s]
    
    matching_skills = list(set(candidate_skills_lower) & set(job_skills_lower))
    missing_skills = list(set(job_skills_lower) - set(candidate_skills_lower))
    
    # Sort for consistent output
    matching_skills.sort()
    missing_skills.sort()
    
    # Ensure all lists are properly formatted
    return MatchReport(
        username=latest_candidate_username,
        match_score=round(match_score, 2),
        matching_skills=matching_skills,
        missing_skills=missing_skills,
        candidate_skills=sorted(list(set(candidate_skills))),
        job_skills=sorted(list(set(job_skills))),
        repo_insights=latest_candidate.get('repo_insights', {})
    )

@app.get("/")
async def root():
    return {
        "message": "CommitFit API is running!",
        "version": "1.0.0",
        "endpoints": {
            "analyze_candidate": "/analyze_candidate",
            "analyze_job": "/analyze_job",
            "match_report": "/match_report"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "spacy_loaded": nlp is not None,
        "candidates_in_memory": len(candidate_data),
        "job_data_exists": bool(job_data)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
