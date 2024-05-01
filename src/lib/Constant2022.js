export class Constant2022 {
    id=22;
    header="Texas State Water Plan"
    region_footer=" The 2021 Regional Water Plans can be found on the TWDB website at: <a href='http://www.twdb.texas.gov/waterplanning/rwp/plans/2021/index.asp'>http://www.twdb.texas.gov/waterplanning/rwp/plans/2021/index.asp</a> ."
    allow_dl=true
    MIN_RADIUS = 4;
    MAX_RADIUS = 9;

    tappend = "vw";
    sourcemap = "iswp_sourcefeatures2022.map";
    sourcetables = "iswp_sourcefeatures2022";

    regionalDescription = {
        A: "The Panhandle (Region A) Regional Water Planning Area includes 21 counties split between the Canadian and Red river basins. The major cities in the region include Amarillo, Pampa, Borger, and Dumas.",
        B: "The Region B Regional Water Planning Area encompasses all or parts of 11 counties in north central Texas bordering the Red River. Parts of three river basins (Red, Brazos, and Trinity) lie within the region. The major cities in the region include Wichita Falls, Burkburnett, and Vernon.",
        C: "The Region C Regional Water Planning Area includes all or parts of 16 counties. Overlapping much of the upper portion of the Trinity River Basin, Region C also includes smaller parts of the Red, Brazos, Sulphur, and Sabine river basins. The Dallas-Fort Worth metropolitan area is centrally located in the region.",
        D: "The North East Texas (Region D) Regional Water Planning Area encompasses all or parts of 19 counties. While largely rural, the region includes the cities of Longview, Texarkana, and Greenville. The planning area overlaps large portions of the Red, Sulphur, Cypress, and Sabine river basins and smaller parts of the Trinity and Neches river basins.",
        E: "The Far West Texas (Region E) Regional Water Planning Area includes seven counties and lies entirely within the Rio Grande River Basin in the most arid part of the state. Most of the population in this planning area resides in El Paso County, in and around the City of El Paso.",
        F: "The Region F Regional Water Planning Area is located in the Edwards Plateau encompassing 32 counties. Intersected by the Pecos River to the south and the Colorado River to the north, most of the region is located in the upper portion of the Colorado River Basin and Pecos portion of the Rio Grande Basin; a small portion is in the Brazos Basin. The major cities in the region include Midland, Odessa, and San Angelo.",
        G: "The Brazos G Regional Water Planning Area includes all or parts of 37 counties. Over 90 percent of the region lies within the Brazos River Basin, with the Brazos River being the region’s primary source of water. Major cities in the region include Abilene, Bryan, College Station, Killeen, Round Rock, Temple, and Waco.",
        H: "The Region H Regional Water Planning Area is composed of all or parts of 15 counties and includes portions of the Trinity, San Jacinto, Brazos, Neches, and Colorado river basins. The Houston metropolitan area is located within this region.",
        I: "The East Texas (Region I) Regional Water Planning Area is composed of all or parts of 20 counties. The largest cities include Beaumont, Tyler, Port Arthur, Nacogdoches, and Lufkin.",
        J: "Located on the southern edge of the Edwards Plateau, the Plateau (Region J) Regional Water Planning Area covers six counties. The region includes portions of the Colorado, Guadalupe, Nueces, Rio Grande, and San Antonio river basins. Land use in the western portion of the planning area is primarily range land, while the eastern portion is a mix of forest land, range land, and agricultural areas. Major cities in the region include Del Rio and Kerrville.",
        K: "The Lower Colorado (Region K) Regional Water Planning Area is composed of all or parts of 14 counties, portions of 6 river and coastal basins, and Matagorda Bay. Most of the region is located in the Colorado River Basin. Major cities in the region include Austin, Bay City, Pflugerville, and Fredericksburg.",
        L: "The South-Central Texas (Region L) Regional Water Planning Area includes all or parts of 21 counties, portions of 9 river and coastal basins, the Guadalupe Estuary, and San Antonio Bay. The largest cities in the region are San Antonio, Victoria, San Marcos, and New Braunfels. The region contains the two largest springs in Texas: Comal and San Marcos.",
        M: "The Rio Grande (Region M) Regional Water Planning Area includes 8 counties, with over 60 percent of the region lying within the Rio Grande Basin. Its major cities include Brownsville, McAllen, and Laredo.",
        N: "The Coastal Bend (Region N) Regional Water Planning Area includes 11 counties, portions of the Nueces River Basin, and its adjoining coastal basins, including the Nueces Estuary. Corpus Christi is the region’s largest metropolitan area.",
        O: "The Llano Estacado (Region O) Regional Water Planning Area encompasses 21 counties in the southern High Plains of Texas. The region lies within the upstream parts of four major river basins (Canadian, Red, Brazos, and Colorado). Major cities in the region include Lubbock, Plainview, Levelland, Lamesa, Hereford, and Brownfield.",
        P: "The Lavaca (Region P) Regional Water Planning Area is composed of Jackson and Lavaca counties and Precinct Three of Wharton County, including the entire City of El Campo. Other cities in the region include Edna, Yoakum, and Hallettsville. Most of the region lies in the Lavaca River Basin."
    };
    
    /**
     * Create a Statewide.
     */
    DATA_TABLES = {
        demands: "vwWugDemand",
        needs: "vwWugNeeds",
        supplies: "vwExistingWugSupply",
        population: "vwWugPopulation",
        strategies: "vwWMSWugSupply",
    };

    PROJECT_TABLES = {
        region: 'vwWMSProjects',
        county: 'vwWMSProjectByCounty',
        entity: 'vwWMSProjectByEntity',
        source: 'vwWMSProjectBySource',
        wmstype: 'vwWMSProjectsByWmsType',
        project: 'vwWMSProjectByWMS', //Not included as project information in project view is pulled from the vwWMSProjectByEntityWUGSplit table
        strategies: 'vwWMSProjectByEntityWUGSplit',
        wms: 'vwWMSProjectByWMS'
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

    #year = 2022;
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

    chosenTitles = {
        "region": "Region",
        "entity": "Water User Group",
        "usagetype": "Usage Type",
        "source": "Water Source",
        "project": "Project",
        "wms": "WMS",
        "wmstype": "WMS Type"
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
