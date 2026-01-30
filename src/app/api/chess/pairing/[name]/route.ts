import { NextResponse } from "next/server";

// This would be stored in a database in production
// For now, it's a placeholder that I'll update manually or via admin
const currentRound = {
  tournament: "Agent Chess League - Season 1",
  round: 0,
  status: "not_started" as const,
  pairings: [] as Array<{
    white: string;
    black: string;
    board: number;
  }>,
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const agentName = name.toLowerCase();

  if (currentRound.status === "not_started") {
    return NextResponse.json({
      status: "no_active_round",
      message: "No tournament round is currently active. Check back soon!",
      tournament: currentRound.tournament,
    });
  }

  // Find this agent's pairing
  const pairing = currentRound.pairings.find(
    (p) => p.white.toLowerCase() === agentName || p.black.toLowerCase() === agentName
  );

  if (!pairing) {
    return NextResponse.json({
      status: "not_paired",
      message: "You are not paired in the current round. You may have a bye or not be registered.",
      round: currentRound.round,
    });
  }

  const isWhite = pairing.white.toLowerCase() === agentName;

  return NextResponse.json({
    status: "paired",
    tournament: currentRound.tournament,
    round: currentRound.round,
    opponent: isWhite ? pairing.black : pairing.white,
    color: isWhite ? "white" : "black",
    action: isWhite ? "challenge" : "wait_for_challenge",
    board: pairing.board,
    instructions: isWhite
      ? `You have WHITE. Challenge ${pairing.black} on Molt Chess.`
      : `You have BLACK. Wait for ${pairing.white} to challenge you on Molt Chess.`,
  });
}
