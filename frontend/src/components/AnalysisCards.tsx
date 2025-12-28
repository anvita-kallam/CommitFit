import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Github, FileText, Loader2 } from 'lucide-react';

interface AnalysisCardsProps {
  username: string;
  setUsername: (value: string) => void;
  accessToken: string;
  setAccessToken: (value: string) => void;
  jobDescription: string;
  setJobDescription: (value: string) => void;
  onAnalyzeBoth: () => void;
  isAnalyzing: boolean;
}

/**
 * AnalysisCards component for inputting GitHub username and job description
 * Provides a clean interface for users to enter analysis parameters
 */
export function AnalysisCards({
  username,
  setUsername,
  accessToken,
  setAccessToken,
  jobDescription,
  setJobDescription,
  onAnalyzeBoth,
  isAnalyzing,
}: AnalysisCardsProps) {
  return (
    <div className="mb-6">
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* GitHub Profile Analysis Card */}
        <Card 
          className="p-6 shadow-xl border backdrop-blur-lg" 
          style={{ 
            background: 'rgba(255, 255, 255, 0.4)',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Github className="w-5 h-5" style={{ color: 'rgba(0, 31, 63, 1)' }} />
            <h3 className="font-semibold" style={{ color: 'rgba(0, 31, 63, 1)' }}>
              GitHub Profile Analysis
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="github-username" style={{ color: 'rgba(0, 31, 63, 1)' }}>
                GitHub Username
              </Label>
              <Input
                id="github-username"
                type="text"
                placeholder=""
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isAnalyzing}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="access-token" style={{ color: 'rgba(0, 31, 63, 1)' }}>
                GitHub Personal Access Token (Optional)
              </Label>
              <Input
                id="access-token"
                type="password"
                placeholder=""
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                disabled={isAnalyzing}
                className="mt-1"
              />
              <p className="text-xs mt-1" style={{ color: 'rgba(0, 71, 142, 0.85)' }}>
                Get your token from GitHub Settings → Developer settings → Personal access tokens
              </p>
            </div>

            <Button
              className="w-full backdrop-blur-md border border-white/40 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              style={{ 
                background: 'rgba(255, 255, 255, 0.5)',
                color: 'rgba(0, 31, 63, 1)' 
              }}
              disabled={isAnalyzing || !username}
              onClick={onAnalyzeBoth}
            >
              Analyze GitHub Profile
            </Button>
          </div>
        </Card>

        {/* Job Description Analysis Card */}
        <Card 
          className="p-6 shadow-xl border backdrop-blur-lg" 
          style={{ 
            background: 'rgba(255, 255, 255, 0.4)',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5" style={{ color: 'rgba(0, 31, 63, 1)' }} />
            <h3 style={{ color: 'rgba(0, 31, 63, 1)' }}>Job Description Analysis</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="job-description" style={{ color: 'rgba(0, 31, 63, 1)' }}>
                Job Description
              </Label>
              <Textarea
                id="job-description"
                placeholder=""
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isAnalyzing}
                rows={8}
                className="mt-1 resize-none"
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs" style={{ color: 'rgba(0, 71, 142, 0.85)' }}>Minimum 10 characters</p>
                <p className="text-xs" style={{ color: 'rgba(0, 71, 142, 0.85)' }}>{jobDescription.length}/4000</p>
              </div>
            </div>

            <Button
              className="w-full backdrop-blur-md border border-white/40 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              style={{ 
                background: 'rgba(255, 255, 255, 0.5)',
                color: 'rgba(0, 31, 63, 1)' 
              }}
              disabled={isAnalyzing || jobDescription.length < 10}
              onClick={onAnalyzeBoth}
            >
              Analyze Job Description
            </Button>
          </div>
        </Card>
      </div>

      {/* Analyze & Match Both Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          className="px-8 backdrop-blur-lg border border-white/40 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          style={{ 
            background: 'rgba(255, 255, 255, 0.6)',
            color: 'rgba(0, 31, 63, 1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.15)',
          }}
          disabled={isAnalyzing || !username || jobDescription.length < 10}
          onClick={onAnalyzeBoth}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze & Match Both'
          )}
        </Button>
      </div>
    </div>
  );
}
