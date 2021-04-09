const { ModifyDoc, ReceiveDoc } = require("../js/req.js");

/**
 * @param {Array<Object>} markers An array of marker descriptor objects.
 * @returns {void} Doesn't return anything, but raises exception on failure.
 */

function UploadMarkers(markers) {
    ModifyDoc(markers)
    .catch(err => console.log(err));
}

/**
 * @returns {Promise<Object>} Returns the marker collection wrapped in a Promise
 */

async function DownloadMarkers() {
    return ReceiveDoc({ type: "MarkerStorage" });
}

module.exports = { UploadMarkers, DownloadMarkers };