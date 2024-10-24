import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  return json({
    summary: {
      totalRequirements: 45,
      totalTestCases: 128,
      requirementsCovered: 42,
      testsPassed: 98,
      testsFailed: 12,
      testsPending: 18,
    },
  });
}

export default function Reports() {
  const { summary } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Reports & Analytics
      </h1>

      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Requirements Coverage"
          value={`${Math.round((summary.requirementsCovered / summary.totalRequirements) * 100)}%`}
          description={`${summary.requirementsCovered} of ${summary.totalRequirements} requirements covered`}
          color="blue"
        />
        <StatCard
          title="Test Pass Rate"
          value={`${Math.round((summary.testsPassed / summary.totalTestCases) * 100)}%`}
          description={`${summary.testsPassed} of ${summary.totalTestCases} tests passed`}
          color="green"
        />
        <StatCard
          title="Test Cases"
          value={summary.totalTestCases.toString()}
          description={`${summary.testsPending} tests pending execution`}
          color="purple"
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[
            "New test case added for login functionality",
            "Test run TR-001 completed with 95% pass rate",
            "Requirements updated for user management module",
            "3 test cases automated for payment processing",
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center border-b border-gray-200 pb-4 last:border-0 dark:border-gray-700"
            >
              <div className="mr-4 h-2 w-2 rounded-full bg-blue-500"></div>
              <p className="text-gray-600 dark:text-gray-300">{activity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  color,
}: {
  title: string;
  value: string;
  description: string;
  color: "blue" | "green" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900",
    green: "bg-green-50 dark:bg-green-900",
    purple: "bg-purple-50 dark:bg-purple-900",
  };

  return (
    <div
      className={`rounded-lg p-6 ${colorClasses[color]} border border-gray-200 dark:border-gray-700`}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
}