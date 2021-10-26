"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dictionary = void 0;
var Dictionary = /** @class */ (function () {
    function Dictionary() {
        this.hashMap = {};
    }
    Dictionary.prototype.get = function (key) {
        return this.hashMap[key];
    };
    Dictionary.prototype.put = function (key, value) {
        this.hashMap[key] = value;
    };
    Dictionary.prototype.remove = function (key) {
        delete this.hashMap[key];
    };
    Dictionary.prototype.getKeys = function () {
        return Object.keys(this.hashMap);
    };
    Dictionary.prototype.getValues = function () {
        var _this = this;
        var values = Object.keys(this.hashMap).map(function (key) {
            return _this.hashMap[key];
        });
        return values;
    };
    Dictionary.prototype.contains = function (key) {
        var value = this.get(key);
        return !!value;
    };
    Dictionary.convert = function (object) {
        var dict = new Dictionary();
        Object.keys(object).map(function (userId) {
            dict.put(userId, object[userId]);
        });
        return dict;
    };
    return Dictionary;
}());
exports.Dictionary = Dictionary;
//# sourceMappingURL=Dictionary.js.map