"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUrl = void 0;
function isValidUrl(url) {
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+)(:[0-9]+)?(\/[^\s]*)?$/;
    return urlPattern.test(url);
}
exports.isValidUrl = isValidUrl;
//# sourceMappingURL=isValid.js.map