import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { useState } from "react";
import { getTestRun, updateTestRun } from "~/models/test-run.server";
import { getTestCase } from "~/models/test-case.server";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";

export async function loader({ params }: LoaderFunctionArgs) {
  const testRun = await getTestRun(params.id as string);
  if (!testRun) {
    throw new Response("Not Found", { status: 404 });
  }

  const testCases = await Promise.all(
    testRun.results.map(async (result) => ({
      ...result,
      testCase: await getTestCase(result.testCaseId),
    }))
  );

  return json({ testRun, testCases });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "update-result") {
    const resultId = formData.get("resultId") as string;
    const status = formData.get("status") as string;
    const actualResults = formData.get("actualResults") as string;
    const comments = formData.get("comments") as string;

    const testRun = await getTestRun(params.id as string);
    if (!testRun) {
      throw new Response("Not Found", { status: 404 });
    }

    const updatedResults = testRun.results.map((result) =>
      result.id === resultId
        ? {
            ...result,
            status,
            actualResults,
            comments,
            executionDate: new Date().toISOString(),
          }
        : result
    );

    await updateTestRun(params.id as string, {
      results: updatedResults,
      modifiedDate: new Date().toISOString(),
    });

    return json({ success: true });
  }

  return null;
}

export default function TestRunDetails() {
  const { testRun, testCases } = useLoaderData<typeof loader>();
  const [selectedResult, setSelectedResult] = useState<(typeof testCases)[0] | null>(null);

  const stats = {
    total: testCases.length,
    passed: testCases.filter((tc) => tc.status === "Pass").length,
    failed: testCases.filter((tc) => tc.status === "Fail").length,
    pending: testCases.filter((tc) => tc.status === "Pending").length,
  };

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
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {testRun.name}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Started: {new Date(testRun.startDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="default">{testRun.status}</Badge>
            <Link to={`/test-runs/${testRun.id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.passed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Passed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.failed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Pending
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testCases.map((result) => (
              <div
                key={result.id}
                className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {result.testCase.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {result.testCase.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        result.status === "Pass"
                          ? "success"
                          : result.status === "Fail"
                          ? "danger"
                          : "default"
                      }
                    >
                      {result.status}
                    </Badge>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedResult(result)}
                    >
                      Update Result
                    </Button>
                  </div>
                </div>
                {result.actualResults && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Actual Results:</span>{" "}
                      {result.actualResults}
                    </p>
                  </div>
                )}
                {result.comments && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Comments:</span>{" "}
                      {result.comments}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedResult && (
        <Modal
          isOpen={!!selectedResult}
          onClose={() => setSelectedResult(null)}
          title="Update Test Result"
        >
          <form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="update-result" />
            <input type="hidden" name="resultId" value={selectedResult.id} />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                name="status"
                defaultValue={selectedResult.status}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Actual Results
              </label>
              <textarea
                name="actualResults"
                defaultValue={selectedResult.actualResults}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Comments
              </label>
              <textarea
                name="comments"
                defaultValue={selectedResult.comments}
                rows={2}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setSelectedResult(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
