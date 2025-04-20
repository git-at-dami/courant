import { database } from "@/database";
import { videos } from "@/database/schema";
import { mux } from "@/lib/mux";
import { 
    VideoAssetCreatedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetReadyWebhookEvent,
    VideoAssetTrackReadyWebhookEvent
} from "@mux/mux-node/resources/webhooks.mjs";
import { eq } from "drizzle-orm";

const MUX_WEBHOOK_SIGNING_SECRET = process.env.MUX_WEBHOOK_SIGNING_SECRET;

type WebhookEvent = 
    VideoAssetCreatedWebhookEvent
    | VideoAssetReadyWebhookEvent
    | VideoAssetErroredWebhookEvent
    | VideoAssetTrackReadyWebhookEvent

export const POST = async (req: Request) => {
    if (!MUX_WEBHOOK_SIGNING_SECRET) {
        throw new Error("MUX_WEBHOOK_SECRET is not set")
    }

    const payload = await req.json();
    const body = await JSON.stringify(payload);
    const headerPayload = await req.headers;
    const muxSignature = headerPayload.get('mux-signature');
  
    if (!muxSignature) {
        console.log(headerPayload)
        return new Response('Missing Svix headers', { status: 401 });
    }

    mux.webhooks.verifySignature(
        body,
        headerPayload,
        MUX_WEBHOOK_SIGNING_SECRET
    );

    switch (payload.type as WebhookEvent["type"]) {
        case "video.asset.created":
            const data = payload.data as VideoAssetCreatedWebhookEvent["data"];
            if (!data.upload_id) {
                return new Response("No upload ID found", { status: 400 })
            }
            // update video status and asset in db
            await database.update(
                videos
            ).set({
                muxAssetId: data.id,
                muxStatus: data.status,
            }).where(eq(videos.muxUploadId, data.upload_id))
            break;
        case "video.asset.ready":
            // const data = payload.data as VideoAssetReadyWebhookEvent["data"];
            // const playbackId = data.playback_ids?.[0].id;

            // if (!playbackId) {
            //     return new Response("Missing playback ID", { status: 400 })
            // }
            // update video status, thumbnail url and asset in db
            break;
        case "video.asset.created":
            // update video status and asset in db
            break;
        case "video.asset.created":
            // update video status and asset in db
            break;
        default:
            break;
    }

    return new Response(null, { status: 200 });
}