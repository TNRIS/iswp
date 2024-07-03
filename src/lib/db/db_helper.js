// @ts-nocheck
export async function build_func(e, tname, indexes) {
    let db = e.target.result;
    if (db.objectStoreNames.contains(tname)) {
        db.deleteObjectStore(tname);
    }

    const table = db.createObjectStore(tname, {
        keyPath: 'id',
        autoIncrement: 'true'
    });

    if (indexes && indexes.length) {
        for (let index in indexes) {
            table.createIndex(indexes[index], indexes[index], {
                unique: false
            });
        }
    }

    return table;
}
