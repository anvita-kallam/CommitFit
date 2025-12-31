import { useState, useEffect } from 'react';
import { QuickStart } from './components/QuickStart';
import { AnalysisCards } from './components/AnalysisCards';
import { MatchReport } from './components/MatchReport';
import { Alert, AlertDescription } from './components/ui/alert';
import { CheckCircle } from 'lucide-react';
import backgroundImage from 'figma:asset/73b22bd79173a4bc73716edf4c59d61892b4ebae.png';

export default function App() {
  const [username, setUsername] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (username && jobDescription) {
          handleAnalyzeBoth();
        }
      } else if (e.key === 'Escape') {
        handleClearAll();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [username, jobDescription]);

  const handleAnalyzeBoth = async () => {
    setIsAnalyzing(true);
    setShowSuccess(false);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalysis = {
      username,
      profileData: {
        name: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
        bio: 'Full-stack developer passionate about open source',
        publicRepos: 42,
        followers: 156,
        following: 89,
        location: 'San Francisco, CA',
      },
      similarityScore: Math.floor(Math.random() * 40) + 60,
      languageMatch: {
        required: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
        found: ['JavaScript', 'TypeScript', 'React', 'Python', 'Go'],
        matchPercentage: 75,
      },
      commitActivity: {
        totalCommits: 1247,
        lastMonthCommits: 89,
        averagePerWeek: 24,
        consistency: 92,
      },
      topRepositories: [
        { name: 'react-dashboard', stars: 234, language: 'TypeScript', description: 'Modern admin dashboard built with React and TypeScript' },
        { name: 'api-gateway', stars: 156, language: 'Node.js', description: 'Scalable API gateway with rate limiting' },
        { name: 'ml-toolkit', stars: 89, language: 'Python', description: 'Machine learning utilities and helpers' },
      ],
      skills: {
        frontend: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
        backend: ['Node.js', 'Express', 'PostgreSQL', 'REST APIs'],
        devops: ['Docker', 'CI/CD', 'AWS'],
        other: ['Git', 'Agile', 'Testing'],
      },
      strengths: [
        'Strong match with required tech stack',
        'Consistent commit history showing active development',
        'Experience with modern JavaScript frameworks',
        'Active open source contributor',
      ],
      concerns: [
        'Limited experience with some listed DevOps tools',
        'Could benefit from more enterprise-scale projects',
      ],
      jobDescription,
    };
    
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    setShowSuccess(true);
  };

  const handleClearAll = () => {
    setUsername('');
    setAccessToken('');
    setJobDescription('');
    setAnalysis(null);
    setShowSuccess(false);
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 shadow-lg"
              style={{ 
                background: 'rgba(255, 255, 255, 0.4)',
              }}
            >
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="rgba(0, 31, 63, 0.9)">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <h1 style={{ color: 'rgba(0, 31, 63, 1)' }}>CommitFit</h1>
          </div>
          <p className="mb-2" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>
            Analyze GitHub profiles and match them with job requirements
          </p>
          <p className="text-sm" style={{ color: 'rgba(0, 71, 142, 0.85)' }}>
            ⌨️ Keyboard shortcuts: Ctrl/Cmd + Enter to analyze both • Escape to clear all
          </p>
        </header>

        {/* Quick Start */}
        <QuickStart
          onSelectUsername={setUsername}
          onSelectJobDescription={setJobDescription}
          onClearAll={handleClearAll}
        />

        {/* Success Banner */}
        {showSuccess && analysis && (
          <Alert 
            className="mb-6 border backdrop-blur-lg shadow-lg" 
            style={{ 
              background: 'rgba(255, 255, 255, 0.5)',
              borderColor: 'rgba(70, 130, 180, 0.5)'
            }}
          >
            <CheckCircle className="h-4 w-4" style={{ color: 'rgba(0, 31, 63, 1)' }} />
            <AlertDescription style={{ color: 'rgba(0, 31, 63, 1)' }}>
              Match analysis complete! Match score: {analysis.similarityScore}%
            </AlertDescription>
          </Alert>
        )}

        {/* Analysis Cards */}
        <AnalysisCards
          username={username}
          setUsername={setUsername}
          accessToken={accessToken}
          setAccessToken={setAccessToken}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          onAnalyzeBoth={handleAnalyzeBoth}
          isAnalyzing={isAnalyzing}
        />

        {/* Match Report */}
        {analysis && (
          <MatchReport analysis={analysis} onReset={handleClearAll} />
        )}
      </div>
    </div>
  );
}
