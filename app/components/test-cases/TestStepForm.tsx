import { Button } from "~/components/ui/Button";
import type { TestStep } from "~/models/types";

interface TestStepFormProps {
  steps: TestStep[];
  onChange: (steps: TestStep[]) => void;
}

export function TestStepForm({ steps, onChange }: TestStepFormProps) {
  const addStep = () => {
    const newStep: TestStep = {
      stepNumber: steps.length + 1,
      action: "",
      expectedResult: "",
    };
    onChange([...steps, newStep]);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    onChange(
      newSteps.map((step, i) => ({
        ...step,
        stepNumber: i + 1,
      }))
    );
  };

  const updateStep = (index: number, field: keyof TestStep, value: string) => {
    const newSteps = steps.map((step, i) =>
      i === index ? { ...step, [field]: value } : step
    );
    onChange(newSteps);
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700 md:grid-cols-2"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Action
            </label>
            <textarea
              value={step.action}
              onChange={(e) => updateStep(index, "action", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Expected Result
            </label>
            <textarea
              value={step.expectedResult}
              onChange={(e) =>
                updateStep(index, "expectedResult", e.target.value)
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              rows={2}
            />
          </div>
          <div className="col-span-full flex justify-end">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeStep(index)}
            >
              Remove Step
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={addStep}>
        Add Step
      </Button>
    </div>
  );
}
