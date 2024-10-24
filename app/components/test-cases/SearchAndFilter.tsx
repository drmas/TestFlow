import { Button } from "~/components/ui/Button";
import type { Requirement } from "~/models/types";

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedPriority: string;
  onPriorityChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedRequirements: string[];
  onRequirementsChange: (value: string[]) => void;
  requirements: Requirement[];
}

export function SearchAndFilter({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange,
  selectedRequirements,
  onRequirementsChange,
  requirements,
}: SearchAndFilterProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search test cases..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            onSearchChange("");
            onTypeChange("");
            onPriorityChange("");
            onStatusChange("");
            onRequirementsChange([]);
          }}
        >
          Clear Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="">All Types</option>
          <option value="Functional">Functional</option>
          <option value="Integration">Integration</option>
          <option value="Performance">Performance</option>
          <option value="Security">Security</option>
        </select>

        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="In Review">In Review</option>
          <option value="Approved">Approved</option>
          <option value="Deprecated">Deprecated</option>
        </select>

        <select
          multiple
          value={selectedRequirements}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, (option) => option.value);
            onRequirementsChange(selected);
          }}
          className="rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
        >
          {requirements.map((req) => (
            <option key={req.id} value={req.id}>
              {req.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}