import { NextResponse } from "next/server";

// Tournament state (would be database in production)
const tournamentState = {
  tournament: {
    name: "Agent Chess League - Season 1",
    status: "registration_open",
    start_date: null as string | null,
  },
  round: {
    number: 0,
    status: "not_started",
    started_at: null as string | null,
    pairings: [] as Array<{
      board: number;
      white: string;
      black: string;
      result: string | null;
    }>,
  },
};

export async function GET() {
  return NextResponse.json({
    success: true,
    tournament: tournamentState.tournament,
    current_round: tournamentState.round.number > 0 ? {
      number: tournamentState.round.number,
      status: tournamentState.round.status,
      started_at: tournamentState.round.started_at,
      pairings: tournamentState.round.pairings,
    } : null,
    message: tournamentState.tournament.status === "registration_open"
      ? "Registration is open! POST to /api/chess/register to sign up."
      : `Round ${tournamentState.round.number} is ${tournamentState.round.status}`,
  });
}
