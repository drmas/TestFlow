import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { getTestCase, updateTestCase, deleteTestCase } from "~/models/test-case.server";
import { getRequirements } from "~/models/requirement.server";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { TestCaseForm } from "~/components/test-cases/TestCaseForm";

export async function loader({ params }: LoaderFunctionArgs) {
  const [testCase, requirements] = await Promise.all([
    getTestCase(params.id as string),
    getRequirements(),
  ]);

  if (!testCase) {
    throw new Response("Not Found", { status: 404 });
  }

  const relatedRequirements = requirements.filter(req => 
    testCase.relatedRequirements.includes(req.id)
  );

  return json({ testCase, relatedRequirements, requirements });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "update": {
      const updates = JSON.parse(formData.get("updates") as string);
      const updatedTestCase = await updateTestCase(params.id as string, updates);
      return json({ success: true, testCase: updatedTestCase });
    }
    case "delete": {
      await deleteTestCase(params.id as string);
      return json({ success: true });
    }
    default:
      return json({ error: "Invalid intent" }, { status: 400 });
  }
}

export default function TestCaseDetails() {
  const { testCase, relatedRequirements, requirements } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpdate = async (updates: Partial<typeof testCase>) => {
    const formData = new FormData();
    formData.append("intent", "update");
    formData.append("updates", JSON.stringify(updates));

    await fetch(`/test-cases/${testCase.id}`, {
      method: "POST",
      body: formData,
    });

    setShowEditModal(false);
    // The page will automatically reload due to Remix's form handling
  };

  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("intent", "delete");

    await fetch(`/test-cases/${testCase.id}`, {
      method: "POST",
      body: formData,
    });

    navigate("/test-cases");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/test-cases"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              ← Back to Test Cases
            </Link>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {testCase.title}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {testCase.id}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowEditModal(true)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Test Case Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {testCase.description}
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                  Preconditions
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {testCase.preconditions}
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                  Test Steps
                </h3>
                <div className="space-y-4">
                  {testCase.steps.map((step, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Step {index + 1}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Action:</span> {step.action}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Expected Result:</span>{" "}
                          {step.expectedResult}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Status
                </span>
                <Badge variant="success" className="ml-2">
                  {testCase.status}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Priority
                </span>
                <Badge
                  variant={testCase.priority === "High" ? "danger" : "default"}
                  className="ml-2"
                >
                  {testCase.priority}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Type
                </span>
                <Badge variant="default" className="ml-2">
                  {testCase.type}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Automation
                </span>
                <Badge variant="warning" className="ml-2">
                  {testCase.automationStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              {relatedRequirements.length > 0 ? (
                <div className="space-y-2">
                  {relatedRequirements.map((req) => (
                    <Link
                      key={req.id}
                      to={`/requirements/${req.id}`}
                      className="block rounded-lg border border-gray-200 p-3 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-400"
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {req.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {req.id}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No related requirements
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Created by:
                  </span>{" "}
                  <span className="text-gray-900 dark:text-white">
                    {testCase.createdBy}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Created on:
                  </span>{" "}
                  <span className="text-gray-900 dark:text-white">
                    {new Date(testCase.createdDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Last modified by:
                  </span>{" "}
                  <span className="text-gray-900 dark:text-white">
                    {testCase.modifiedBy}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Last modified on:
                  </span>{" "}
                  <span className="text-gray-900 dark:text-white">
                    {new Date(testCase.modifiedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Test Case"
        >
          <TestCaseForm
            testCase={testCase}
            requirements={requirements}
            onSubmit={handleUpdate}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal>
      )}

      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Test Case"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this test case? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
