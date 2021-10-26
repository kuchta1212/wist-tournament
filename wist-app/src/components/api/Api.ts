import { User, Tournament, Game } from "../../typings";
import { Dictionary } from "../../typings/Dictionary"
import { IApi } from "./IApi";
import { get, post, del } from "./HttpClient";
import { convert } from "./ResponseConvertor"

const API_URL = '/api';

export class Api implements IApi {
    getUsers(): Promise<User[]> {
        return convert<User[]>(get(`${API_URL}/users`));
    }
    createUser(name: string): Promise<void> {
        return convert<void>(post(`${API_URL}/users/${name}`));
    }
    createTournament(name: string, userIds: string[]): Promise<void> {
        return convert<void>(post(`${API_URL}/tournament?name=${name}`, userIds));
    }
    createNextRound(tournamentId: string): Promise<void> {
        return convert<void>(post(`${API_URL}/tournament/next?tournamentId=${tournamentId}`));
    }
    createFinalRound(tournamentId: string): Promise<void> {
        return convert<void>(post(`${API_URL}/tournament/final?tournamentId=${tournamentId}`));
    }
    deleteTournament(tournamentId: string): Promise<void> {
        return convert<void>(del(`${API_URL}/tournament/`));
    }
    getTournament(tournamentId: string): Promise<Tournament> {
        return convert<Tournament>(get(`${API_URL}/tournaments/${tournamentId}`));
    }
    getTournaments(): Promise<Tournament[]> {
        return convert<Tournament[]>(get(`${API_URL}/tournaments`));
    }
    removeParticipant(tournamentId: string, userId: string): Promise<void> {
        return convert<void>(del(`${API_URL}/tournament/${tournamentId}/participant/remove?userId=${userId}`));
    }
    addParticipant(tournamentId: string, userId: string): Promise<void> {
        return convert<void>(post(`${API_URL}/tournament/${tournamentId}/participant/add?userId=${userId}`));
    }
    setGameOrder(order: Dictionary<number>, gameId: string): Promise<void> {
        return convert<void>(post(`${API_URL}/tournament/game/${gameId}/order`, order));
    }
    getGame(gameId: string): Promise<Game> {
        return convert<Game>(get(`${API_URL}/tournament/game/${gameId}`));
    }
    setBets(roundId: string, bets: Dictionary<number>): Promise<void> {
        return convert<void>(post(`${API_URL}/tournament/game/round/${roundId}/bets`, bets));
    }
    setBetsResult(roundId: string, betsResults: Dictionary<boolean>): Promise<void> {
        return convert<void>(post(`${API_URL}/tournament/game/round/${roundId}/bets/results`, betsResults));
    }
    getGameResults(gameId: string): Promise<Dictionary<number>> {
        return convert<Dictionary<number>>(get(`${API_URL}/tournament/game/${gameId}/result`));
    }
}