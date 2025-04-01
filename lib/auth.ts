import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const COOKIE_NAME = "auth_token";

export async function getSession() {
  const cookieStore = await cookies(); // ✅ No need for `await` here
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = verify(token, JWT_SECRET) as { user: any };
    return verified;
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}

export async function login(token: string) {
  "use server"; // ✅ Ensure this is a Server Action

  const cookieStore = await cookies();
  cookieStore.set( // ✅ No need for `await` in `set()`
    COOKIE_NAME,
    token,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    }
  );

  return { success: true };
}

export async function logout() {
  "use server";

  const cookieStore =await cookies();
  cookieStore.set(
    COOKIE_NAME,
    "", // Empty value to clear cookie
    { expires: new Date(0), path: "/" } // ✅ Correct way to delete cookie
  );

  return { success: true };
}