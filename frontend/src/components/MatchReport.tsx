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
  TrendingUp,
  AlertCircle,
  Code,
  Activity,
  Check,
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface AnalysisData {
  username: string;
  match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  candidate_skills: string[];
  job_skills: string[];
  repo_insights: {
    languages: Record<string, number>;
    total_stars: number;
    total_forks: number;
    repo_count: number;
  };
}

interface MatchReportProps {
  analysis: AnalysisData;
  onReset: () => void;
}

export function MatchReport({ analysis }: MatchReportProps) {
  const getScoreColor = (score: number) => {
    // Use darker navy tones for better contrast and readability
    if (score >= 80) return 'rgba(0, 31, 63, 1)';
    if (score >= 60) return 'rgba(0, 31, 63, 0.9)';
    return 'rgba(0, 31, 63, 0.8)';
  };

  // Chart colors for consistency - blue theme
  const chartColors = [
    'rgba(70, 130, 180, 0.8)',
    'rgba(100, 149, 237, 0.8)',
    'rgba(135, 206, 250, 0.8)',
    'rgba(173, 216, 230, 0.8)',
    'rgba(176, 224, 230, 0.8)',
  ];

  // Prepare language data for pie chart
  const languageData = Object.entries(analysis.repo_insights.languages)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([language, bytes], index) => ({
      name: language,
      value: bytes,
      color: chartColors[index % chartColors.length]
    }));

  // Prepare repository stats data for bar chart
  const repoStatsData = [
    {
      name: 'Repos',
      value: analysis.repo_insights.repo_count,
      color: 'rgba(70, 130, 180, 0.8)'
    },
    {
      name: 'Stars',
      value: analysis.repo_insights.total_stars,
      color: 'rgba(100, 149, 237, 0.8)'
    },
    {
      name: 'Forks',
      value: analysis.repo_insights.total_forks,
      color: 'rgba(135, 206, 250, 0.8)'
    },
    {
      name: 'Languages',
      value: Object.keys(analysis.repo_insights.languages).length,
      color: 'rgba(173, 216, 230, 0.8)'
    }
  ];

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(analysis, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `commitfit-${analysis.username}-${Date.now()}.json`;
    link.click();
  };

  const handleCopySummary = () => {
    const summary = `
CommitFit Analysis Report
========================
Username: ${analysis.username}
Match Score: ${analysis.match_score.toFixed(1)}%

Technology Match: ${analysis.matching_skills.length}/${analysis.job_skills.length} skills
Required: ${analysis.job_skills.join(', ')}
Found: ${analysis.matching_skills.join(', ')}
Missing: ${analysis.missing_skills.join(', ')}

Repository Insights:
- Total Repositories: ${analysis.repo_insights.repo_count}
- Total Stars: ${analysis.repo_insights.total_stars}
- Total Forks: ${analysis.repo_insights.total_forks}
- Languages: ${Object.keys(analysis.repo_insights.languages).join(', ')}

Strengths:
- Strong match with ${analysis.matching_skills.length} required technologies
- Active GitHub profile with ${analysis.repo_insights.repo_count} repositories
- Good repository engagement (${analysis.repo_insights.total_stars} stars)

Areas to Explore:
${analysis.missing_skills.length > 0 ? analysis.missing_skills.map(skill => `- Consider gaining experience with ${skill}`).join('\n') : '- All required skills are covered!'}
    `.trim();
    
    navigator.clipboard.writeText(summary);
  };

  return (
    <div className="space-y-6">
      {/* Match Report Header */}
      <Card 
        className="p-6 shadow-xl border backdrop-blur-lg" 
        style={{ 
          background: 'rgba(255, 255, 255, 0.4)',
          borderColor: 'rgba(255, 255, 255, 0.5)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
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
          borderColor: 'rgba(255, 255, 255, 0.5)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full border-4 border-white/50 shadow-lg flex items-center justify-center" style={{ background: 'rgba(70, 130, 180, 0.3)' }}>
            <Github className="w-12 h-12" style={{ color: 'rgba(0, 31, 63, 1)' }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 style={{ color: 'rgba(0, 31, 63, 1)' }}>{analysis.username}</h3>
            </div>
            <p className="mb-4" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>
              GitHub developer with {analysis.repo_insights.repo_count} public repositories
            </p>
            <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>
              <div className="flex items-center gap-1">
                <Code className="w-4 h-4" />
                {analysis.repo_insights.repo_count} repositories
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {analysis.repo_insights.total_stars} stars
              </div>
              <div className="flex items-center gap-1">
                <GitBranch className="w-4 h-4" />
                {analysis.repo_insights.total_forks} forks
              </div>
            </div>
          </div>
          <div className="text-center px-6">
            <div className="text-5xl mb-2" style={{ color: getScoreColor(analysis.match_score) }}>
              {analysis.match_score.toFixed(1)}%
            </div>
            <div className="text-sm" style={{ color: 'rgba(0, 31, 63, 1)' }}>
              Match Score
            </div>
          </div>
        </div>
      </Card>

      {/* Technology Stack Match */}
      <Card 
        className="p-6 shadow-xl border backdrop-blur-lg" 
        style={{ 
          background: 'rgba(255, 255, 255, 0.4)',
          borderColor: 'rgba(255, 255, 255, 0.5)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3 className="mb-4 flex items-center gap-2" style={{ color: 'rgba(0, 31, 63, 1)' }}>
          <Code className="w-5 h-5" />
          Technology Stack Match
        </h3>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: 'rgba(0, 51, 102, 0.95)' }}>Match Percentage</span>
            <span style={{ color: getScoreColor(analysis.match_score) }}>
              {analysis.match_score.toFixed(1)}%
            </span>
          </div>
          <Progress value={analysis.match_score} className="h-2" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
              <p className="text-sm mb-2" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>Required Technologies:</p>
            <div className="flex flex-wrap gap-2">
              {analysis.job_skills.map((skill: string) => {
                const isFound = analysis.matching_skills.includes(skill);
                return (
                  <Badge
                    key={skill}
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
                    {skill}
                    {isFound && <Check className="w-3 h-3 ml-1" />}
                  </Badge>
                );
              })}
            </div>
          </div>
          <div>
              <p className="text-sm mb-2" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>Additional Technologies:</p>
            <div className="flex flex-wrap gap-2">
              {analysis.candidate_skills
                .filter((skill: string) => !analysis.job_skills.includes(skill))
                .map((skill: string) => (
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
        </div>
      </Card>

      {/* Repository Insights */}
      <Card 
        className="p-6 shadow-xl border backdrop-blur-lg" 
        style={{ 
          background: 'rgba(255, 255, 255, 0.4)',
          borderColor: 'rgba(255, 255, 255, 0.5)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3 className="mb-6 flex items-center gap-2" style={{ color: 'rgba(50, 30, 90, 1)' }}>
          <Activity className="w-5 h-5" />
          Repository Insights
        </h3>
        
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg backdrop-blur-sm border border-white/30" style={{ background: 'rgba(240, 220, 230, 0.3)' }}>
            <div className="text-3xl mb-1" style={{ color: 'rgba(0, 31, 63, 1)' }}>
              {analysis.repo_insights.repo_count}
            </div>
            <div className="text-sm" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>Repositories</div>
          </div>
          <div className="text-center p-4 rounded-lg backdrop-blur-sm border border-white/30" style={{ background: 'rgba(240, 200, 220, 0.3)' }}>
            <div className="text-3xl mb-1" style={{ color: 'rgba(0, 31, 63, 1)' }}>
              {analysis.repo_insights.total_stars}
            </div>
            <div className="text-sm" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>Total Stars</div>
          </div>
          <div className="text-center p-4 rounded-lg backdrop-blur-sm border border-white/30" style={{ background: 'rgba(200, 200, 240, 0.3)' }}>
            <div className="text-3xl mb-1" style={{ color: 'rgba(0, 31, 63, 1)' }}>
              {analysis.repo_insights.total_forks}
            </div>
            <div className="text-sm" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>Total Forks</div>
          </div>
          <div className="text-center p-4 rounded-lg backdrop-blur-sm border border-white/30" style={{ background: 'rgba(200, 220, 240, 0.3)' }}>
            <div className="text-3xl mb-1" style={{ color: 'rgba(0, 31, 63, 1)' }}>
              {Object.keys(analysis.repo_insights.languages).length}
            </div>
            <div className="text-sm" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>Languages</div>
          </div>
        </div>

        {/* Visual Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Repository Stats Bar Chart */}
        <div className="space-y-4">
            <h4 className="text-lg font-medium" style={{ color: 'rgba(50, 30, 90, 1)' }}>
              Repository Statistics
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={repoStatsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'rgba(0, 51, 102, 0.95)', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(70, 130, 180, 0.5)' }}
                  />
                  <YAxis 
                    tick={{ fill: 'rgba(0, 51, 102, 0.95)', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(70, 130, 180, 0.5)' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(70, 130, 180, 0.5)',
                      borderRadius: '8px',
                      color: 'rgba(0, 31, 63, 1)'
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {repoStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
                </div>
              </div>

          {/* Language Distribution Pie Chart */}
          {languageData.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium" style={{ color: 'rgba(50, 30, 90, 1)' }}>
                Language Distribution
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={languageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(180, 160, 220, 0.5)',
                        borderRadius: '8px',
                        color: 'rgba(50, 30, 90, 1)'
                      }}
                      formatter={(value: number) => [`${value.toLocaleString()} bytes`, 'Code']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Language Legend */}
              <div className="flex flex-wrap gap-2">
                {languageData.map((lang, index) => (
                  <div key={lang.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: lang.color }}
                    />
                    <span className="text-sm" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>
                      {lang.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Strengths & Areas to Explore */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card 
          className="p-6 shadow-xl border backdrop-blur-lg" 
          style={{ 
            background: 'rgba(255, 255, 255, 0.3)',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3 className="mb-4 flex items-center gap-2" style={{ color: 'rgba(0, 31, 63, 1)' }}>
            <CheckCircle2 className="w-5 h-5" style={{ color: 'rgba(70, 130, 180, 1)' }} />
            Strengths
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2" style={{ color: 'rgba(0, 31, 63, 1)' }}>
              <TrendingUp className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'rgba(70, 130, 180, 1)' }} />
              <span className="text-sm">Strong match with {analysis.matching_skills.length} required technologies</span>
            </li>
            <li className="flex items-start gap-2" style={{ color: 'rgba(0, 31, 63, 1)' }}>
              <TrendingUp className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'rgba(70, 130, 180, 1)' }} />
              <span className="text-sm">Active GitHub profile with {analysis.repo_insights.repo_count} repositories</span>
            </li>
            <li className="flex items-start gap-2" style={{ color: 'rgba(0, 31, 63, 1)' }}>
              <TrendingUp className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'rgba(70, 130, 180, 1)' }} />
              <span className="text-sm">Good repository engagement ({analysis.repo_insights.total_stars} stars)</span>
              </li>
          </ul>
        </Card>

        <Card 
          className="p-6 shadow-xl border backdrop-blur-lg" 
          style={{ 
            background: 'rgba(255, 255, 255, 0.3)',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3 className="mb-4 flex items-center gap-2" style={{ color: 'rgba(0, 31, 63, 1)' }}>
            <AlertCircle className="w-5 h-5" style={{ color: 'rgba(100, 149, 237, 1)' }} />
            Areas to Explore
          </h3>
          <ul className="space-y-3">
            {analysis.missing_skills.length > 0 ? (
              analysis.missing_skills.map((skill: string, index: number) => (
              <li key={index} className="flex items-start gap-2" style={{ color: 'rgba(0, 31, 63, 1)' }}>
                <AlertCircle className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'rgba(100, 149, 237, 1)' }} />
                  <span className="text-sm">Consider gaining experience with {skill}</span>
                </li>
              ))
            ) : (
              <li className="flex items-start gap-2" style={{ color: 'rgba(0, 31, 63, 1)' }}>
                <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'rgba(70, 130, 180, 1)' }} />
                <span className="text-sm">All required skills are covered!</span>
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
