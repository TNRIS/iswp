export class QuerySetting {
    /**
     * @param { string } [type]
     * @param { string } [filter]
     * @param { string } [whereClause]
     */
    constructor(type, filter, whereClause) {
        (this.type = type), (this.filter = filter);
        this.whereClause = whereClause;
    }

    getType() {
        return this.type;
    }

    getFilter() {
        return this.filter;
    }

    getWhereClause() {
        return this.whereClause;
    }
}
