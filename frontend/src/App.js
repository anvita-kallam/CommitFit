import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [githubUsername, setGithubUsername] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [candidateLoading, setCandidateLoading] = useState(false);
  const [jobLoading, setJobLoading] = useState(false);
  const [matchReport, setMatchReport] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // Sample data for quick start
  const sampleJobDescriptions = [
    "We are looking for a Senior Python Developer with experience in Django, FastAPI, and PostgreSQL. Must have knowledge of Docker, AWS, and CI/CD pipelines. Experience with React and JavaScript is a plus.",
    "Seeking a Full-Stack JavaScript Developer proficient in Node.js, Express, React, and MongoDB. Knowledge of TypeScript, GraphQL, and cloud platforms (AWS/Azure) required.",
    "Looking for a Machine Learning Engineer with Python, TensorFlow, PyTorch, and scikit-learn experience. Must have experience with data processing using Pandas and NumPy."
  ];

  const popularGitHubUsers = [
    "torvalds", "octocat", "gaearon", "sindresorhus", "addyosmani"
  ];

  const analyzeCandidate = async () => {
    if (!githubUsername.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    // Basic validation for GitHub username format
    const usernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
    if (!usernameRegex.test(githubUsername.trim())) {
      setError('Please enter a valid GitHub username (alphanumeric characters, hyphens, max 39 characters)');
      return;
    }

    setCandidateLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze_candidate`, {
        github_username: githubUsername.trim()
      });
      console.log('Candidate analysis:', response.data);
      setSuccess(`✅ Successfully analyzed ${githubUsername}'s GitHub profile! Found ${response.data.candidate_skills?.length || 0} skills.`);
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`GitHub user '${githubUsername}' not found. Please check the username and try again.`);
      } else if (err.response?.status === 403 || err.response?.status === 429) {
        setError('GitHub API rate limit exceeded. Please try again in a few minutes. For higher limits, consider using GitHub authentication.');
      } else if (err.code === 'NETWORK_ERROR' || !navigator.onLine) {
        setError('Network error. Please check your internet connection and try again.');
        setRetryCount(prev => prev + 1);
      } else {
        setError(`Error analyzing candidate: ${err.response?.data?.detail || err.message}`);
      }
    } finally {
      setCandidateLoading(false);
    }
  };

  const analyzeJob = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    // Basic validation for job description length
    if (jobDescription.trim().length < 10) {
      setError('Job description should be at least 10 characters long');
      return;
    }

    if (jobDescription.trim().length > 5000) {
      setError('Job description is too long. Please keep it under 5000 characters');
      return;
    }

    setJobLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze_job`, {
        job_description: jobDescription.trim()
      });
      console.log('Job analysis:', response.data);
      setSuccess(`✅ Successfully analyzed job description! Found ${response.data.job_skills?.length || 0} required skills.`);
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Invalid job description format. Please check your input and try again.');
      } else if (err.response?.status === 500) {
        setError('Server error while processing job description. Please try again.');
      } else {
        setError(`Error analyzing job: ${err.response?.data?.detail || err.message}`);
      }
    } finally {
      setJobLoading(false);
    }
  };

  const getMatchReport = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_BASE_URL}/match_report`);
      setMatchReport(response.data);
    } catch (err) {
      setError(`Error getting match report: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeBoth = async () => {
    if (!githubUsername.trim() || !jobDescription.trim()) {
      setError('Please enter both GitHub username and job description');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Analyze candidate
      await axios.post(`${API_BASE_URL}/analyze_candidate`, {
        github_username: githubUsername
      });
      
      // Analyze job
      await axios.post(`${API_BASE_URL}/analyze_job`, {
        job_description: jobDescription
      });
      
      // Get match report
      const response = await axios.get(`${API_BASE_URL}/match_report`);
      setMatchReport(response.data);
    } catch (err) {
      setError(`Error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const loadSampleJob = useCallback((index) => {
    setJobDescription(sampleJobDescriptions[index]);
    setError('');
    setSuccess('');
  }, []);

  const loadSampleUser = useCallback((username) => {
    setGithubUsername(username);
    setError('');
    setSuccess('');
  }, []);

  const clearAll = useCallback(() => {
    setGithubUsername('');
    setJobDescription('');
    setMatchReport(null);
    setError('');
    setSuccess('');
  }, []);

  const exportReport = useCallback(() => {
    if (!matchReport) return;

    const reportData = {
      timestamp: new Date().toISOString(),
      github_username: githubUsername,
      job_description: jobDescription,
      match_score: matchReport.match_score,
      matching_skills: matchReport.matching_skills,
      missing_skills: matchReport.missing_skills,
      candidate_skills: matchReport.candidate_skills,
      job_skills: matchReport.job_skills,
      repo_insights: matchReport.repo_insights
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `match-report-${githubUsername}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [matchReport, githubUsername, jobDescription]);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSuccess('Copied to clipboard!');
      setTimeout(() => setSuccess(''), 2000);
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ctrl/Cmd + Enter to analyze both
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (githubUsername.trim() && jobDescription.trim()) {
          handleAnalyzeBoth();
        }
      }
      // Escape to clear all
      if (event.key === 'Escape') {
        clearAll();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [githubUsername, jobDescription]);

  // Memoized chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => {
    if (!matchReport?.repo_insights?.languages) return null;
    
    const languages = matchReport.repo_insights.languages;
    const labels = Object.keys(languages);
    const data = Object.values(languages);
    
    return {
      doughnut: {
        labels,
        datasets: [{
          data,
          backgroundColor: [
            '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
            '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
          ],
        }],
      },
      bar: {
        labels: labels.slice(0, 5),
        datasets: [{
          label: 'Bytes of Code',
          data: data.slice(0, 5),
          backgroundColor: '#3B82F6',
        }],
      }
    };
  }, [matchReport?.repo_insights?.languages]);

  // Dark mode toggle
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            CommitFit
          </h1>
          <p className={`mb-4 text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Analyze GitHub profiles and match them with job requirements
          </p>
          <div className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            💡 <strong>Keyboard shortcuts:</strong> Ctrl/Cmd + Enter to analyze both • Escape to clear all
          </div>
          
          {/* Quick Start Section */}
          <div className={`rounded-lg p-3 md:p-4 mb-6 ${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
            <h3 className={`text-base md:text-lg font-semibold mb-3 ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>🚀 Quick Start</h3>
            <div className="flex flex-wrap gap-1 md:gap-2 justify-center">
              <span className="text-xs md:text-sm text-blue-700 font-medium">Try these popular users:</span>
              {popularGitHubUsers.map((user) => (
                <button
                  key={user}
                  onClick={() => loadSampleUser(user)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm transition-colors"
                >
                  @{user}
                </button>
              ))}
            </div>
            <div className="mt-2 md:mt-3">
              <span className="text-xs md:text-sm text-blue-700 font-medium">Or sample job descriptions:</span>
              <div className="flex flex-wrap gap-1 md:gap-2 justify-center mt-1 md:mt-2">
                <button
                  onClick={() => loadSampleJob(0)}
                  className="bg-green-100 hover:bg-green-200 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm transition-colors"
                >
                  Python Dev
                </button>
                <button
                  onClick={() => loadSampleJob(1)}
                  className="bg-green-100 hover:bg-green-200 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm transition-colors"
                >
                  JS Dev
                </button>
                <button
                  onClick={() => loadSampleJob(2)}
                  className="bg-green-100 hover:bg-green-200 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm transition-colors"
                >
                  ML Engineer
                </button>
              </div>
            </div>
            <button
              onClick={clearAll}
              className="mt-2 md:mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 md:px-4 py-1 rounded-full text-xs md:text-sm transition-colors"
            >
              Clear All
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              {error.includes('Network error') && retryCount > 0 && (
                <button
                  onClick={() => {
                    setError('');
                    setRetryCount(0);
                    if (githubUsername.trim() && jobDescription.trim()) {
                      handleAnalyzeBoth();
                    }
                  }}
                  className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* GitHub Analysis */}
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-gray-100 p-2 rounded-lg mr-3">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                GitHub Profile Analysis
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter GitHub username"
                  aria-label="GitHub username"
                  autoComplete="username"
                />
              </div>
              <button
                onClick={analyzeCandidate}
                disabled={candidateLoading || jobLoading || loading}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
                aria-label="Analyze GitHub profile"
              >
                {candidateLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  'Analyze GitHub Profile'
                )}
              </button>
            </div>
          </div>

          {/* Job Description Analysis */}
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-gray-100 p-2 rounded-lg mr-3">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Job Description Analysis
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Paste job description here..."
                  maxLength={5000}
                  aria-label="Job description"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Minimum 10 characters</span>
                  <span className={jobDescription.length > 5000 ? 'text-red-500' : ''}>
                    {jobDescription.length}/5000
                  </span>
                </div>
              </div>
              <button
                onClick={analyzeJob}
                disabled={candidateLoading || jobLoading || loading}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
                aria-label="Analyze job description"
              >
                {jobLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  'Analyze Job Description'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Analyze Both Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleAnalyzeBoth}
            disabled={loading}
            className="bg-green-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Analyze & Match Both'}
          </button>
        </div>

        {/* Match Report */}
        {matchReport && (
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Match Report
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={exportReport}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="hidden sm:inline">Export JSON</span>
                  <span className="sm:hidden">Export</span>
                </button>
                <button
                  onClick={() => copyToClipboard(`Match Score: ${matchReport.match_score.toFixed(1)}%\nMatching Skills: ${matchReport.matching_skills.join(', ')}\nMissing Skills: ${matchReport.missing_skills.join(', ')}`)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">Copy Summary</span>
                  <span className="sm:hidden">Copy</span>
                </button>
              </div>
            </div>
            
            {/* Match Score */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-700">Match Score</h3>
                <span className={`text-2xl font-bold ${getMatchScoreColor(matchReport.match_score)}`}>
                  {matchReport.match_score.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${getMatchScoreBgColor(matchReport.match_score)}`}
                  style={{ width: `${Math.min(matchReport.match_score, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Matching Skills */}
              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-4">
                  Matching Skills ({matchReport.matching_skills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {matchReport.matching_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="skill-badge bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-4">
                  Missing Skills ({matchReport.missing_skills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {matchReport.missing_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="skill-badge bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Repository Insights */}
            {matchReport.repo_insights && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Repository Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="text-2xl font-bold text-blue-600">
                      {matchReport.repo_insights.repo_count}
                    </div>
                    <div className="text-sm text-blue-800">Repositories</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg hover:bg-yellow-100 transition-colors">
                    <div className="text-2xl font-bold text-yellow-600">
                      {matchReport.repo_insights.total_stars}
                    </div>
                    <div className="text-sm text-yellow-800">Total Stars</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors">
                    <div className="text-2xl font-bold text-purple-600">
                      {matchReport.repo_insights.total_forks}
                    </div>
                    <div className="text-sm text-purple-800">Total Forks</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(matchReport.repo_insights.total_size / 1024)} MB
                    </div>
                    <div className="text-sm text-green-800">Total Size</div>
                  </div>
                </div>

                {/* Language Distribution Chart */}
                {matchReport.repo_insights.languages && Object.keys(matchReport.repo_insights.languages).length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-semibold text-gray-700 mb-3">
                        Language Distribution
                      </h4>
                      <Doughnut
                        data={chartData.doughnut}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'bottom',
                            },
                          },
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-gray-700 mb-3">
                        Top Languages (Bytes)
                      </h4>
                      <Bar
                        data={chartData.bar}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
