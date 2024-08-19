export class Constant2027 {
    id = 27;
    header = 'Draft Regional Water Plan Data';
    region_footer =
        "The 2026 Draft Regional Water Plans can be found on the TWDB website at: will provide updated URL when ready. You can also visit the Texas Water Development Board Secure Agency Reporting Application at https://www3.twdb.texas.gov/apps/SARA/reports/list to view 2026 Regional Water Plan data. Use the global filter option located at the top of the reporting application and filter the reports by the text '2026' to see all reports associated with the 2026 RWPs.";
    allow_dl = false;
    MIN_RADIUS = 4;
    MAX_RADIUS = 9;

    tappend = 'vw';
    sourcemap = 'iswp_sourcefeatures2027.map';
    sourcetables = 'iswp_sourcefeatures2027';

    regionalDescription = {
        A: 'The Panhandle (Region A) Regional Water Planning Area includes 21 counties split between the Canadian and Red river basins. The major cities in the region include Amarillo, Pampa, Borger, and Dumas.',
        B: 'The Region B Regional Water Planning Area encompasses all or parts of 11 counties in north central Texas bordering the Red River. Parts of three river basins (Red, Brazos, and Trinity) lie within the region. The major cities in the region include Wichita Falls, Burkburnett, and Vernon.',
        C: 'The Region C Regional Water Planning Area includes all or parts of 16 counties. Overlapping much of the upper portion of the Trinity River Basin, Region C also includes smaller parts of the Red, Brazos, Sulphur, and Sabine river basins. The Dallas-Fort Worth metropolitan area is centrally located in the region.',
        D: 'The North East Texas (Region D) Regional Water Planning Area encompasses all or parts of 19 counties. While largely rural, the region includes the cities of Longview, Texarkana, and Greenville. The planning area overlaps large portions of the Red, Sulphur, Cypress, and Sabine river basins and smaller parts of the Trinity and Neches river basins.',
        E: 'The Far West Texas (Region E) Regional Water Planning Area includes seven counties and lies entirely within the Rio Grande River Basin in the most arid part of the state. Most of the population in this planning area resides in El Paso County, in and around the City of El Paso.',
        F: 'The Region F Regional Water Planning Area is located in the Edwards Plateau encompassing 32 counties. Intersected by the Pecos River to the south and the Colorado River to the north, most of the region is located in the upper portion of the Colorado River Basin and Pecos portion of the Rio Grande Basin; a small portion is in the Brazos Basin. The major cities in the region include Midland, Odessa, and San Angelo.',
        G: 'The Brazos G Regional Water Planning Area includes all or parts of 37 counties. Over 90 percent of the region lies within the Brazos River Basin, with the Brazos River being the region’s primary source of water. Major cities in the region include Abilene, Bryan, College Station, Killeen, Round Rock, Temple, and Waco.',
        H: 'The Region H Regional Water Planning Area is composed of all or parts of 15 counties and includes portions of the Trinity, San Jacinto, Brazos, Neches, and Colorado river basins. The Houston metropolitan area is located within this region.',
        I: 'The East Texas (Region I) Regional Water Planning Area is composed of all or parts of 20 counties. The largest cities include Beaumont, Tyler, Port Arthur, Nacogdoches, and Lufkin.',
        J: 'Located on the southern edge of the Edwards Plateau, the Plateau (Region J) Regional Water Planning Area covers six counties. The region includes portions of the Colorado, Guadalupe, Nueces, Rio Grande, and San Antonio river basins. Land use in the western portion of the planning area is primarily range land, while the eastern portion is a mix of forest land, range land, and agricultural areas. Major cities in the region include Del Rio and Kerrville.',
        K: 'The Lower Colorado (Region K) Regional Water Planning Area is composed of all or parts of 14 counties, portions of 6 river and coastal basins, and Matagorda Bay. Most of the region is located in the Colorado River Basin. Major cities in the region include Austin, Bay City, Pflugerville, and Fredericksburg.',
        L: 'The South-Central Texas (Region L) Regional Water Planning Area includes all or parts of 21 counties, portions of 9 river and coastal basins, the Guadalupe Estuary, and San Antonio Bay. The largest cities in the region are San Antonio, Victoria, San Marcos, and New Braunfels. The region contains the two largest springs in Texas: Comal and San Marcos.',
        M: 'The Rio Grande (Region M) Regional Water Planning Area includes 8 counties, with over 60 percent of the region lying within the Rio Grande Basin. Its major cities include Brownsville, McAllen, and Laredo.',
        N: 'The Coastal Bend (Region N) Regional Water Planning Area includes 11 counties, portions of the Nueces River Basin, and its adjoining coastal basins, including the Nueces Estuary. Corpus Christi is the region’s largest metropolitan area.',
        O: 'The Llano Estacado (Region O) Regional Water Planning Area encompasses 21 counties in the southern High Plains of Texas. The region lies within the upstream parts of four major river basins (Canadian, Red, Brazos, and Colorado). Major cities in the region include Lubbock, Plainview, Levelland, Lamesa, Hereford, and Brownfield.',
        P: 'The Lavaca (Region P) Regional Water Planning Area is composed of Jackson and Lavaca counties and Precinct Three of Wharton County, including the entire City of El Campo. Other cities in the region include Edna, Yoakum, and Hallettsville. Most of the region lies in the Lavaca River Basin.'
    };

    /**
     * Create a Statewide.
     */
    DATA_TABLES = {
        demands: 'vwWugDemand',
        needs: 'vwWugNeeds',
        supplies: 'vwExistingWugSupply',
        population: 'vwWugPopulation',
        strategies: 'vwWMSWugSupply'
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

    #decades = ['2030', '2040', '2050', '2060', '2070', '2080'];
    #usage_types = ['IRRIGATION', 'MUNICIPAL', 'MANUFACTURING', 'STEAM ELECTRIC POWER', 'LIVESTOCK', 'MINING'];
    USAGE_TYPE_DESCRIPTIONS = {
        IRRIGATION:
            'Irrigation water demand includes water used in irrigated field crops, vineyards, orchards, and self-supplied golf courses.',
        MUNICIPAL:
            'Municipal water demand consists of water to be used for residential (single family and multi-family), commercial (including some manufacturing firms that do not use water in their production process), and institutional purposes (establishments dedicated to public service).',
        MANUFACTURING:
            'Manufacturing water demand consists of the future water necessary for large facilities including those that process chemicals, oil and gas, food, paper, and other materials.',
        'STEAM ELECTRIC POWER': 'Steam-electric water demand consists of water used for the purpose of generating power.',
        LIVESTOCK:
            'Livestock water demand includes water used in the production of various types of livestock including cattle (beef and dairy), hogs, poultry, horses, sheep, and goats.',
        MINING: 'Mining water demand consists of water used in the exploration, development, and extraction of oil, gas, coal, aggregates, and other materials.'
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
    ];

    #themes = ['demands', 'supplies', 'needs', 'strategies'];

    #theme_titles = {
        demands: 'Demands',
        supplies: 'Existing Supplies',
        needs: 'Needs (Potential Shortages)',
        strategies: 'Strategy Supplies',
        population: 'Population'
    };

    chosenTitles = {
        region: 'Region',
        entity: 'Water User Group',
        usagetype: 'Usage Type',
        source: 'Water Source',
        project: 'Project',
        wms: 'WMS',
        wmstype: 'WMS Type',
        county: 'County'
    };

    wms_info = {
        WMS_TYPES: [
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
        ],
        WMS_TYPE_DESCRIPTIONS: {
            'AGRICULTURAL CONSERVATION':
                'Agricultural conservation is primarily irrigation conservation strategies and some livestock conservation based on best management practices. Irrigation conservation strategies include changes to irrigation methods, equipment, and crops. For example, conversion to Low Energy Precision Application systems and irrigation scheduling, as well as other activities associated with irrigation best management practices, can help producers reduce their water use. Like municipal conservation, irrigation conservation strategies tend to be an aggregate of multiple best management practices, any one or several of which could be implemented to achieve the estimated water savings of the strategy.',
            'AQUIFER STORAGE & RECOVERY':
                'Aquifer storage and recovery water management strategies inject water, when available, into an aquifer where it is stored for later use.',
            'CONJUNCTIVE USE':
                'Conjunctive use water management strategies combine multiple water sources, usually surface water and groundwater, to optimize the beneficial characteristics of each source, yielding additional firm water supplies.',
            'DIRECT POTABLE REUSE':
                'Direct potable reuse strategies involve taking treated wastewater effluent, further treating it at an advanced water treatment plant, and then either introducing it upfront of the water treatment plant or directly into the potable water distribution system.',
            'DROUGHT MANAGEMENT':
                'Drought management water management strategies reduce water use during times of drought by temporarily restricting certain economic and domestic activities such as car washing and lawn watering.',
            'GROUNDWATER DESALINATION':
                'Groundwater desalination water management strategies involve the process of removing dissolved solids from brackish groundwater, often by forcing the source water through membranes under high pressure.',
            'GROUNDWATER WELLS & OTHER':
                'Groundwater wells & other water management strategies include the development of additional groundwater including single wells or multiple wells, which may be part of the development of new well fields or existing well fields.',
            'INDIRECT REUSE':
                'Indirect reuse water management strategies generally involve discharging wastewater into a natural water body and diverting that water for subsequent use.',
            'INDUSTRIAL CONSERVATION':
                'Industrial conservation strategies are implemented mostly by private interests and are generally based on best management practices appropriate for each facility. These strategies for steam-electric power, manufacturing, and mining may include evaluating more efficient cooling and process water practices, water audits, or submetering.',
            'MUNICIPAL CONSERVATION':
                'Municipal conservation water management strategies include a variety of activities that either reduce everyday water consumption or increase water use efficiency, allowing more to be done with the same amount of water. Examples of municipal conservation includes activities such as low flow plumbing fixtures, water conservation pricing structure, water system audits, or landscape irrigation restrictions.',
            'NEW MAJOR RESERVOIR':
                'New major reservoir water management strategies involve the construction of a new major reservoir. Major reservoirs are defined as reservoirs having at least 5,000 acre-feet of storage capacity at the normal operating level.',
            'OTHER DIRECT REUSE':
                'Other direct reuse water management strategies generally convey treated wastewater directly from a treatment plant to non-potable uses such as landscaping or industrial processes.',
            'OTHER STRATEGIES':
                'Other water management strategies individually, provide less than 0.5 percent of the total recommended strategy supplies in 2070. They include surface water desalination, weather modification, brush control, and rainwater harvesting.',
            'OTHER SURFACE WATER':
                'Other surface water management strategies includes minor reservoirs (less than 5,000 acre-feet of storage) and subordination as well as a wide variety of other strategies that convey, treat, reassign, or otherwise make accessible additional surface water supplies to users with or without additional infrastructure.',
            'SEAWATER DESALINATION':
                'Seawater desalination water management strategies involve the process of removing dissolved solids from seawater, often by forcing the source water through membranes under high pressure.'
        }
    };

    #year = 2026;
    #regions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
    #countyNames = [
        'Anderson',
        'Andrews',
        'Angelina',
        'Aransas',
        'Archer',
        'Armstrong',
        'Atascosa',
        'Austin',
        'Bailey',
        'Bandera',
        'Bastrop',
        'Baylor',
        'Bee',
        'Bell',
        'Bexar',
        'Blanco',
        'Borden',
        'Bosque',
        'Bowie',
        'Brazoria',
        'Brazos',
        'Brewster',
        'Briscoe',
        'Brooks',
        'Brown',
        'Burleson',
        'Burnet',
        'Caldwell',
        'Calhoun',
        'Callahan',
        'Cameron',
        'Camp',
        'Carson',
        'Cass',
        'Castro',
        'Chambers',
        'Cherokee',
        'Childress',
        'Clay',
        'Cochran',
        'Coke',
        'Coleman',
        'Collin',
        'Collingsworth',
        'Colorado',
        'Comal',
        'Comanche',
        'Concho',
        'Cooke',
        'Coryell',
        'Cottle',
        'Crane',
        'Crockett',
        'Crosby',
        'Culberson',
        'Dallam',
        'Dallas',
        'Dawson',
        'Deaf Smith',
        'Delta',
        'Denton',
        'DeWitt',
        'Dickens',
        'Dimmit',
        'Donley',
        'Duval',
        'Eastland',
        'Ector',
        'Edwards',
        'Ellis',
        'El Paso',
        'Erath',
        'Falls',
        'Fannin',
        'Fayette',
        'Fisher',
        'Floyd',
        'Foard',
        'Fort Bend',
        'Franklin',
        'Freestone',
        'Frio',
        'Gaines',
        'Galveston',
        'Garza',
        'Gillespie',
        'Glasscock',
        'Goliad',
        'Gonzales',
        'Gray',
        'Grayson',
        'Gregg',
        'Grimes',
        'Guadalupe',
        'Hale',
        'Hall',
        'Hamilton',
        'Hansford',
        'Hardeman',
        'Hardin',
        'Harris',
        'Harrison',
        'Hartley',
        'Haskell',
        'Hays',
        'Hemphill',
        'Henderson',
        'Hidalgo',
        'Hill',
        'Hockley',
        'Hood',
        'Hopkins',
        'Houston',
        'Howard',
        'Hudspeth',
        'Hunt',
        'Hutchinson',
        'Irion',
        'Jack',
        'Jackson',
        'Jasper',
        'Jeff Davis',
        'Jefferson',
        'Jim Hogg',
        'Jim Wells',
        'Johnson',
        'Jones',
        'Karnes',
        'Kaufman',
        'Kendall',
        'Kenedy',
        'Kent',
        'Kerr',
        'Kimble',
        'King',
        'Kinney',
        'Kleberg',
        'Knox',
        'Lamar',
        'Lamb',
        'Lampasas',
        'La Salle',
        'Lavaca',
        'Lee',
        'Leon',
        'Liberty',
        'Limestone',
        'Lipscomb',
        'Live Oak',
        'Llano',
        'Loving',
        'Lubbock',
        'Lynn',
        'Madison',
        'Marion',
        'Martin',
        'Mason',
        'Matagorda',
        'Maverick',
        'McCulloch',
        'McLennan',
        'McMullen',
        'Medina',
        'Menard',
        'Midland',
        'Milam',
        'Mills',
        'Mitchell',
        'Montague',
        'Montgomery',
        'Moore',
        'Morris',
        'Motley',
        'Nacogdoches',
        'Navarro',
        'Newton',
        'Nolan',
        'Nueces',
        'Ochiltree',
        'Oldham',
        'Orange',
        'Palo Pinto',
        'Panola',
        'Parker',
        'Parmer',
        'Pecos',
        'Polk',
        'Potter',
        'Presidio',
        'Rains',
        'Randall',
        'Reagan',
        'Real',
        'Red River',
        'Reeves',
        'Refugio',
        'Roberts',
        'Robertson',
        'Rockwall',
        'Runnels',
        'Rusk',
        'Sabine',
        'San Augustine',
        'San Jacinto',
        'San Patricio',
        'San Saba',
        'Schleicher',
        'Scurry',
        'Shackelford',
        'Shelby',
        'Sherman',
        'Smith',
        'Somervell',
        'Starr',
        'Stephens',
        'Sterling',
        'Stonewall',
        'Sutton',
        'Swisher',
        'Tarrant',
        'Taylor',
        'Terrell',
        'Terry',
        'Throckmorton',
        'Titus',
        'Tom Green',
        'Travis',
        'Trinity',
        'Tyler',
        'Upshur',
        'Upton',
        'Uvalde',
        'Val Verde',
        'Van Zandt',
        'Victoria',
        'Walker',
        'Waller',
        'Ward',
        'Washington',
        'Webb',
        'Wharton',
        'Wheeler',
        'Wichita',
        'Wilbarger',
        'Willacy',
        'Williamson',
        'Wilson',
        'Winkler',
        'Wise',
        'Wood',
        'Yoakum',
        'Young',
        'Zapata',
        'Zavala'
    ];

    page_types = {
        region: 'region',
        county: 'county',
        entity: 'entity',
        usagetype: 'usagetype',
        source: 'source',
        project: 'project',
        wms: 'wms',
        wmstype: 'wmstype'
    };

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
