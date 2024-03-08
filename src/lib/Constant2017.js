export class Constant2017 {
    id=17;
    header="Texas State Water Plan"
    region_footer=" The 2021 Regional Water Plans can be found on the TWDB website at: <a href='http://www.twdb.texas.gov/waterplanning/rwp/plans/2021/index.asp'>http://www.twdb.texas.gov/waterplanning/rwp/plans/2021/index.asp</a> ."
    allow_dl=true
    MIN_RADIUS = 4;
    MAX_RADIUS = 9;

    tappend = "vw2017Map";
    sourcemap = "iswp_sourcefeatures2017.map"
    sourcetables = "iswp_sourcefeatures2027.map";

    /**
     * Create a Statewide.
     */
    DATA_TABLES = {
        demands: "vw2017MapWugDemand",
        needs: "vw2017MapWugNeeds",
        supplies: "vw2017MapExistingWugSupply",
        population: "vw2017MapWugPopulation",
        strategies: "vw2017MapWMSWugSupply",
    };

    PROJECT_TABLES = {
        region: 'vw2017MapWMSProjects',
        county: 'vw2017MapWMSProjectByCounty',
        entity: 'vw2017MapWMSProjectByEntity',
        source: 'vw2017MapWMSProjectBySource',
        wmstype: 'vw2017MapWMSProjectsByWmsType',
        project: 'vw2017MapWMSProjectByWMS', //Not included as project information in project view is pulled from the vwWMSProjectByEntityWUGSplit table
        strategies: 'vw2017MapWMSProjectByEntityWUGSplit',
        wms: 'vw2017MapWMSProjectByWMS'
        //usagetype: vwWMSProjectByWUGType //Not included because results are too large
    };

    #decades = ["2020", "2030", "2040", "2050", "2060", "2070"];
    #usage_types = [
        "IRRIGATION",
        "MUNICIPAL",
        "MANUFACTURING",
        "STEAM ELECTRIC POWER",
        "LIVESTOCK",
        "MINING",
    ];
    USAGE_TYPE_DESCRIPTIONS = {
        IRRIGATION: "Irrigation water demand includes water used in irrigated field crops, vineyards, orchards, and self-supplied golf courses.",
        MUNICIPAL: "Municipal water demand consists of water to be used for residential (single family and multi-family), commercial (including some manufacturing firms that do not use water in their production process), and institutional purposes (establishments dedicated to public service).",
        MANUFACTURING: "Manufacturing water demand consists of the future water necessary for large facilities including those that process chemicals, oil and gas, food, paper, and other materials.",
        'STEAM ELECTRIC POWER': "Steam-electric water demand consists of water used for the purpose of generating power.",
        LIVESTOCK: "Livestock water demand includes water used in the production of various types of livestock including cattle (beef and dairy), hogs, poultry, horses, sheep, and goats.",
        MINING: "Mining water demand consists of water used in the exploration, development, and extraction of oil, gas, coal, aggregates, and other materials."
    };
    WMS_TYPES = [
        'AGRICULTURAL CONSERVATION',
        'AQUIFER STORAGE AND RECOVERY',
        'CONJUNCTIVE USE',
        'DIRECT POTABLE REUSE',
        'DROUGHT MANAGEMENT',
        'GROUNDWATER DESALINATION',
        'GROUNDWATER WELLS AND OTHER',
        'INDIRECT REUSE',
        'INDUSTRIAL CONSERVATION',
        'MUNICIPAL CONSERVATION',
        'NEW MAJOR RESERVOIR',
        'OTHER DIRECT REUSE',
        'OTHER STRATEGIES',
        'OTHER SURFACE WATER',
        'SEAWATER DESALINATION'
      ]

    #themes = ["demands", "supplies", "needs", "strategies"];

    #theme_titles = {
        demands: "Demands",
        supplies: "Existing Supplies",
        needs: "Needs (Potential Shortages)",
        strategies: "Strategy Supplies",
        population: "Population",
    };
    chosenTitles = {
        "region": "Region",
        "entity": "Water User Group",
        "usagetype": "Usage Type",
        "source": "Water Source",
        "project": "Project",
        "wms": "WMS",
        "wmstype": "WMS Type"
    }
    #year = 2017;
    #regions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
    #countyNames = [ "Anderson", "Andrews", "Angelina", "Aransas", "Archer", "Armstrong", "Atascosa", "Austin", "Bailey", "Bandera", "Bastrop", "Baylor", "Bee", "Bell", "Bexar", "Blanco", "Borden", "Bosque", "Bowie", "Brazoria", "Brazos", "Brewster", "Briscoe", "Brooks", "Brown", "Burleson", "Burnet", "Caldwell", "Calhoun", "Callahan", "Cameron", "Camp", "Carson", "Cass", "Castro", "Chambers", "Cherokee", "Childress", "Clay", "Cochran", "Coke", "Coleman", "Collin", "Collingsworth", "Colorado", "Comal", "Comanche", "Concho", "Cooke", "Coryell", "Cottle", "Crane", "Crockett", "Crosby", "Culberson", "Dallam", "Dallas", "Dawson", "Deaf Smith", "Delta", "Denton", "DeWitt", "Dickens", "Dimmit", "Donley", "Duval", "Eastland", "Ector", "Edwards", "Ellis", "El Paso", "Erath", "Falls", "Fannin", "Fayette", "Fisher", "Floyd", "Foard", "Fort Bend", "Franklin", "Freestone", "Frio", "Gaines", "Galveston", "Garza", "Gillespie", "Glasscock", "Goliad", "Gonzales", "Gray", "Grayson", "Gregg", "Grimes", "Guadalupe", "Hale", "Hall", "Hamilton", "Hansford", "Hardeman", "Hardin", "Harris", "Harrison", "Hartley", "Haskell", "Hays", "Hemphill", "Henderson", "Hidalgo", "Hill", "Hockley", "Hood", "Hopkins", "Houston", "Howard", "Hudspeth", "Hunt", "Hutchinson", "Irion", "Jack", "Jackson", "Jasper", "Jeff Davis", "Jefferson", "Jim Hogg", "Jim Wells", "Johnson", "Jones", "Karnes", "Kaufman", "Kendall", "Kenedy", "Kent", "Kerr", "Kimble", "King", "Kinney", "Kleberg", "Knox", "Lamar", "Lamb", "Lampasas", "La Salle", "Lavaca", "Lee", "Leon", "Liberty", "Limestone", "Lipscomb", "Live Oak", "Llano", "Loving", "Lubbock", "Lynn", "Madison", "Marion", "Martin", "Mason", "Matagorda", "Maverick", "McCulloch", "McLennan", "McMullen", "Medina", "Menard", "Midland", "Milam", "Mills", "Mitchell", "Montague", "Montgomery", "Moore", "Morris", "Motley", "Nacogdoches", "Navarro", "Newton", "Nolan", "Nueces", "Ochiltree", "Oldham", "Orange", "Palo Pinto", "Panola", "Parker", "Parmer", "Pecos", "Polk", "Potter", "Presidio", "Rains", "Randall", "Reagan", "Real", "Red River", "Reeves", "Refugio", "Roberts", "Robertson", "Rockwall", "Runnels", "Rusk", "Sabine", "San Augustine", "San Jacinto", "San Patricio", "San Saba", "Schleicher", "Scurry", "Shackelford", "Shelby", "Sherman", "Smith", "Somervell", "Starr", "Stephens", "Sterling", "Stonewall", "Sutton", "Swisher", "Tarrant", "Taylor", "Terrell", "Terry", "Throckmorton", "Titus", "Tom Green", "Travis", "Trinity", "Tyler", "Upshur", "Upton", "Uvalde", "Val Verde", "Van Zandt", "Victoria", "Walker", "Waller", "Ward", "Washington", "Webb", "Wharton", "Wheeler", "Wichita", "Wilbarger", "Willacy", "Williamson", "Wilson", "Winkler", "Wise", "Wood", "Yoakum", "Young", "Zapata", "Zavala" ];

    page_types = {
        "region": "region",
        "county": "county",
        "entity": "entity",
        "usagetype": "usagetype",
        "source": "source",
        "project": "project",
        "wms": "wms",
        "wmstype": "wmstype"
    }

    getThemeTitles() {
        return this.#theme_titles;
    }

    getDecades() {
        return this.#decades;
    }

    getUsageTypes() {
        return this.#usage_types;
    }

    getThemes() {
        return this.#themes;
    }

    getYear() {
        return this.#year;
    }

    getRegions() {
        return this.#regions;
    }

    getCountyNames() {
        return this.#countyNames;
    }
}
