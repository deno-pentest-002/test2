import { serve } from "https://deno.land/std/http/server.ts";

const handler = (request: Request): Response => {
  return new Response("Hello, World!", {
    headers: { "content-type": "text/plain" },
  });
};

serve(handler);
