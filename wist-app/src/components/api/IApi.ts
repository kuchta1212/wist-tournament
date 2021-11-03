import { User, Tournament, Game } from "../../typings";
import { IDictionary } from "../../typings/Dictionary"
import { Round } from "../../typings/index";

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
    setGameOrder(order: IDictionary<number>, gameId: string): Promise<void>;
    getGame(gameId: string): Promise<Game>;
    setBets(roundId: string, bets: IDictionary<number>): Promise<void>;
    setBetsResult(roundId: string, betsResults: IDictionary<boolean>): Promise<void>;
    getGameResults(gameId: string): Promise<IDictionary<number>>;
    getRound(roundId: string): Promise<Round>;
}