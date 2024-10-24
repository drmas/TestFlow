import { json, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { useState } from "react";

export async function loader() {
  return json({ theme: (globalThis as any).currentTheme || "light" });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const theme = formData.get("theme") as "light" | "dark";
  (globalThis as any).currentTheme = theme;
  return json({ success: true });
}

export default function Settings() {
  const { theme } = useLoaderData<typeof loader>();
  const [notifications, setNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Notifications
            </h2>
            <div className="mt-4 space-y-4">
              <ToggleSwitch
                label="Enable notifications"
                checked={notifications}
                onChange={setNotifications}
              />
              <ToggleSwitch
                label="Daily email digest"
                checked={emailDigest}
                onChange={setEmailDigest}
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Appearance
            </h2>
            <div className="mt-4">
              <Form method="post">
                <input 
                  type="hidden" 
                  name="theme" 
                  value={theme === "light" ? "dark" : "light"} 
                />
                <ToggleSwitch
                  label="Dark mode"
                  checked={theme === "dark"}
                  onChange={() => {
                    const form = document.querySelector('form');
                    if (form instanceof HTMLFormElement) {
                      form.submit();
                    }
                  }}
                />
              </Form>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Account
            </h2>
            <div className="mt-4 flex flex-col space-y-4">
              <button className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                Change Password
              </button>
              <button className="w-full rounded-md border border-red-300 bg-white px-4 py-2 text-red-700 hover:bg-red-50 dark:border-red-600 dark:bg-gray-700 dark:text-red-300 dark:hover:bg-red-900">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="relative flex cursor-pointer items-center">
      <div className="relative">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
        <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all peer-checked:translate-x-full"></div>
      </div>
      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
        {label}
      </span>
    </label>
  );
}