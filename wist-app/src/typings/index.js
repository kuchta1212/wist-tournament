export var GameType;
(function (GameType) {
    GameType[GameType["FirstRound"] = 0] = "FirstRound";
    GameType[GameType["SecondRound"] = 1] = "SecondRound";
    GameType[GameType["ThirdRound"] = 2] = "ThirdRound";
    GameType[GameType["FinalRound"] = 3] = "FinalRound";
})(GameType || (GameType = {}));
export var RoundStatus;
(function (RoundStatus) {
    RoundStatus[RoundStatus["notStarted"] = 0] = "notStarted";
    RoundStatus[RoundStatus["betsAreSet"] = 1] = "betsAreSet";
    RoundStatus[RoundStatus["done"] = 2] = "done";
})(RoundStatus || (RoundStatus = {}));
export var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["notStarted"] = 0] = "notStarted";
    GameStatus[GameStatus["started"] = 1] = "started";
    GameStatus[GameStatus["finished"] = 2] = "finished";
})(GameStatus || (GameStatus = {}));
export var BetStatus;
(function (BetStatus) {
    BetStatus[BetStatus["notSet"] = 0] = "notSet";
    BetStatus[BetStatus["set"] = 1] = "set";
    BetStatus[BetStatus["withResult"] = 2] = "withResult";
})(BetStatus || (BetStatus = {}));
//# sourceMappingURL=index.js.map