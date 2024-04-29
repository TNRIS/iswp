/**
 * Type definition or ProjectItem. Kind of like an interface for JSDOC
 */
export class ProjectItem {
    /**
     * @property {number} CapitalCost: Cost of entity
     * @property {number} id: Identification number
     * @property {number} LatCoord: Latitude
     * @property {number} LongCoord: Longitude
     * @property {number} EntityLatCoord: Latitude alternative name.
     * @property {number} EntityLongCoord: Longitude alternative name.
     * @property {string} OnlineDecade: Decade Online
     * @property {string} ProjectName: Name of Project
     * @property {string} ProjectSponsors: Sponsor of Project
     * @property {number} WmsProjectId: Id of project
     * @property {string} WmsProjectSponsorRegion: Water Region
     * @property {string} WugRegion: Water User Group Region
    */
    constructor() {
        this.CapitalCost = undefined;
        this.id = undefined;
        this.LatCoord = undefined;
        this.LongCoord = undefined;
        this.EntityLatCoord = undefined;
        this.EntityLongCoord = undefined;
        this.OnlineDecade = undefined;
        this.ProjectName = undefined;
        this.ProjectSponsors = undefined;
        this.WmsProjectId = undefined;
        this.WmsProjectSponsorRegion = undefined;
        this.WugRegion = undefined;
    }
}

/**
 * Type definition or EntityItem. Kind of like an interface for JSDOC
 */
export class EntityItem {
    /**
     * @property {number} EntityId: entity id
     * @property {string} EntityIsSplit: Split boolean
     * @property {string} EntityName: Name of entity
     * @property {string} EntityTypeName: name of entity type
     * @property {number} id: id
     * @property {number} Latitude: Latitude for centroid
     * @property {number} Longitude: Longitude for centroid
     * @property {string} WugCounty: County name
     * @property {string} WugRegion: Region identifier
     * @property {string} WugType: Type identifier
     */

    constructor() {
        this.EntityId = undefined;
        this.EntityIsSplit = undefined;
        this.EntityName = undefined;
        this.EntityTypeName = undefined;
        this.id = undefined;
        this.Latitude = undefined;
        this.Longitude = undefined;
        this.WugCounty = undefined;
        this.WugRegion = undefined;
        this.WugType = undefined;
    }

}