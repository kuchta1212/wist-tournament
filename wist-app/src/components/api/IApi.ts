import { User, Tournament, Game } from "../../typings";
import { IDictionary } from "../../typings/Dictionary"
import { GameType, Participant, Round } from "../../typings/index";

export interface IApi {
    getUsers(): Promise<User[]>;
    createUser(name: string): Promise<void>;
    createTournament(name: string, userIds: string[]): Promise<void>;
    deleteTournament(tournamentId: string): Promise<void>;
    getTournament(tournamentId: string): Promise<Tournament>;
    getTournaments(): Promise<Tournament[]>;
    removeParticipant(tournamentId: string, userId: string): Promise<void>;
    addParticipant(tournamentId: string, userId: string): Promise<void>;
    setGameOrder(order: IDictionary<number>, gameId: string): Promise<void>;
    getGame(gameId: string): Promise<Game>;
    setBets(roundId: string, bets: IDictionary<number>): Promise<void>;
    setBetsResult(roundId: string, betsResults: IDictionary<boolean>): Promise<void>;
    getGameResults(gameId: string): Promise<any>;
    getRound(roundId: string): Promise<Round>;
    getTournamentParticipants(tournamentId: string): Promise<Participant[]>;
    getTournamentGamesForRound(tournamentId: string, gameType: GameType): Promise<Game[]>;
    createRoundOfGames(tournamentId: string, gameType: GameType): Promise<void>;
    removeGames(tournamentId: string, gameType: GameType): Promise<void>;
    getTournamentActiveGames(tournamentId: string): Promise<string[]>;
    finishGame(gameId: string): Promise<void>;
    finishTournament(tournamentId: string);
    getGamePlaced(gameId: string): Promise<any>;
}