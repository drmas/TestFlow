import { Button } from "~/components/ui/Button";
import type { Requirement, Tag } from "@prisma/client";

interface RequirementFormProps {
  requirement?: Requirement & { tags: Tag[] };
  onSubmit: () => void;
  onCancel: () => void;
}

export function RequirementForm({
  requirement,
  onCancel,
}: RequirementFormProps) {
  
  return (
    <div className="max-h-[calc(100vh-16rem)] overflow-y-auto px-1">
      <form method="post" className="space-y-6">
        <input
          type="hidden"
          name="intent"
          value={requirement ? "update" : "create"}
        />
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="title"
          >
            Title *
          </label>
          <input
            type="text"
            defaultValue={requirement?.title}
            required
            name="title"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="description"
          >
            Description *
          </label>
          <textarea
            defaultValue={requirement?.description}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            rows={3}
            name="description"
            required
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="category"
          >
            Category *
          </label>
          <input
            type="text"
            name="category"
            defaultValue={requirement?.category}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor="priority"
            >
              Priority
            </label>
            <select
              defaultValue={requirement?.priority}
              name="priority"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor="status"
            >
              Status
            </label>
            <select
              defaultValue={requirement?.status}
              name="status"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="Draft">Draft</option>
              <option value="In Review">In Review</option>
              <option value="Approved">Approved</option>
              <option value="Deprecated">Deprecated</option>
            </select>
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="tags"
          >
            Tags
          </label>
          <div className="mt-1 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                name="tags"
                placeholder="Add a tag"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                defaultValue={requirement?.tags.map((tag) => tag.name).join(",")}
              />
            </div>
          </div>
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="version"
          >
            Version
          </label>
          <input
            type="text"
            name="version"
            defaultValue={requirement?.version}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>

        <div className="sticky bottom-0 flex justify-end gap-4 border-t border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-gray-800">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {requirement ? "Update" : "Create"} Requirement
          </Button>
        </div>
      </form>
    </div>
  );
}
