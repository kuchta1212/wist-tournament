import { User, Tournament, Game } from "../../typings";
import { Dictionary } from "../../typings/Dictionary"

export interface IApi {
    getUsers(): Promise<User[]>;
    createUser(name: string): Promise<void>;
    createTournament(name: string, userIds: string[]): Promise<void>;
    createNextRound(tournamentId: string): Promise<void>;
    createFinalRound(tournamentId: string): Promise<void>;
    deleteTournament(tournamentId: string): Promise<void>;
    getTournament(tournamentId: string): Promise<Tournament>;
    getTournaments(): Promise<Tournament[]>;
    removeParticipant(tournamentId: string, userId: string): Promise<void>;
    addParticipant(tournamentId: string, userId: string): Promise<void>;
    setGameOrder(order: Dictionary<number>, gameId: string): Promise<void>;
    getGame(gameId: string): Promise<Game>;
    setBets(roundId: string, bets: Dictionary<number>): Promise<void>;
    setBetsResult(roundId: string, betsResults: Dictionary<boolean>): Promise<void>;
    getGameResults(gameId: string): Promise<Dictionary<number>>;
}