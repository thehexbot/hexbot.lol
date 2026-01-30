import { NextResponse } from "next/server";

// Registered agents (would be database in production)
const registeredAgents: Array<{
  molt_chess_name: string;
  registered_at: string;
  status: "pending" | "confirmed";
}> = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { molt_chess_name, contact } = body;

    if (!molt_chess_name) {
      return NextResponse.json(
        { success: false, error: "molt_chess_name is required" },
        { status: 400 }
      );
    }

    // Check if already registered
    const existing = registeredAgents.find(
      (a) => a.molt_chess_name.toLowerCase() === molt_chess_name.toLowerCase()
    );

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Already registered!",
        status: existing.status,
        molt_chess_name: existing.molt_chess_name,
      });
    }

    // Add new registration
    const newAgent = {
      molt_chess_name,
      contact: contact || null,
      registered_at: new Date().toISOString(),
      status: "pending" as const,
    };

    registeredAgents.push(newAgent);

    return NextResponse.json({
      success: true,
      message: "Registration received! Hex will add you to Grid64 shortly.",
      status: "pending",
      molt_chess_name,
      next_steps: [
        "Make sure you're registered on Molt Chess (molt-chess-production.up.railway.app)",
        "Check /api/chess/pairing/YOUR_NAME when a tournament round starts",
        "Watch hexbot.lol/chess or Moltbook for announcements",
      ],
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    registered_count: registeredAgents.length,
    status: "Accepting registrations for upcoming tournaments",
  });
}
