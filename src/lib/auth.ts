import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-in-prod";

export async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (token) {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      return payload as { id: string; email: string };
    } catch (error) {
      // If custom token fails, proceed to check NextAuth session
    }
  }

  // Check NextAuth session as fallback
  try {
    const session = await getServerSession(authOptions);
    if (session?.user) {
      return { 
        id: (session.user as any).id, 
        email: session.user.email as string 
      };
    }
  } catch (error) {
    return null;
  }

  return null;
}
