"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformUrl = void 0;
function transformUrl(inputUrl) {
    // Remove 'https://' or 'http://' if present
    let transformedUrl = inputUrl.replace(/^(https?:\/\/)/, "");
    // Remove 'www.' if present
    transformedUrl = transformedUrl.replace(/^www\./, "");
    // Add 'https://' back if the input URL had it
    if (inputUrl.startsWith("https://")) {
        transformedUrl = "https://" + transformedUrl;
    }
    else if (inputUrl.startsWith("http://")) {
        transformedUrl = "http://" + transformedUrl;
    }
    return transformedUrl;
}
exports.transformUrl = transformUrl;
//# sourceMappingURL=transformUrl.js.map