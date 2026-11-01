"use server";

import { redirect } from "next/navigation";
import { getSession, verifyAdminPassword } from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!password) {
    return { error: "Password is required." };
  }

  const valid = await verifyAdminPassword(password);
  if (!valid) {
    return { error: "Invalid password." };
  }

  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();

  redirect("/admin");
}

export async function logoutAction() {
  const session = await getSession();
  session.isLoggedIn = false;
  await session.destroy();
  redirect("/admin/login");
}
