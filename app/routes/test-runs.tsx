import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Button } from "~/components/ui/Button"; // Import the Button component

export async function loader() {
  return json({
    testRuns: [
      {
        id: "TR-001",
        name: "Sprint 1 Regression",
        status: "In Progress",
        totalTests: 25,
        passed: 18,
        failed: 2,
        pending: 5,
        startDate: "2024-03-20",
      },
      {
        id: "TR-002",
        name: "Authentication Tests",
        status: "Completed",
        totalTests: 10,
        passed: 9,
        failed: 1,
        pending: 0,
        startDate: "2024-03-19",
      },
    ],
  });
}

export default function TestRuns() {
  const { testRuns } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Test Runs
        </h1>
        <Link to="/test-runs/new">
          <Button variant="default">New Test Run</Button> {/* Use Button component */}
        </Link>
      </div>

      <div className="grid gap-4">
        {testRuns.map((run) => (
          <div
            key={run.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {run.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Started: {run.startDate}
                </p>
              </div>
              <span className="rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {run.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-md bg-green-100 p-3 text-center dark:bg-green-900">
                <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {run.passed}
                </div>
                <div className="text-sm text-green-600 dark:text-green-300">
                  Passed
                </div>
              </div>
              <div className="rounded-md bg-red-100 p-3 text-center dark:bg-red-900">
                <div className="text-2xl font-bold text-red-800 dark:text-red-200">
                  {run.failed}
                </div>
                <div className="text-sm text-red-600 dark:text-red-300">
                  Failed
                </div>
              </div>
              <div className="rounded-md bg-gray-100 p-3 text-center dark:bg-gray-700">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {run.pending}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Pending
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
