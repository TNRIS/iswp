export class QuerySetting {
    /**
     * @param { string } type
     * @param { string } filter
     */
    constructor(type, filter="") {
        this.type = type,
        this.filter = filter
    }

    getType() {
        return this.type;
    }

    getFilter() {
        return this.filter;
    }
}