import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Loader2, Search } from 'lucide-react';

interface AnalysisFormProps {
  onAnalyze: (username: string, jobDescription: string) => void;
  isAnalyzing: boolean;
}

export function AnalysisForm({ onAnalyze, isAnalyzing }: AnalysisFormProps) {
  const [username, setUsername] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && jobDescription.trim()) {
      onAnalyze(username, jobDescription);
    }
  };

  return (
    <Card className="p-8 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username">GitHub Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="e.g., octocat"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isAnalyzing}
            required
          />
          <p className="text-slate-500 text-sm">Enter the candidate's GitHub username</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobDescription">Job Description</Label>
          <Textarea
            id="jobDescription"
            placeholder="Paste the full job description here, including required skills, experience, and responsibilities..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={isAnalyzing}
            required
            rows={12}
            className="resize-none"
          />
          <p className="text-slate-500 text-sm">
            Include required skills, technologies, and experience
          </p>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isAnalyzing || !username.trim() || !jobDescription.trim()}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Profile...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Analyze Candidate Fit
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
