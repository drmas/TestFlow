import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import bcrypt from "bcryptjs";

import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserId } from "~/lib/session.server";
import { validateInvitation, useInvitation } from "~/models/invitation.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");

  const url = new URL(request.url);
  const inviteCode = url.searchParams.get("invite");
  if (!inviteCode) return redirect("/login");

  const isValidInvite = await validateInvitation(inviteCode);
  if (!isValidInvite) return redirect("/login");

  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const inviteCode = formData.get("inviteCode");

  if (!email || !password || !firstName || !lastName || !inviteCode) {
    return json(
      { 
        errors: { 
          email: !email ? "Email is required" : null,
          password: !password ? "Password is required" : null,
          firstName: !firstName ? "First name is required" : null,
          lastName: !lastName ? "Last name is required" : null,
          inviteCode: !inviteCode ? "Invite code is required" : null,
        } 
      },
      { status: 400 }
    );
  }

  const isValidInvite = await validateInvitation(inviteCode.toString());
  if (!isValidInvite) {
    return json(
      { errors: { inviteCode: "Invalid invitation code" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email.toString());
  if (existingUser) {
    return json(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  const user = await createUser({
    email: email.toString(),
    password: await bcrypt.hash(password.toString(), 10),
    firstName: firstName.toString(),
    lastName: lastName.toString(),
    username: email.toString().split("@")[0],
    role: "User",
    status: "Active",
  });

  await useInvitation(inviteCode.toString());

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo: "/",
  });
}

export default function Register() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors?.firstName) {
      firstNameRef.current?.focus();
    } else if (actionData?.errors?.lastName) {
      lastNameRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Create your account
          </h2>
        </div>
        <Form method="post" className="mt-8 space-y-6">
          <input type="hidden" name="inviteCode" value={searchParams.get("invite") || ""} />
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                ref={passwordRef}
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="firstName" className="sr-only">
                First Name
              </label>
              <input
                ref={firstNameRef}
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                className="relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="First Name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">
                Last Name
              </label>
              <input
                ref={lastNameRef}
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Last Name"
              />
            </div>
          </div>

          {actionData?.errors && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">There were errors with your submission</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc space-y-1 pl-5">
                      {Object.values(actionData.errors).map(
                        (error) => error && <li key={error}>{error}</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Register
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
