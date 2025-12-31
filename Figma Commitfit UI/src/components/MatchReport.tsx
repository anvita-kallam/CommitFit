import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  CheckCircle2,
  Download,
  Copy,
  Github,
  Star,
  GitBranch,
  Users,
  MapPin,
  TrendingUp,
  AlertCircle,
  Code,
  Activity,
  Check,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MatchReportProps {
  analysis: any;
  onReset: () => void;
}

export function MatchReport({ analysis }: MatchReportProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'rgba(70, 130, 180, 1)';
    if (score >= 60) return 'rgba(100, 149, 237, 1)';
    return 'rgba(135, 206, 250, 1)';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(analysis, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `commitfit-${analysis.username}-${Date.now()}.json`;
    link.click();
    toast.success('Report exported as JSON');
  };

  const handleCopySummary = () => {
    const summary = `
CommitFit Analysis Report
========================
Username: ${analysis.username}
Match Score: ${analysis.similarityScore}%
Profile: ${analysis.profileData.name}

Technology Match: ${analysis.languageMatch.matchPercentage}%
Required: ${analysis.languageMatch.required.join(', ')}
Found: ${analysis.languageMatch.found.join(', ')}

Commit Activity:
- Total Commits: ${analysis.commitActivity.totalCommits}
- Last Month: ${analysis.commitActivity.lastMonthCommits}
- Consistency: ${analysis.commitActivity.consistency}%

Strengths:
${analysis.strengths.map((s: string) => `- ${s}`).join('\n')}

Areas to Explore:
${analysis.concerns.map((c: string) => `- ${c}`).join('\n')}
    `.trim();
    
    navigator.clipboard.writeText(summary);
    toast.success('Summary copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Match Report Header */}
      <Card 
        className="p-6 shadow-xl border backdrop-blur-lg" 
        style={{ 
          background: 'rgba(255, 255, 255, 0.4)',
          borderColor: 'rgba(255, 255, 255, 0.5)' 
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6" style={{ color: 'rgba(70, 130, 180, 1)' }} />
            <h2 style={{ color: 'rgba(0, 31, 63, 1)' }}>Match Report</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJSON}
              className="gap-2 backdrop-blur-md border hover:shadow-lg transition-all"
              style={{ 
                background: 'rgba(255, 255, 255, 0.5)',
                borderColor: 'rgba(70, 130, 180, 0.5)', 
                color: 'rgba(0, 31, 63, 1)' 
              }}
            >
              <Download className="w-4 h-4" />
              Export JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySummary}
              className="gap-2 backdrop-blur-md border hover:shadow-lg transition-all"
              style={{ 
                background: 'rgba(255, 255, 255, 0.5)',
                borderColor: 'rgba(70, 130, 180, 0.5)', 
                color: 'rgba(0, 31, 63, 1)' 
              }}
            >
              <Copy className="w-4 h-4" />
              Copy Summary
            </Button>
          </div>
        </div>
      </Card>

      {/* Profile Overview */}
      <Card 
        className="p-6 shadow-xl border backdrop-blur-lg" 
        style={{ 
          background: 'rgba(255, 255, 255, 0.4)',
          borderColor: 'rgba(255, 255, 255, 0.5)' 
        }}
      >
        <div className="flex items-start gap-6">
          <img
            src={analysis.profileData.avatar}
            alt={analysis.profileData.name}
            className="w-24 h-24 rounded-full border-4 border-white/50 shadow-lg"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 style={{ color: 'rgba(0, 31, 63, 1)' }}>{analysis.profileData.name}</h3>
              <Badge 
                variant="outline" 
                className="backdrop-blur-sm"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.5)',
                  borderColor: 'rgba(70, 130, 180, 0.5)', 
                  color: 'rgba(0, 31, 63, 1)' 
                }}
              >
                @{analysis.username}
              </Badge>
            </div>
            <p className="mb-4" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>{analysis.profileData.bio}</p>
            <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>
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
          <div className="text-center px-6">
            <div className="text-5xl mb-2" style={{ color: getScoreColor(analysis.similarityScore) }}>
              {analysis.similarityScore}%
            </div>
            <Badge 
              variant={getScoreBadgeVariant(analysis.similarityScore)} 
              className="text-sm backdrop-blur-md border-white/40" 
              style={{ 
                backgroundColor: getScoreColor(analysis.similarityScore), 
                color: 'white', 
                borderColor: 'rgba(255, 255, 255, 0.4)' 
              }}
            >
              Match Score
            </Badge>
          </div>
        </div>
      </Card>

      {/* Technology Stack Match */}
      <Card 
        className="p-6 shadow-xl border backdrop-blur-lg" 
        style={{ 
          background: 'rgba(255, 255, 255, 0.4)',
          borderColor: 'rgba(255, 255, 255, 0.5)' 
        }}
      >
        <h3 className="mb-4 flex items-center gap-2" style={{ color: 'rgba(0, 31, 63, 1)' }}>
          <Code className="w-5 h-5" />
          Technology Stack Match
        </h3>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: 'rgba(0, 51, 102, 0.95)' }}>Match Percentage</span>
            <span style={{ color: getScoreColor(analysis.languageMatch.matchPercentage) }}>
              {analysis.languageMatch.matchPercentage}%
            </span>
          </div>
          <Progress value={analysis.languageMatch.matchPercentage} className="h-2" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm mb-2" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>Required Technologies:</p>
            <div className="flex flex-wrap gap-2">
              {analysis.languageMatch.required.map((lang: string) => {
                const isFound = analysis.languageMatch.found.includes(lang);
                return (
                  <Badge
                    key={lang}
                    variant={isFound ? 'default' : 'outline'}
                    className="backdrop-blur-sm"
                    style={isFound ? { 
                      background: 'rgba(70, 130, 180, 0.6)', 
                      color: 'white', 
                      borderColor: 'rgba(255, 255, 255, 0.4)' 
                    } : { 
                      background: 'rgba(255, 255, 255, 0.4)',
                      borderColor: 'rgba(135, 206, 250, 0.6)', 
                      color: 'rgba(0, 31, 63, 1)' 
                    }}
                  >
                    {lang}
                    {isFound && <Check className="w-3 h-3 ml-1" />}
                  </Badge>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-sm mb-2" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>Additional Technologies:</p>
            <div className="flex flex-wrap gap-2">
              {analysis.languageMatch.found
                .filter((lang: string) => !analysis.languageMatch.required.includes(lang))
                .map((lang: string) => (
                  <Badge 
                    key={lang} 
                    variant="secondary" 
                    className="backdrop-blur-sm"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.5)', 
                      color: 'rgba(0, 31, 63, 1)', 
                      borderColor: 'rgba(255, 255, 255, 0.4)' 
                    }}
                  >
                    {lang}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Commit Activity */}
      <Card 
        className="p-6 shadow-xl border backdrop-blur-lg" 
        style={{ 
          background: 'rgba(255, 255, 255, 0.4)',
          borderColor: 'rgba(255, 255, 255, 0.5)' 
        }}
      >
        <h3 className="mb-4 flex items-center gap-2" style={{ color: 'rgba(0, 31, 63, 1)' }}>
          <Activity className="w-5 h-5" />
          Commit Activity
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg backdrop-blur-sm border border-white/30" style={{ background: 'rgba(255, 255, 255, 0.4)' }}>
            <div className="text-3xl mb-1" style={{ color: 'rgba(0, 31, 63, 1)' }}>
              {analysis.commitActivity.totalCommits.toLocaleString()}
            </div>
            <div className="text-sm" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>Total Commits</div>
          </div>
          <div className="text-center p-4 rounded-lg backdrop-blur-sm border border-white/30" style={{ background: 'rgba(255, 255, 255, 0.4)' }}>
            <div className="text-3xl mb-1" style={{ color: 'rgba(0, 31, 63, 1)' }}>
              {analysis.commitActivity.lastMonthCommits}
            </div>
            <div className="text-sm" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>Last 30 Days</div>
          </div>
          <div className="text-center p-4 rounded-lg backdrop-blur-sm border border-white/30" style={{ background: 'rgba(255, 255, 255, 0.4)' }}>
            <div className="text-3xl mb-1" style={{ color: 'rgba(0, 31, 63, 1)' }}>
              {analysis.commitActivity.averagePerWeek}
            </div>
            <div className="text-sm" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>Avg. per Week</div>
          </div>
          <div className="text-center p-4 rounded-lg backdrop-blur-sm border border-white/30" style={{ background: 'rgba(255, 255, 255, 0.4)' }}>
            <div className="text-3xl mb-1" style={{ color: 'rgba(0, 31, 63, 1)' }}>
              {analysis.commitActivity.consistency}%
            </div>
            <div className="text-sm" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>Consistency</div>
          </div>
        </div>
      </Card>

      {/* Top Repositories */}
      <Card 
        className="p-6 shadow-xl border backdrop-blur-lg" 
        style={{ 
          background: 'rgba(255, 255, 255, 0.4)',
          borderColor: 'rgba(255, 255, 255, 0.5)' 
        }}
      >
        <h3 className="mb-4 flex items-center gap-2" style={{ color: 'rgba(0, 31, 63, 1)' }}>
          <GitBranch className="w-5 h-5" />
          Top Repositories
        </h3>
        <div className="space-y-4">
          {analysis.topRepositories.map((repo: any, index: number) => (
            <div 
              key={index} 
              className="flex items-start gap-4 p-4 rounded-lg backdrop-blur-sm border border-white/30" 
              style={{ background: 'rgba(255, 255, 255, 0.35)' }}
            >
              <Github className="w-5 h-5 mt-1" style={{ color: 'rgba(0, 71, 142, 0.85)' }} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: 'rgba(0, 31, 63, 1)' }}>{repo.name}</span>
                  <Badge 
                    variant="outline" 
                    className="text-xs backdrop-blur-sm" 
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.5)',
                      borderColor: 'rgba(70, 130, 180, 0.5)', 
                      color: 'rgba(0, 31, 63, 1)' 
                    }}
                  >
                    {repo.language}
                  </Badge>
                </div>
                <p className="text-sm" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>{repo.description}</p>
              </div>
              <div className="flex items-center gap-1" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>
                <Star className="w-4 h-4" />
                <span className="text-sm">{repo.stars}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Skills Breakdown */}
      <Card 
        className="p-6 shadow-xl border backdrop-blur-lg" 
        style={{ 
          background: 'rgba(255, 255, 255, 0.4)',
          borderColor: 'rgba(255, 255, 255, 0.5)' 
        }}
      >
        <h3 className="mb-4" style={{ color: 'rgba(0, 31, 63, 1)' }}>Skills Detected</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(analysis.skills).map(([category, skills]: [string, any]) => (
            <div key={category}>
              <p className="text-sm mb-2 capitalize" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>{category}:</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string) => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="backdrop-blur-sm"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.5)', 
                      color: 'rgba(0, 31, 63, 1)', 
                      borderColor: 'rgba(255, 255, 255, 0.4)' 
                    }}
                  >
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
        <Card 
          className="p-6 shadow-xl border backdrop-blur-lg" 
          style={{ 
            background: 'rgba(255, 255, 255, 0.4)',
            borderColor: 'rgba(255, 255, 255, 0.5)' 
          }}
        >
          <h3 className="mb-4 flex items-center gap-2" style={{ color: 'rgba(0, 31, 63, 1)' }}>
            <CheckCircle2 className="w-5 h-5" style={{ color: 'rgba(70, 130, 180, 1)' }} />
            Strengths
          </h3>
          <ul className="space-y-3">
            {analysis.strengths.map((strength: string, index: number) => (
              <li key={index} className="flex items-start gap-2" style={{ color: 'rgba(0, 31, 63, 1)' }}>
                <TrendingUp className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'rgba(70, 130, 180, 1)' }} />
                <span className="text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card 
          className="p-6 shadow-xl border backdrop-blur-lg" 
          style={{ 
            background: 'rgba(255, 255, 255, 0.4)',
            borderColor: 'rgba(255, 255, 255, 0.5)' 
          }}
        >
          <h3 className="mb-4 flex items-center gap-2" style={{ color: 'rgba(0, 31, 63, 1)' }}>
            <AlertCircle className="w-5 h-5" style={{ color: 'rgba(100, 149, 237, 1)' }} />
            Areas to Explore
          </h3>
          <ul className="space-y-3">
            {analysis.concerns.map((concern: string, index: number) => (
              <li key={index} className="flex items-start gap-2" style={{ color: 'rgba(0, 31, 63, 1)' }}>
                <AlertCircle className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'rgba(100, 149, 237, 1)' }} />
                <span className="text-sm">{concern}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
