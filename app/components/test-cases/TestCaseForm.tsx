import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/Badge";
import { TestStepForm } from "./TestStepForm";
import type { TestCase, TestStep, Requirement } from "~/models/types";

interface TestCaseFormProps {
  testCase?: TestCase;
  requirements: Requirement[];
  onSubmit: (data: Omit<TestCase, "id">) => Promise<void>;
  onCancel: () => void;
}

export function TestCaseForm({ testCase, requirements, onSubmit, onCancel }: TestCaseFormProps) {
  const [formData, setFormData] = useState<Partial<TestCase>>({
    title: testCase?.title ?? "",
    description: testCase?.description ?? "",
    preconditions: testCase?.preconditions ?? "",
    type: testCase?.type ?? "Functional",
    priority: testCase?.priority ?? "Medium",
    status: testCase?.status ?? "Draft",
    automationStatus: testCase?.automationStatus ?? "Not Automated",
    automationScriptPath: testCase?.automationScriptPath ?? "",
    steps: testCase?.steps ?? [],
    relatedRequirements: testCase?.relatedRequirements ?? [],
    createdBy: testCase?.createdBy ?? "user1",
    createdDate: testCase?.createdDate ?? new Date().toISOString(),
    modifiedBy: testCase?.modifiedBy ?? "user1",
    modifiedDate: testCase?.modifiedDate ?? new Date().toISOString(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.type) {
      newErrors.type = "Type is required";
    }

    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    if (formData.steps?.length === 0) {
      newErrors.steps = "At least one test step is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData as Omit<TestCase, "id">);
    }
  };

  const toggleRequirement = (reqId: string) => {
    setFormData(prev => ({
      ...prev,
      relatedRequirements: prev.relatedRequirements?.includes(reqId)
        ? prev.relatedRequirements.filter(id => id !== reqId)
        : [...(prev.relatedRequirements || []), reqId]
    }));
  };

  const filteredRequirements = requirements.filter(req =>
    req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-h-[calc(100vh-16rem)] overflow-y-auto px-1">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            rows={3}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Preconditions
          </label>
          <textarea
            value={formData.preconditions}
            onChange={(e) => setFormData({ ...formData, preconditions: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as TestCase["type"] })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="Functional">Functional</option>
              <option value="Integration">Integration</option>
              <option value="Performance">Performance</option>
              <option value="Security">Security</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as TestCase["priority"] })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Related Requirements
          </label>
          <div className="mt-1 space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search requirements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            
            {formData.relatedRequirements?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.relatedRequirements.map(reqId => {
                  const req = requirements.find(r => r.id === reqId);
                  return req ? (
                    <Badge
                      key={req.id}
                      variant="default"
                      className="cursor-pointer"
                      onClick={() => toggleRequirement(req.id)}
                    >
                      {req.title}
                      <span className="ml-2">×</span>
                    </Badge>
                  ) : null;
                })}
              </div>
            )}

            <div className="max-h-48 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700">
              {filteredRequirements.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRequirements.map((req) => (
                    <div
                      key={req.id}
                      className={`flex cursor-pointer items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        formData.relatedRequirements?.includes(req.id)
                          ? "bg-blue-50 dark:bg-blue-900"
                          : ""
                      }`}
                      onClick={() => toggleRequirement(req.id)}
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {req.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {req.id}
                        </div>
                      </div>
                      {formData.relatedRequirements?.includes(req.id) && (
                        <svg
                          className="h-5 w-5 text-blue-600 dark:text-blue-400"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                  No requirements found
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Test Steps</h3>
          <TestStepForm
            steps={formData.steps ?? []}
            onChange={(steps) => setFormData({ ...formData, steps })}
          />
          {errors.steps && (
            <p className="mt-1 text-sm text-red-600">{errors.steps}</p>
          )}
        </div>

        <div className="sticky bottom-0 flex justify-end gap-4 border-t border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-gray-800">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {testCase ? "Update" : "Create"} Test Case
          </Button>
        </div>
      </form>
    </div>
  );
}
