import React, { useState } from 'react';
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
  const [matchReport, setMatchReport] = useState(null);
  const [error, setError] = useState('');

  const analyzeCandidate = async () => {
    if (!githubUsername.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze_candidate`, {
        github_username: githubUsername
      });
      console.log('Candidate analysis:', response.data);
    } catch (err) {
      setError(`Error analyzing candidate: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const analyzeJob = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze_job`, {
        job_description: jobDescription
      });
      console.log('Job analysis:', response.data);
    } catch (err) {
      setError(`Error analyzing job: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            GitHub Candidate Match MVP
          </h1>
          <p className="text-gray-600">
            Analyze GitHub profiles and match them with job requirements
          </p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* GitHub Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              GitHub Profile Analysis
            </h2>
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
                />
              </div>
              <button
                onClick={analyzeCandidate}
                disabled={loading}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze GitHub Profile'}
              </button>
            </div>
          </div>

          {/* Job Description Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Job Description Analysis
            </h2>
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
                />
              </div>
              <button
                onClick={analyzeJob}
                disabled={loading}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze Job Description'}
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Match Report
            </h2>
            
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
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
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
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {matchReport.repo_insights.repo_count}
                    </div>
                    <div className="text-sm text-blue-800">Repositories</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {matchReport.repo_insights.total_stars}
                    </div>
                    <div className="text-sm text-yellow-800">Total Stars</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {matchReport.repo_insights.total_forks}
                    </div>
                    <div className="text-sm text-purple-800">Total Forks</div>
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
                        data={{
                          labels: Object.keys(matchReport.repo_insights.languages),
                          datasets: [
                            {
                              data: Object.values(matchReport.repo_insights.languages),
                              backgroundColor: [
                                '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
                                '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
                              ],
                            },
                          ],
                        }}
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
                        data={{
                          labels: Object.keys(matchReport.repo_insights.languages).slice(0, 5),
                          datasets: [
                            {
                              label: 'Bytes of Code',
                              data: Object.values(matchReport.repo_insights.languages).slice(0, 5),
                              backgroundColor: '#3B82F6',
                            },
                          ],
                        }}
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
