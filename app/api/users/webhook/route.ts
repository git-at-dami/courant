import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { database } from "@/database";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

const CLERK_WEBHOOK_USER_SYNC_SIGNING_SECRET =
  process.env.CLERK_WEBHOOK_USER_SYNC_SIGNING_SECRET;

export async function POST(req: Request) {
  if (!CLERK_WEBHOOK_USER_SYNC_SIGNING_SECRET) {
    throw new Error(
      "CLERK_WEBHOOK_USER_SYNC_SIGNING_SECRET is not set in the environment variables.",
    );
  }

  const payload = await req.text();
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const svix = new Webhook(CLERK_WEBHOOK_USER_SYNC_SIGNING_SECRET);

  let evt: WebhookEvent | null = null;

  try {
    evt = svix.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  const { type, data } = evt;

  if (!data.id) {
    return new Response("Error processing webhook event", { status: 500 });
  }

  try {
    switch (type) {
      case "user.created":
        await database.insert(users).values({
          clerkId: data.id,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: `${data.image_url}`,
        });
        break;
      case "user.updated":
        await database
          .update(users)
          .set({
            name: `${data.first_name} ${data.last_name}`,
            imageUrl: `${data.image_url}`,
          })
          .where(eq(users.clerkId, data.id));
      case "user.deleted":
        database.delete(users).where(eq(users.clerkId, data.id));
        break;
    }

    return new Response(null, { status: 200 });
  } catch (error: any) {
    console.error("Error processing webhook event:", error);
    return new Response("Error processing webhook event", { status: 500 });
  }
}

// disable the bodyParser for this route
// to handle the raw body directly (which is what svix needs).
export const config = {
  api: {
    bodyParser: false,
  },
};
