import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import {
  ArrowLeft,
  Github,
  Star,
  GitBranch,
  Users,
  MapPin,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Code,
  Activity,
} from 'lucide-react';

interface GitHubAnalysisProps {
  analysis: any;
  onReset: () => void;
}

export function GitHubAnalysis({ analysis, onReset }: GitHubAnalysisProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onReset} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        New Analysis
      </Button>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <img
            src={analysis.profileData.avatar}
            alt={analysis.profileData.name}
            className="w-24 h-24 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2>{analysis.profileData.name}</h2>
              <Badge variant="outline">@{analysis.username}</Badge>
            </div>
            <p className="text-slate-600 mb-4">{analysis.profileData.bio}</p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {analysis.profileData.location}
              </div>
              <div className="flex items-center gap-1">
                <Code className="w-4 h-4" />
                {analysis.profileData.publicRepos} repositories
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {analysis.profileData.followers} followers
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className={`text-5xl mb-2 ${getScoreColor(analysis.similarityScore)}`}>
              {analysis.similarityScore}%
            </div>
            <Badge variant={getScoreBadgeVariant(analysis.similarityScore)}>
              Match Score
            </Badge>
          </div>
        </div>
      </Card>

      {/* Language Match */}
      <Card className="p-6">
        <h3 className="mb-4 flex items-center gap-2">
          <Code className="w-5 h-5" />
          Technology Stack Match
        </h3>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600">Match Percentage</span>
            <span className={getScoreColor(analysis.languageMatch.matchPercentage)}>
              {analysis.languageMatch.matchPercentage}%
            </span>
          </div>
          <Progress value={analysis.languageMatch.matchPercentage} className="h-2" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600 mb-2">Required Technologies:</p>
            <div className="flex flex-wrap gap-2">
              {analysis.languageMatch.required.map((lang: string) => (
                <Badge
                  key={lang}
                  variant={analysis.languageMatch.found.includes(lang) ? 'default' : 'outline'}
                >
                  {lang}
                  {analysis.languageMatch.found.includes(lang) && (
                    <CheckCircle className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-2">Additional Technologies:</p>
            <div className="flex flex-wrap gap-2">
              {analysis.languageMatch.found
                .filter((lang: string) => !analysis.languageMatch.required.includes(lang))
                .map((lang: string) => (
                  <Badge key={lang} variant="secondary">
                    {lang}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Commit Activity */}
      <Card className="p-6">
        <h3 className="mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Commit Activity
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl text-slate-900 mb-1">
              {analysis.commitActivity.totalCommits.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">Total Commits</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl text-slate-900 mb-1">
              {analysis.commitActivity.lastMonthCommits}
            </div>
            <div className="text-sm text-slate-600">Last 30 Days</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl text-slate-900 mb-1">
              {analysis.commitActivity.averagePerWeek}
            </div>
            <div className="text-sm text-slate-600">Avg. per Week</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl text-green-600 mb-1">
              {analysis.commitActivity.consistency}%
            </div>
            <div className="text-sm text-slate-600">Consistency</div>
          </div>
        </div>
      </Card>

      {/* Top Repositories */}
      <Card className="p-6">
        <h3 className="mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Top Repositories
        </h3>
        <div className="space-y-4">
          {analysis.topRepositories.map((repo: any, index: number) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
              <Github className="w-5 h-5 text-slate-600 mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-900">{repo.name}</span>
                  <Badge variant="outline">{repo.language}</Badge>
                </div>
                <p className="text-sm text-slate-600">{repo.description}</p>
              </div>
              <div className="flex items-center gap-1 text-slate-600">
                <Star className="w-4 h-4" />
                <span className="text-sm">{repo.stars}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Skills Breakdown */}
      <Card className="p-6">
        <h3 className="mb-4">Skills Detected</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(analysis.skills).map(([category, skills]: [string, any]) => (
            <div key={category}>
              <p className="text-sm text-slate-600 mb-2 capitalize">{category}:</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Strengths & Concerns */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-4 flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {analysis.strengths.map((strength: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-slate-700">
                <TrendingUp className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 flex items-center gap-2 text-yellow-700">
            <AlertCircle className="w-5 h-5" />
            Areas to Explore
          </h3>
          <ul className="space-y-2">
            {analysis.concerns.map((concern: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-slate-700">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                <span className="text-sm">{concern}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
