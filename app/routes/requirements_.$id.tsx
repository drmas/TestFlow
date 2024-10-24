import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { getRequirement, updateRequirement, deleteRequirement } from "~/models/requirement.server";
import { getTestCaseByRequirement } from "~/models/test-case.server";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { RequirementForm } from "~/components/requirements/RequirementForm";

export async function loader({ params }: LoaderFunctionArgs) {
  const requirement = await getRequirement(params.id as string);
  if (!requirement) {
    throw new Response("Not Found", { status: 404 });
  }

  const relatedTestCases = await getTestCaseByRequirement(requirement.id);
  
  return json({ requirement, relatedTestCases });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "update": {
      const updates = JSON.parse(formData.get("updates") as string);
      const updatedRequirement = await updateRequirement(params.id as string, updates);
      return json({ success: true, requirement: updatedRequirement });
    }
    case "delete": {
      await deleteRequirement(params.id as string);
      return json({ success: true });
    }
    default:
      return json({ error: "Invalid intent" }, { status: 400 });
  }
}

export default function RequirementDetails() {
  const { requirement, relatedTestCases } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpdate = async (updates: Partial<typeof requirement>) => {
    const formData = new FormData();
    formData.append("intent", "update");
    formData.append("updates", JSON.stringify(updates));

    await fetch(`/requirements/${requirement.id}`, {
      method: "POST",
      body: formData,
    });

    setShowEditModal(false);
  };

  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("intent", "delete");

    await fetch(`/requirements/${requirement.id}`, {
      method: "POST",
      body: formData,
    });

    navigate("/requirements");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/requirements"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              ← Back to Requirements
            </Link>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {requirement.title}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {requirement.id}
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
              <CardTitle>Requirement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {requirement.description}
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                  Category
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {requirement.category}
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {requirement.tags.map((tag) => (
                    <Badge key={tag.id} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                {relatedTestCases.length > 0 ? (
                  <div className="space-y-4">
                    {relatedTestCases.map((testCase) => (
                      <Link
                        key={testCase.id}
                        to={`/test-cases/${testCase.id}`}
                        className="block rounded-lg border border-gray-200 p-4 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-400"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {testCase.title}
                          </span>
                          <Badge
                            variant={testCase.status === "Approved" ? "default" : "outline"}
                          >
                            {testCase.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {testCase.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    No test cases are currently linked to this requirement.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
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
                <Badge variant="default" className="ml-2">
                  {requirement.status}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Priority
                </span>
                <Badge
                  variant={requirement.priority === "High" ? "destructive" : "outline"}
                  className="ml-2"
                >
                  {requirement.priority}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Version
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {requirement.version}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent>
              {requirement.comments.length > 0 ? (
                <div className="space-y-4">
                  {requirement.comments.map((comment, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                    >
                      <p className="text-gray-600 dark:text-gray-300">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No comments yet.
                </p>
              )}
              <div className="mt-4">
                <Button variant="secondary" className="w-full">
                  Add Comment
                </Button>
              </div>
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
                    {requirement.createdBy.username}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Created on:
                  </span>{" "}
                  <span className="text-gray-900 dark:text-white">
                    {new Date(requirement.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Last modified on:
                  </span>{" "}
                  <span className="text-gray-900 dark:text-white">
                    {new Date(requirement.updatedAt).toLocaleDateString()}
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
          title="Edit Requirement"
        >
          <RequirementForm
            requirement={requirement}
            onSubmit={handleUpdate}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal>
      )}

      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Requirement"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this requirement? This action cannot be undone.
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