import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getUser } from "~/lib/session.server";
import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Modal } from "~/components/ui/Modal";
import { RequirementForm } from "~/components/requirements/RequirementForm";
import {
  createRequirement,
  getRequirements,
} from "~/models/requirement.server";
import type { Requirement } from "~/models/types";
import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "~/lib/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (!user) {
    return redirect("/login");
  }
  const requirements = await getRequirements();
  return json({ user, requirements });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) {
    return redirect("/login");
  }
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create") {
    try {
      const tags = (formData.get("tags") as string)
        .split(",")
        .map((tag) => tag.trim());

      const savedTags = [];
      for (const tag of tags) {
        const savedTag = await prisma.tag.upsert({
          where: { name: tag },
          update: {},
          create: { name: tag },
          select: { id: true },
        });
        savedTags.push(savedTag.id);
      }
      await createRequirement({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        priority: formData.get("priority") as Requirement["priority"],
        status: formData.get("status") as Requirement["status"],
        category: formData.get("category") as string,
        version: formData.get("version") as string,
        createdById: user.id,
        tags: savedTags,
      });
      return json({ success: true });
    } catch (error) {
      console.error(error);
      return json({ error: (error as Error).message }, { status: 400 });
    }
  }

  return null;
};

export default function Requirements() {
  const { requirements } = useLoaderData<typeof loader>();
  const [showNewForm, setShowNewForm] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Requirements
        </h1>
        <Button onClick={() => setShowNewForm(true)}>New Requirement</Button>
      </div>

      <div className="grid gap-4">
        {requirements.map((req) => (
          <Link key={req.id} to={`/requirements/${req.id}`}>
            <Card className="transition-shadow hover:shadow-md p-4">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {req.title}
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {req.id}
                </span>
              </div>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                {req.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {req.tags.map((tag, index) => (
                    <Badge key={`${req.id}-tag-${index}`} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                {req.priority && (
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        req.priority === "High" ? "destructive" : "outline"
                      }
                    >
                      {req.priority}
                    </Badge>
                    <Badge variant="default">{req.status}</Badge>
                  </div>
                )}
              </div>
            </Card>
          </Link>
        ))}

        {requirements.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-gray-600 dark:text-gray-400">
              No requirements found. Create your first requirement to get
              started.
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={showNewForm}
        onClose={() => setShowNewForm(false)}
        title="New Requirement"
      >
        <RequirementForm
          onSubmit={() => {
            setShowNewForm(false);
          }}
          onCancel={() => setShowNewForm(false)}
        />
      </Modal>
    </div>
  );
}
