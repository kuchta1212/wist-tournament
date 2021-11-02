"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameBox = void 0;
var React = require("react");
var index_1 = require("../../typings/index");
var GameBox = /** @class */ (function (_super) {
    __extends(GameBox, _super);
    function GameBox(props) {
        return _super.call(this, props) || this;
    }
    GameBox.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: "card game-box bg-info", onClick: function () { return _this.openGame(); } },
            React.createElement("div", { className: "card-body" },
                React.createElement("h6", { className: "card-subtitle mb-2 text-dark" }, this.gameTypeToText(this.props.game.type)),
                this.renderPlayers(),
                React.createElement("h6", null,
                    "Odehr\u00E1no: ",
                    this.props.game.rounds.filter(function (round) { return round.isDone; }).length,
                    "/16"))));
    };
    GameBox.prototype.renderPlayers = function () {
        return (React.createElement("p", null, this.props.game.players.map(function (player, index) { return (player.participant.user.name + " "); })));
    };
    GameBox.prototype.gameTypeToText = function (gameType) {
        switch (gameType) {
            case index_1.GameType.FirstRound:
                return "První kolo";
            case index_1.GameType.SecondRound:
                return "Druhé kolo";
            case index_1.GameType.ThirdRound:
                return "Třetí kolo";
            case index_1.GameType.FinalRound:
                return "Finálové kolo";
        }
    };
    GameBox.prototype.openGame = function () {
    };
    return GameBox;
}(React.Component));
exports.GameBox = GameBox;
//# sourceMappingURL=GameBox.js.map