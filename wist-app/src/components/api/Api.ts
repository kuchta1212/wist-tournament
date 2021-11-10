﻿import { User, Tournament, Game } from "../../typings";
import { Dictionary } from "../../typings/Dictionary"
import { IApi } from "./IApi";
import { get, post, del } from "./HttpClient";
import { convert } from "./ResponseConvertor"
import { Bet, Round } from "../../typings/index";

const API_URL = '/api';

export class Api implements IApi {
    async tournamentFinish(tournamentId: string): Promise<void> {
        await post(`${API_URL}/tournament/${tournamentId}/finish`);
    }
    getRound(roundId: string): Promise<Round> {
        return convert<Round>(get(`${API_URL}/tournament/game/round/${roundId}`));
    }
    getUsers(): Promise<User[]> {
        return convert<User[]>(get(`${API_URL}/users`));
    }
    async createUser(name: string): Promise<void> {
        await post(`${API_URL}/users/${name}`);
    }
    async createTournament(name: string, userIds: string[]): Promise<void> {
        post(`${API_URL}/tournament?name=${name}`, userIds);
    }
    async createNextRound(tournamentId: string): Promise<void> {
        await post(`${API_URL}/tournament/next?tournamentId=${tournamentId}`);
    }
    async createFinalRound(tournamentId: string): Promise<void> {
        await post(`${API_URL}/tournament/final?tournamentId=${tournamentId}`);
    }
    async deleteTournament(tournamentId: string): Promise<void> {
        await del(`${API_URL}/tournament/${tournamentId}`);
    }
    getTournament(tournamentId: string): Promise<Tournament> {
        return convert<Tournament>(get(`${API_URL}/tournaments/${tournamentId}`));
    }
    getTournaments(): Promise<Tournament[]> {
        return convert<Tournament[]>(get(`${API_URL}/tournaments`));
    }
    async removeParticipant(tournamentId: string, participantId: string): Promise<void> {
        await del(`${API_URL}/tournament/${tournamentId}/participant/remove?participantId=${participantId}`);
    }
    async addParticipant(tournamentId: string, userId: string): Promise<void> {
        await post(`${API_URL}/tournament/${tournamentId}/participant/add?userId=${userId}`);
    }
    async setGameOrder(order: Dictionary<number>, gameId: string): Promise<void> {
        await post(`${API_URL}/tournament/game/${gameId}/order`, order.getHashMap());
    }
    getGame(gameId: string): Promise<Game> {
        return convert<Game>(get(`${API_URL}/tournament/game/${gameId}`));
    }
    async setBets(roundId: string, bets: Dictionary<number>): Promise<void> {
        await post(`${API_URL}/tournament/game/round/${roundId}/bets`, bets.getHashMap());
    }
    async setBetsResult(roundId: string, betsResults: Dictionary<boolean>): Promise<void> {
        await post(`${API_URL}/tournament/game/round/${roundId}/bets/results`, betsResults.getHashMap());
    }
    getGameResults(gameId: string): Promise<any> {
        return convert<any>(get(`${API_URL}/tournament/game/${gameId}/result`));
    }
}