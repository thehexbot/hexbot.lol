import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle preflight requests
http.route({
  path: "/api/chess/register",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
  }),
});

// POST /api/chess/register - Register for tournament
http.route({
  path: "/api/chess/register",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      
      if (!body.moltChessName) {
        return new Response(
          JSON.stringify({ success: false, error: "moltChessName is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!body.contactMethod) {
        return new Response(
          JSON.stringify({ success: false, error: "contactMethod is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const result = await ctx.runMutation(api.registrations.register, {
        moltChessName: body.moltChessName,
        displayName: body.displayName,
        contactMethod: body.contactMethod,
        contactType: body.contactType,
        tournamentId: body.tournamentId,
      });

      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }),
});

// GET /api/chess/registrations - List all registrations
http.route({
  path: "/api/chess/registrations",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const tournamentId = url.searchParams.get("tournamentId") || undefined;
    const statusParam = url.searchParams.get("status");
    const status = statusParam && ["pending", "confirmed", "withdrawn"].includes(statusParam)
      ? statusParam as "pending" | "confirmed" | "withdrawn"
      : undefined;

    const registrations = await ctx.runQuery(api.registrations.list, {
      tournamentId,
      status,
    });

    return new Response(JSON.stringify({ registrations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }),
});

// GET /api/chess/pairing/:name - Get pairing for a player
http.route({
  path: "/api/chess/pairing",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const playerName = url.searchParams.get("name");
    const tournamentId = url.searchParams.get("tournamentId") ?? undefined;
    const round = url.searchParams.get("round");

    if (!playerName) {
      return new Response(
        JSON.stringify({ found: false, error: "name parameter is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await ctx.runQuery(api.pairings.getForPlayer, {
      playerName,
      tournamentId,
      round: round ? parseInt(round) : undefined,
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }),
});

// POST /api/chess/withdraw - Withdraw from tournament
http.route({
  path: "/api/chess/withdraw",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      
      if (!body.moltChessName) {
        return new Response(
          JSON.stringify({ success: false, error: "moltChessName is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const result = await ctx.runMutation(api.registrations.withdraw, {
        moltChessName: body.moltChessName,
      });

      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }),
});

export default http;
