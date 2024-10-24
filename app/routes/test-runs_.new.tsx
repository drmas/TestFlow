import { json, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { createTestRun } from "~/models/test-run.server";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const testRun = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    startDate: new Date().toISOString(),
    status: "In Progress",
    executedBy: ["user1"], // TODO: Get from session
    results: [],
    createdBy: "user1", // TODO: Get from session
    createdDate: new Date().toISOString(),
    modifiedBy: "user1", // TODO: Get from session
    modifiedDate: new Date().toISOString(),
  };

  const newTestRun = await createTestRun(testRun);
  return redirect(`/test-runs/${newTestRun.id}`);
}

export default function NewTestRun() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Link
            to="/test-runs"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            ← Back to Test Runs
          </Link>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
          New Test Run
        </h1>
      </div>

      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Test Run Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form method="post" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                  placeholder="Sprint 1 Regression Tests"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                  placeholder="Describe the purpose and scope of this test run"
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full">
                  Create Test Run
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
