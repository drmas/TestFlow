import { json, type LoaderFunctionArgs, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getTestRun, updateTestRun } from "~/models/test-run.server";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";

export async function loader({ params }: LoaderFunctionArgs) {
  const testRun = await getTestRun(params.id as string);
  if (!testRun) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ testRun });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const updates = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    modifiedBy: "user1", // TODO: Get from session
    modifiedDate: new Date().toISOString(),
  };

  await updateTestRun(params.id as string, updates);
  return redirect(`/test-runs/${params.id}`);
}

export default function EditTestRun() {
  const { testRun } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Link
            to={`/test-runs/${testRun.id}`}
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            ← Back to Test Run
          </Link>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
          Edit Test Run
        </h1>
      </div>

      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Test Run Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form method="post" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={testRun.name}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={testRun.description}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full">
                  Update Test Run
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}