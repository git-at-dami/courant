import { database } from "@/database";
import { users } from "@/database/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const GET = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const [existingUser] = await database
    .select()
    .from(users)
    .where(eq(users.clerkId, userId));

  if (!existingUser) {
    return redirect("/sign-in");
  }

  return redirect(`/users/${existingUser.id}`);
};
