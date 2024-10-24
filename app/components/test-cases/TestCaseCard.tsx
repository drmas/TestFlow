import { useNavigate, Link } from "@remix-run/react";
import { Badge } from "~/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/Card";
import type { TestCase, Requirement } from "~/models/types";

interface TestCaseCardProps {
  testCase: TestCase;
  requirements: Requirement[];
  onSelect?: (id: string) => void;
}

export function TestCaseCard({ testCase, requirements, onSelect }: TestCaseCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onSelect) {
      onSelect(testCase.id);
    }
  };

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <Link to={`/test-cases/${testCase.id}`}>
            <CardTitle className="hover:text-blue-600 dark:hover:text-blue-400">
              {testCase.title}
            </CardTitle>
          </Link>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {testCase.id}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          {testCase.description}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">{testCase.type}</Badge>
          <Badge variant={testCase.priority === "High" ? "danger" : "default"}>
            {testCase.priority}
          </Badge>
          <Badge variant={testCase.status === "Approved" ? "success" : "warning"}>
            {testCase.status}
          </Badge>
        </div>
        {requirements.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Related Requirements:
            </h4>
            <div className="flex flex-wrap gap-2">
              {requirements.map((req) => (
                <Link
                  key={req.id}
                  to={`/requirements/${req.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  {req.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}