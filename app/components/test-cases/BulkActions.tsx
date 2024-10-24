import { Button } from "~/components/ui/Button";

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onStatusChange: () => void;
}

export function BulkActions({ selectedCount, onDelete, onStatusChange }: BulkActionsProps) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {selectedCount} test case{selectedCount !== 1 ? "s" : ""} selected
      </span>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onStatusChange}>
          Change Status
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          Delete Selected
        </Button>
      </div>
    </div>
  );
}
