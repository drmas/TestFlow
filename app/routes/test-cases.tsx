import { json, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { TestCaseCard } from "~/components/test-cases/TestCaseCard";
import { TestCaseForm } from "~/components/test-cases/TestCaseForm";
import { SearchAndFilter } from "~/components/test-cases/SearchAndFilter";
import { BulkActions } from "~/components/test-cases/BulkActions";
import { createTestCase, getTestCases, updateTestCase, deleteTestCase } from "~/models/test-case.server";
import { getRequirements } from "~/models/requirement.server";
import type { TestCase, TestStep, Requirement } from "~/models/types";

export async function loader() {
  const [testCases, requirements] = await Promise.all([
    getTestCases(),
    getRequirements(),
  ]);

  return json({ testCases, requirements });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "create": {
      const testCase = JSON.parse(formData.get("testCase") as string);
      const newTestCase = await createTestCase(testCase);
      return json({ testCase: newTestCase });
    }
    case "update": {
      const id = formData.get("id") as string;
      const updates = JSON.parse(formData.get("updates") as string);
      const updatedTestCase = await updateTestCase(id, updates);
      return json({ testCase: updatedTestCase });
    }
    case "delete": {
      const id = formData.get("id") as string;
      await deleteTestCase(id);
      return json({ success: true });
    }
    default:
      return json({ error: "Invalid intent" }, { status: 400 });
  }
}

export default function TestCases() {
  const data = useLoaderData<typeof loader>();
  const { testCases, requirements } = data || { testCases: [], requirements: [] };
  const actionData = useActionData<typeof action>();
  const [showNewForm, setShowNewForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);

  const filteredTestCases = testCases.filter((testCase) => {
    const matchesSearch =
      searchTerm === "" ||
      testCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testCase.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "" || testCase.type === selectedType;
    const matchesPriority =
      selectedPriority === "" || testCase.priority === selectedPriority;
    const matchesStatus =
      selectedStatus === "" || testCase.status === selectedStatus;
    const matchesRequirements =
      selectedRequirements.length === 0 ||
      testCase.relatedRequirements.some((req) =>
        selectedRequirements.includes(req)
      );

    return (
      matchesSearch &&
      matchesType &&
      matchesPriority &&
      matchesStatus &&
      matchesRequirements
    );
  });

  const toggleTestCase = (id: string) => {
    setSelectedTestCases((prev) =>
      prev.includes(id)
        ? prev.filter((tcId) => tcId !== id)
        : [...prev, id]
    );
  };

  const toggleAllTestCases = () => {
    setSelectedTestCases((prev) =>
      prev.length === filteredTestCases.length
        ? []
        : filteredTestCases.map((tc) => tc.id)
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Test Cases
        </h1>
        <Button onClick={() => setShowNewForm(true)}>New Test Case</Button>
      </div>

      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedRequirements={selectedRequirements}
        onRequirementsChange={setSelectedRequirements}
        requirements={requirements}
      />

      {selectedTestCases.length > 0 && (
        <BulkActions
          selectedCount={selectedTestCases.length}
          onDelete={() => {/* Implement bulk delete */}}
          onStatusChange={() => {/* Implement bulk status change */}}
        />
      )}

      <div className="mt-6 grid gap-4">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <input
            type="checkbox"
            checked={
              filteredTestCases.length > 0 &&
              selectedTestCases.length === filteredTestCases.length
            }
            onChange={toggleAllTestCases}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Select All
          </span>
        </div>

        {filteredTestCases.map((testCase) => (
          <div key={testCase.id} className="flex items-start gap-4">
            <div className="pt-4">
              <input
                type="checkbox"
                checked={selectedTestCases.includes(testCase.id)}
                onChange={() => toggleTestCase(testCase.id)}
                className="h-4 w-4 rounded border-gray-300"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="flex-1">
              <TestCaseCard
                testCase={testCase}
                requirements={requirements.filter((req) =>
                  testCase.relatedRequirements.includes(req.id)
                )}
              />
            </div>
          </div>
        ))}

        {filteredTestCases.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-gray-600 dark:text-gray-400">
              No test cases found. Try adjusting your filters or create a new test
              case.
            </p>
          </div>
        )}
      </div>

      {showNewForm && (
        <Modal
          isOpen={showNewForm}
          onClose={() => setShowNewForm(false)}
          title="New Test Case"
        >
          <TestCaseForm
            onSubmit={async (data) => {
              const formData = new FormData();
              formData.append("intent", "create");
              formData.append("testCase", JSON.stringify(data));
              await fetch("/test-cases", {
                method: "POST",
                body: formData,
              });
              setShowNewForm(false);
            }}
            onCancel={() => setShowNewForm(false)}
            requirements={requirements}
          />
        </Modal>
      )}
    </div>
  );
}
