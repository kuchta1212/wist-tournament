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
exports.TournamentControlPanel = void 0;
var React = require("react");
var TournamentControlPanel = /** @class */ (function (_super) {
    __extends(TournamentControlPanel, _super);
    function TournamentControlPanel(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            send: false,
            name: "",
            selectedUsers: []
        };
        return _this;
    }
    TournamentControlPanel.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col" },
                React.createElement("button", { type: "button", className: "btn btn-secondary", onClick: function () { return _this.createNextRound(); } }, "Dal\u0161\u00ED kolo")),
            React.createElement("div", { className: "col" },
                React.createElement("button", { type: "button", className: "btn btn-secondary", onClick: function () { return _this.createFinalRound(); } }, "Fin\u00E1ln\u00ED kolo")),
            React.createElement("div", { className: "col" },
                React.createElement("button", { type: "button", className: "btn btn-secondary", onClick: function () { return _this.delete(); } }, "Smazat")),
            React.createElement("div", { className: "col" },
                React.createElement("button", { type: "button", className: "btn btn-secondary", onClick: function () { return _this.addParticipant(); } }, "P\u0159idat \u00FA\u010Dastn\u00EDka")),
            React.createElement("div", { className: "col" },
                React.createElement("button", { type: "button", className: "btn btn-secondary", onClick: function () { return _this.removeParticipant(); } }, "Odebrat \u00FA\u010Dastn\u00EDka")),
            React.createElement("div", { className: "col" },
                React.createElement("button", { type: "button", className: "btn btn-success", onClick: function () { return _this.removeParticipant(); } }, "LIVE"))));
    };
    TournamentControlPanel.prototype.createNextRound = function () {
    };
    TournamentControlPanel.prototype.createFinalRound = function () {
    };
    TournamentControlPanel.prototype.delete = function () {
    };
    TournamentControlPanel.prototype.addParticipant = function () {
    };
    TournamentControlPanel.prototype.removeParticipant = function () {
    };
    return TournamentControlPanel;
}(React.Component));
exports.TournamentControlPanel = TournamentControlPanel;
//# sourceMappingURL=TournamentControlPanel.js.map