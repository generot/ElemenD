const url = (route) => `https://memeliter6969.loca.lt/${route}`;

/**
 * @param {Object} obj An object with a single 'type' field, used to filter the incoming data.
 * @returns {Promise<Object>} An object with all fields necessary to describe a marker.
 */

async function ReceiveDoc(obj) {
    let resp = await fetch(url("getdoc"), {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    });

    return resp.json();
}

/**
 * @param {Object} obj An object with two fields: 'type' and 'newJson'.
 * @returns {Promise<Response>} The server's response upon the POST request.
 */

function ModifyDoc(obj) {
    return fetch(url("setdoc"), {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    });
}

/**
 * @param {Array<Object>} markers An array of marker descriptor objects.
 * @returns {void} Doesn't return anything, but raises exception on failure.
 */

export function UploadMarkers(markers) {
    ModifyDoc(markers)
    .catch(err => console.log(err));
}

/**
 * @returns {Promise<Object>} Returns the marker collection wrapped in a Promise
 */

export async function DownloadMarkers() {
    return ReceiveDoc({ type: "MarkerStorage" });
}