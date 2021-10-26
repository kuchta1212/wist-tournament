"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
var HttpClient_1 = require("./HttpClient");
var ResponseConvertor_1 = require("./ResponseConvertor");
var API_URL = '/api';
var Api = /** @class */ (function () {
    function Api() {
    }
    Api.prototype.getUsers = function () {
        return ResponseConvertor_1.convert(HttpClient_1.get(API_URL + "/users"));
    };
    Api.prototype.createUser = function (name) {
        return ResponseConvertor_1.convert(HttpClient_1.post(API_URL + "/users/" + name));
    };
    Api.prototype.createTournament = function (name, userIds) {
        return ResponseConvertor_1.convert(HttpClient_1.post(API_URL + "/tournament?name=" + name, userIds));
    };
    Api.prototype.createNextRound = function (tournamentId) {
        return ResponseConvertor_1.convert(HttpClient_1.post(API_URL + "/tournament/next?tournamentId=" + tournamentId));
    };
    Api.prototype.createFinalRound = function (tournamentId) {
        return ResponseConvertor_1.convert(HttpClient_1.post(API_URL + "/tournament/final?tournamentId=" + tournamentId));
    };
    Api.prototype.deleteTournament = function (tournamentId) {
        return ResponseConvertor_1.convert(HttpClient_1.del(API_URL + "/tournament/"));
    };
    Api.prototype.getTournament = function (tournamentId) {
        return ResponseConvertor_1.convert(HttpClient_1.get(API_URL + "/tournaments/" + tournamentId));
    };
    Api.prototype.getTournaments = function () {
        return ResponseConvertor_1.convert(HttpClient_1.get(API_URL + "/tournaments"));
    };
    Api.prototype.removeParticipant = function (tournamentId, userId) {
        return ResponseConvertor_1.convert(HttpClient_1.del(API_URL + "/tournament/" + tournamentId + "/participant/remove?userId=" + userId));
    };
    Api.prototype.addParticipant = function (tournamentId, userId) {
        return ResponseConvertor_1.convert(HttpClient_1.post(API_URL + "/tournament/" + tournamentId + "/participant/add?userId=" + userId));
    };
    Api.prototype.setGameOrder = function (order, gameId) {
        return ResponseConvertor_1.convert(HttpClient_1.post(API_URL + "/tournament/game/" + gameId + "/order", order));
    };
    Api.prototype.getGame = function (gameId) {
        return ResponseConvertor_1.convert(HttpClient_1.get(API_URL + "/tournament/game/" + gameId));
    };
    Api.prototype.setBets = function (roundId, bets) {
        return ResponseConvertor_1.convert(HttpClient_1.post(API_URL + "/tournament/game/round/" + roundId + "/bets", bets));
    };
    Api.prototype.setBetsResult = function (roundId, betsResults) {
        return ResponseConvertor_1.convert(HttpClient_1.post(API_URL + "/tournament/game/round/" + roundId + "/bets/results", betsResults));
    };
    Api.prototype.getGameResults = function (gameId) {
        return ResponseConvertor_1.convert(HttpClient_1.get(API_URL + "/tournament/game/" + gameId + "/result"));
    };
    return Api;
}());
exports.Api = Api;
//# sourceMappingURL=Api.js.map