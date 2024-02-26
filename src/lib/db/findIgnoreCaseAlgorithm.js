

export function findIgnoreCaseAlgorithm(needle, index, onfound, onfinish) {
    // needle: The string to search for
    // onfound: A function to call for each found item
    // onfinsish: A function to call when we're finshed searching.

    //needle = typeof needle == "string" ? needle : JSON.stringify(needle);

    var cursorReq = index.openCursor(); // 'index' (IDBIndex) must exist in closure scope

    cursorReq.onsuccess = function (event) {
        var cursor = event.target.result;
        if(!cursor || !cursor?.continue) {
            onfinish();
        }

        if(cursor?.key?.toLowerCase() == needle?.toLowerCase()) {
            cursor.continue();
            onfound(cursor.value);
        } else {
            cursor.continue();
        }
    }
}