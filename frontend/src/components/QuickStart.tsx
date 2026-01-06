import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Zap } from 'lucide-react';

interface QuickStartProps {
  onSelectUsername: (username: string) => void;
  onSelectJobDescription: (description: string) => void;
  onClearAll: () => void;
}

// Sample GitHub usernames for quick testing
  // Sample GitHub users for quick start
  const sampleUsers = [
  '@torvalds',
  '@octocat',
  '@gaearon',
  '@jimestestophp',
  '@bobbynorman',
];

const sampleJobs = [
  { label: 'Python Dev', description: 'We are looking for a Senior Python Developer with experience in Django, FastAPI, and PostgreSQL. Must have knowledge of Docker, AWS, and CI/CD pipelines. Experience with React and JavaScript is a plus.' },
  { label: 'JS Dev', description: 'Senior JavaScript Developer needed. Must be proficient in React, Node.js, TypeScript, and modern frontend frameworks. Experience with REST APIs, GraphQL, and state management libraries required.' },
  { label: 'ML Engineer', description: 'Machine Learning Engineer with strong Python background. Experience with TensorFlow, PyTorch, scikit-learn required. Knowledge of data pipelines, model deployment, and cloud services (AWS/GCP) essential.' },
];

export function QuickStart({
  onSelectUsername,
  onSelectJobDescription,
  onClearAll,
}: QuickStartProps) {
  return (
    <div 
      className="border rounded-xl p-6 mb-6 backdrop-blur-md shadow-lg" 
      style={{ 
        background: 'rgba(255, 255, 255, 0.35)',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4" style={{ color: 'rgba(0, 31, 63, 1)' }} />
        <span style={{ color: 'rgba(0, 31, 63, 1)' }}>Quick Start</span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm mb-2" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>Try these popular users:</p>
          <div className="flex flex-wrap gap-2">
            {sampleUsers.map((user) => (
              <Badge
                key={user}
                variant="outline"
                className="cursor-pointer hover:opacity-80 transition-all backdrop-blur-sm"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.5)',
                  borderColor: 'rgba(70, 130, 180, 0.5)', 
                  color: 'rgba(0, 31, 63, 1)' 
                }}
                onClick={() => onSelectUsername(user.substring(1))}
              >
                {user}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm mb-2" style={{ color: 'rgba(0, 51, 102, 0.95)' }}>Or sample job descriptions:</p>
          <div className="flex flex-wrap gap-2">
            {sampleJobs.map((job) => (
              <Badge
                key={job.label}
                variant="outline"
                className="cursor-pointer hover:opacity-80 transition-all backdrop-blur-sm"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.5)',
                  borderColor: 'rgba(70, 130, 180, 0.5)', 
                  color: 'rgba(0, 31, 63, 1)' 
                }}
                onClick={() => onSelectJobDescription(job.description)}
              >
                {job.label}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="hover:bg-white/20 transition-all"
            style={{ color: 'rgba(0, 31, 63, 1)' }}
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
}
