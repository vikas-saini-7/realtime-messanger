import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();

    if (body.type === "user.created") {
      const user = body.data;

      await ctx.runMutation(api.users.createUser, {
        clerkId: user.id,
        name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
        email: user.email_addresses?.[0]?.email_address ?? "",
        image: user.image_url,
      });
    }

    return new Response("OK");
  }),
});

export default http;
