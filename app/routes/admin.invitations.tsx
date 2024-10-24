import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { getUser } from "~/lib/session.server";
import { createInvitation } from "~/models/invitation.server";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user || user.role !== "Admin") {
    return redirect("/login");
  }
  return json({ user });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user || user.role !== "Admin") {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const invitation = await createInvitation(user.id);
  return json({ invitation });
};

export default function AdminInvitations() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Generate Invitation</h1>
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Generate New Invitation
        </button>
      </Form>
    </div>
  );
}
