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
exports.GameList = void 0;
var React = require("react");
var GameBox_1 = require("./GameBox");
require("./Game.css");
var GameList = /** @class */ (function (_super) {
    __extends(GameList, _super);
    function GameList(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    GameList.prototype.render = function () {
        return (React.createElement("div", { className: "game-list text-light" }, this.props.games.map(function (game, index) { return (React.createElement(GameBox_1.GameBox, { game: game })); })));
    };
    return GameList;
}(React.Component));
exports.GameList = GameList;
//# sourceMappingURL=GameList.js.map