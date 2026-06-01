/**
 * Building component vocabulary — parts, assemblies, and field nouns for AECO projects.
 * Includes an elemental taxonomy (major groups / group elements / sub-elements, ASTM E1557-style,
 * plain English only) and trade-oriented part buckets. Taxonomy leaves are merged into BUILDING_COMPONENTS.
 *
 * Hats (AECOHats.mjs) reference COMPONENT_GROUP_KEYS and ELEMENTAL_MAJOR_GROUP_IDS so each role has
 * explicit component + elemental coverage for recognition rules.
 */

/**
 * @typedef {object} ElementGroup
 * @property {string} name Group element (Level-3 style title).
 * @property {string[]} subelements Typical sub-elements / line items (Level-4 style descriptions).
 */

/**
 * @typedef {object} MajorGroup
 * @property {string} id Stable slug.
 * @property {string} name Major group (Level-1 style).
 * @property {ElementGroup[]} elementGroups
 */

/** @type {MajorGroup[]} */
export const ELEMENTAL_MAJOR_GROUPS = [
  {
    id: 'substructure',
    name: 'Substructure',
    elementGroups: [
      {
        name: 'Standard foundations',
        subelements: [
          'Wall foundations',
          'Column foundations and pile caps',
          'Perimeter drainage and insulation'
        ]
      },
      {
        name: 'Special foundations',
        subelements: [
          'Pile foundations',
          'Grade beams',
          'Caissons',
          'Underpinning',
          'Dewatering',
          'Raft foundations',
          'Pressure-injected grouting',
          'Other special foundation conditions'
        ]
      },
      {
        name: 'Slab on grade',
        subelements: [
          'Standard slab on grade',
          'Structural slab on grade',
          'Inclined slab on grade',
          'Trenches pits and bases',
          'Under-slab drainage and insulation'
        ]
      },
      {
        name: 'Basement excavation',
        subelements: [
          'Excavation for basements',
          'Structure backfill and compaction',
          'Excavation shoring'
        ]
      },
      {
        name: 'Basement walls',
        subelements: [
          'Basement wall construction',
          'Below-grade moisture protection',
          'Basement wall insulation',
          'Basement interior skin'
        ]
      },
      {
        name: 'Retaining and site walls',
        subelements: [
          'Retaining wall structure',
          'Mechanically stabilized earth',
          'Gabion wall',
          'Soldier pile lagging wall',
          'Concrete retaining wall',
          'Segmental retaining wall'
        ]
      }
    ]
  },
  {
    id: 'shell',
    name: 'Shell',
    elementGroups: [
      {
        name: 'Floor construction',
        subelements: [
          'Suspended basement floors',
          'Upper floor construction',
          'Balcony floor construction',
          'Ramps',
          'Exterior stairs and fire escapes',
          'Floor raceway systems',
          'Other floor construction'
        ]
      },
      {
        name: 'Roof construction',
        subelements: [
          'Flat roof construction',
          'Pitched roof construction',
          'Canopies',
          'Other roof systems'
        ]
      },
      {
        name: 'Exterior walls',
        subelements: [
          'Exterior wall construction',
          'Parapets',
          'Exterior louvers screens and fencing',
          'Exterior sun control devices',
          'Balcony walls and handrails',
          'Exterior soffits'
        ]
      },
      {
        name: 'Exterior windows',
        subelements: [
          'Windows',
          'Curtain walls',
          'Storefronts',
          'Other exterior glazing systems'
        ]
      },
      {
        name: 'Exterior doors',
        subelements: [
          'Glazed doors and entrances',
          'Solid exterior doors',
          'Revolving doors',
          'Overhead doors',
          'Other doors and entrances'
        ]
      },
      {
        name: 'Roof coverings',
        subelements: [
          'Roof finishes',
          'Traffic toppings and paving membranes',
          'Roof insulation and fill',
          'Flashings and trim',
          'Roof eaves and soffits',
          'Gutters and downspouts'
        ]
      },
      {
        name: 'Roof openings',
        subelements: [
          'Glazed roof openings',
          'Roof hatches',
          'Gravity roof ventilators'
        ]
      },
      {
        name: 'Parking and circulation structure',
        subelements: [
          'Parking deck slab',
          'Parking ramp',
          'Parking screen',
          'Vehicle barrier cable',
          'Wheel stop'
        ]
      }
    ]
  },
  {
    id: 'interiors',
    name: 'Interiors',
    elementGroups: [
      {
        name: 'Partitions',
        subelements: [
          'Fixed partitions',
          'Demountable partitions',
          'Retractable partitions',
          'Site-built toilet partitions',
          'Site-built compartments and cubicles',
          'Interior balustrades and screens',
          'Interior windows and storefronts'
        ]
      },
      {
        name: 'Interior doors',
        subelements: [
          'Interior doors',
          'Interior door frames',
          'Interior door hardware',
          'Interior door wall opening elements',
          'Interior door sidelights and transoms',
          'Interior hatches and access doors',
          'Interior door painting and decoration'
        ]
      },
      {
        name: 'Fittings',
        subelements: [
          'Fabricated toilet partitions',
          'Fabricated compartments and cubicles',
          'Storage shelving and lockers',
          'Ornamental metals and handrails',
          'Identifying devices',
          'Closet specialties',
          'General fittings and miscellaneous metals'
        ]
      },
      {
        name: 'Stair construction',
        subelements: [
          'Regular stairs',
          'Curved stairs',
          'Spiral stairs',
          'Stair handrails and balustrades'
        ]
      },
      {
        name: 'Stair finishes',
        subelements: [
          'Stair tread and landing finishes',
          'Stair soffit finishes',
          'Stair handrail and balustrade finishes'
        ]
      },
      {
        name: 'Wall finishes',
        subelements: [
          'Wall finishes to inside face of exterior walls',
          'Wall finishes to interior walls',
          'Column finishes'
        ]
      },
      {
        name: 'Floor finishes',
        subelements: [
          'Floor toppings',
          'Traffic membranes',
          'Hardeners and sealers',
          'Flooring',
          'Carpeting',
          'Bases curbs and trim',
          'Access pedestal flooring'
        ]
      },
      {
        name: 'Ceiling finishes',
        subelements: [
          'Ceiling finishes',
          'Suspended ceilings',
          'Other ceiling systems'
        ]
      }
    ]
  },
  {
    id: 'services',
    name: 'Services',
    elementGroups: [
      {
        name: 'Elevators and lifts',
        subelements: [
          'Passenger elevators',
          'Freight elevators',
          'Lifts'
        ]
      },
      {
        name: 'Escalators and moving walks',
        subelements: ['Escalators', 'Moving walks']
      },
      {
        name: 'Other conveying systems',
        subelements: [
          'Dumbwaiters',
          'Pneumatic tube systems',
          'Hoists and cranes',
          'Conveyors',
          'Chutes',
          'Turntables',
          'Baggage handling and loading',
          'Other transportation systems'
        ]
      },
      {
        name: 'Plumbing fixtures',
        subelements: [
          'Water closets',
          'Urinals',
          'Lavatories',
          'Sinks',
          'Bathtubs',
          'Wash fountains',
          'Showers',
          'Drinking fountains and coolers',
          'Bidets and other plumbing fixtures'
        ]
      },
      {
        name: 'Domestic water distribution',
        subelements: [
          'Cold water service',
          'Hot water service',
          'Domestic water supply equipment'
        ]
      },
      {
        name: 'Sanitary waste',
        subelements: [
          'Waste piping',
          'Vent piping',
          'Floor drains',
          'Sanitary waste equipment',
          'Sanitary pipe insulation'
        ]
      },
      {
        name: 'Rainwater drainage',
        subelements: [
          'Rainwater pipe and fittings',
          'Roof drains',
          'Rainwater drainage equipment',
          'Rainwater pipe insulation'
        ]
      },
      {
        name: 'Other plumbing systems',
        subelements: [
          'Gas distribution piping',
          'Acid waste systems',
          'Interceptors',
          'Pool piping and equipment',
          'Decorative fountain piping',
          'Other specialty piping systems'
        ]
      },
      {
        name: 'Energy supply',
        subelements: [
          'Oil supply system',
          'Gas supply system',
          'Coal supply system',
          'Steam supply system',
          'Hot water heating supply system',
          'Solar energy system',
          'Wind energy system'
        ]
      },
      {
        name: 'Heat generating systems',
        subelements: [
          'Boilers',
          'Boiler room piping and specialties',
          'Boiler auxiliary equipment',
          'Boiler insulation'
        ]
      },
      {
        name: 'Cooling generating systems',
        subelements: ['Chilled water systems', 'Direct expansion cooling systems']
      },
      {
        name: 'Distribution systems',
        subelements: [
          'Air distribution systems',
          'Exhaust ventilation systems',
          'Steam distribution',
          'Hot water distribution',
          'Chilled water distribution',
          'Change-over distribution system',
          'Glycol distribution systems'
        ]
      },
      {
        name: 'Terminal and package units',
        subelements: [
          'Terminal self-contained units',
          'Packaged HVAC units'
        ]
      },
      {
        name: 'Controls and instrumentation',
        subelements: [
          'Heating generating controls',
          'Cooling generating controls',
          'Air handling unit controls',
          'Exhaust and ventilating controls',
          'Hood and exhaust controls',
          'Terminal device controls',
          'Energy monitoring and control',
          'Building automation systems',
          'Other controls and instrumentation'
        ]
      },
      {
        name: 'Systems testing and balancing',
        subelements: [
          'Piping system testing and balancing',
          'Air systems testing and balancing',
          'HVAC commissioning',
          'Other systems testing and balancing'
        ]
      },
      {
        name: 'Other HVAC systems and equipment',
        subelements: [
          'Special cooling systems',
          'Special humidity control',
          'Dust and fume collectors',
          'Air curtains',
          'Air purifiers',
          'Paint spray booth ventilation',
          'General construction items for HVAC'
        ]
      },
      {
        name: 'Sprinklers',
        subelements: [
          'Sprinkler water supply',
          'Sprinkler pumping equipment',
          'Dry sprinkler system'
        ]
      },
      {
        name: 'Standpipes',
        subelements: [
          'Standpipe water supply',
          'Standpipe pumping equipment',
          'Standpipe equipment',
          'Fire hose equipment'
        ]
      },
      {
        name: 'Fire protection specialties',
        subelements: ['Fire extinguishers', 'Fire extinguisher cabinets']
      },
      {
        name: 'Other fire protection systems',
        subelements: [
          'Carbon dioxide systems',
          'Foam generating equipment',
          'Clean agent systems',
          'Dry chemical systems',
          'Hood and duct fire protection'
        ]
      },
      {
        name: 'Electrical service and distribution',
        subelements: [
          'High tension service and distribution',
          'Low tension service and distribution'
        ]
      },
      {
        name: 'Lighting and branch wiring',
        subelements: ['Branch wiring devices', 'Lighting equipment']
      },
      {
        name: 'Communications and security',
        subelements: [
          'Public address and music systems',
          'Intercommunication and paging systems',
          'Telephone systems',
          'Call systems',
          'Television systems',
          'Clock and program systems',
          'Fire alarm systems',
          'Security and detection systems',
          'Local area networks'
        ]
      },
      {
        name: 'Other electrical systems',
        subelements: [
          'Grounding systems',
          'Emergency lighting and power systems',
          'Floor raceway systems',
          'Other special electrical systems',
          'General construction items for electrical'
        ]
      }
    ]
  },
  {
    id: 'equipment_and_furnishings',
    name: 'Equipment and furnishings',
    elementGroups: [
      {
        name: 'Commercial equipment',
        subelements: [
          'Security and vault equipment',
          'Teller and service equipment',
          'Registration equipment',
          'Checkroom equipment',
          'Mercantile equipment',
          'Laundry and dry cleaning equipment',
          'Vending equipment',
          'Office equipment'
        ]
      },
      {
        name: 'Institutional equipment',
        subelements: [
          'Ecclesiastical equipment',
          'Library equipment',
          'Theater and stage equipment',
          'Instrumental equipment',
          'Audiovisual equipment',
          'Detention equipment',
          'Laboratory equipment',
          'Medical equipment',
          'Other institutional equipment'
        ]
      },
      {
        name: 'Vehicular equipment',
        subelements: [
          'Vehicular service equipment',
          'Parking control equipment',
          'Loading dock equipment',
          'Other vehicular equipment'
        ]
      },
      {
        name: 'Other equipment',
        subelements: [
          'Maintenance equipment',
          'Solid waste handling equipment',
          'Food service equipment',
          'Residential equipment',
          'Unit kitchens',
          'Window washing equipment',
          'Other specialty equipment'
        ]
      },
      {
        name: 'Fixed furnishings',
        subelements: [
          'Fixed artwork',
          'Fixed casework',
          'Blinds and window treatments',
          'Fixed floor grilles and mats',
          'Fixed multiple seating',
          'Fixed interior landscaping'
        ]
      },
      {
        name: 'Movable furnishings',
        subelements: [
          'Movable artwork',
          'Furniture and accessories',
          'Movable rugs and mats',
          'Movable interior landscaping'
        ]
      }
    ]
  },
  {
    id: 'special_construction_and_demolition',
    name: 'Special construction and demolition',
    elementGroups: [
      {
        name: 'Special structures',
        subelements: [
          'Air-supported structures',
          'Pre-engineered structures',
          'Other special structures'
        ]
      },
      {
        name: 'Integrated construction',
        subelements: [
          'Integrated assemblies',
          'Special purpose rooms',
          'Other integrated construction'
        ]
      },
      {
        name: 'Special construction systems',
        subelements: [
          'Sound vibration and seismic construction',
          'Radiation protection',
          'Special security systems',
          'Vaults',
          'Other special construction systems'
        ]
      },
      {
        name: 'Special facilities',
        subelements: [
          'Aquatic facilities',
          'Ice rinks',
          'Site-constructed incinerators',
          'Kennels and animal shelters',
          'Liquid and gas storage tanks',
          'Other special facilities'
        ]
      },
      {
        name: 'Special controls and instrumentation',
        subelements: [
          'Recording instrumentation',
          'Building automation system specialty',
          'Other special controls and instrumentation'
        ]
      },
      {
        name: 'Building elements demolition',
        subelements: [
          'Building interior demolition',
          'Building exterior demolition'
        ]
      },
      {
        name: 'Hazardous components abatement',
        subelements: [
          'Removal of hazardous components',
          'Encapsulation of hazardous components'
        ]
      }
    ]
  },
  {
    id: 'building_related_sitework',
    name: 'Building-related sitework',
    elementGroups: [
      {
        name: 'Site clearing',
        subelements: ['Clearing and grubbing', 'Tree removal and thinning']
      },
      {
        name: 'Site demolition and relocation',
        subelements: [
          'Building demolition',
          'Demolition of site components',
          'Relocation of building and utilities',
          'Utilities relocation'
        ]
      },
      {
        name: 'Site earthwork',
        subelements: [
          'Site grading and excavation',
          'Borrow fill',
          'Soil stabilization and treatment',
          'Site dewatering',
          'Site shoring',
          'Embankments',
          'Erosion control'
        ]
      },
      {
        name: 'Hazardous waste remediation',
        subelements: [
          'Removal of contaminated soil',
          'Soil restoration and treatment'
        ]
      },
      {
        name: 'Roadways',
        subelements: [
          'Bases and sub-bases',
          'Paving and surfacing',
          'Curbs gutters and drains',
          'Guardrails and barriers',
          'Painted lines',
          'Markings and signage',
          'Vehicular bridges'
        ]
      },
      {
        name: 'Parking lots',
        subelements: [
          'Parking bases and sub-bases',
          'Parking paving and surfacing',
          'Curbs rails and barriers',
          'Parking booths and equipment',
          'Parking markings and signage'
        ]
      },
      {
        name: 'Pedestrian paving',
        subelements: [
          'Pedestrian paving and surfacing',
          'Edging',
          'Exterior steps',
          'Pedestrian bridges'
        ]
      },
      {
        name: 'Site development',
        subelements: [
          'Fences and gates',
          'Retaining walls',
          'Terrace and perimeter walls',
          'Site signage',
          'Site furnishings',
          'Fountains pools and watercourses',
          'Playing fields',
          'Flagpoles',
          'Miscellaneous site structures'
        ]
      },
      {
        name: 'Landscaping',
        subelements: [
          'Fine grading and soil preparation',
          'Erosion control measures',
          'Topsoil and planting beds',
          'Seeding and sodding',
          'Planting',
          'Planters',
          'Irrigation systems',
          'Other landscape features'
        ]
      },
      {
        name: 'Water supply',
        subelements: [
          'Potable water distribution and storage',
          'Non-potable water distribution and storage',
          'Well systems',
          'Fire protection distribution and storage',
          'Water pumping stations',
          'Packaged water treatment plants'
        ]
      },
      {
        name: 'Sanitary sewer',
        subelements: [
          'Sanitary piping',
          'Manholes and cleanouts',
          'Septic disposal systems',
          'Lift stations',
          'Packaged wastewater treatment plants',
          'Septic tanks',
          'Drain fields'
        ]
      },
      {
        name: 'Storm sewer',
        subelements: [
          'Storm piping',
          'Storm manholes',
          'Headwalls and catch basins',
          'Storm lift stations',
          'Retention ponds',
          'Ditches and culverts'
        ]
      },
      {
        name: 'Heating distribution',
        subelements: [
          'Site steam supply',
          'Condensate return',
          'Site hot water supply',
          'Heating pumping stations'
        ]
      },
      {
        name: 'Cooling distribution',
        subelements: [
          'Site chilled water piping',
          'Wells for cooling and heating',
          'Cooling pumping stations',
          'Cooling towers on site'
        ]
      },
      {
        name: 'Fuel distribution',
        subelements: [
          'Fuel piping',
          'Fuel equipment',
          'Fuel storage tanks',
          'Fuel dispensing stations'
        ]
      },
      {
        name: 'Other site mechanical utilities',
        subelements: [
          'Industrial waste systems',
          'POL distribution systems'
        ]
      },
      {
        name: 'Electrical distribution',
        subelements: [
          'Substations',
          'Overhead power distribution',
          'Underground power distribution'
        ]
      },
      {
        name: 'Site lighting',
        subelements: [
          'Site fixtures and transformers',
          'Site poles',
          'Site wiring conduits and ductbanks',
          'Site lighting controls'
        ]
      },
      {
        name: 'Site communication and security',
        subelements: [
          'Site communications systems',
          'Site security and alarm systems'
        ]
      },
      {
        name: 'Other site electrical utilities',
        subelements: [
          'Cathodic protection',
          'Site emergency power generation'
        ]
      },
      {
        name: 'Service and pedestrian tunnels',
        subelements: [
          'Service tunnels',
          'Trench boxes',
          'Pedestrian tunnels'
        ]
      },
      {
        name: 'Other site systems',
        subelements: ['Snow melting systems']
      }
    ]
  }
];

/** Stable major-group ids — use with hats (AECOHats) for elemental coverage. */
export const ELEMENTAL_MAJOR_GROUP_IDS = ELEMENTAL_MAJOR_GROUPS.map((m) => m.id);

/**
 * @returns {string[]} All subelement strings (deduplicated).
 */
export function flattenElementalTaxonomy() {
  const set = new Set();
  for (const major of ELEMENTAL_MAJOR_GROUPS) {
    for (const g of major.elementGroups) {
      for (const s of g.subelements) {
        set.add(s.trim());
      }
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export const ELEMENTAL_TAXONOMY_LEAVES = flattenElementalTaxonomy();

/**
 * Broad buckets. Keys are stable for code; labels are for UI if needed.
 */
export const COMPONENT_GROUPS = {
  // --- Substructure & foundations ---
  foundations: [
    'anchor bolt template',
    'anchor bolt',
    'bearing stratum',
    'caisson',
    'drilled pier',
    'driven pile',
    'footing',
    'foundation wall',
    'grade beam',
    'footing heel',
    'mat foundation',
    'micropile',
    'pile cap',
    'pile',
    'raft slab',
    'spread footing',
    'step footing',
    'strip footing',
    'trench footing',
    'turn-down slab edge',
    'underpinning',
    'void former'
  ],
  below_grade_envelope: [
    'blind-side waterproofing',
    'dimple board',
    'drainage mat',
    'drainage composite',
    'foundation drain',
    'insulation below grade',
    'mud slab',
    'protection board',
    'sump pit',
    'tanking',
    'under-slab insulation',
    'under-slab vapor barrier',
    'waterproofing membrane',
    'weep hole'
  ],
  slab_on_grade: [
    'concrete slab on grade',
    'control joint',
    'construction joint',
    'contraction joint',
    'isolation joint',
    'joint filler',
    'metal deck slab',
    'post-tension tendon',
    'radiant tubing',
    'slab depression',
    'slab edge insulation',
    'structural slab on grade',
    'vapor retarder',
    'wire mesh'
  ],

  // --- Structural: concrete & precast ---
  structural_concrete: [
    'bond beam',
    'cast-in-place concrete',
    'concrete beam',
    'concrete column',
    'concrete corbel',
    'concrete haunch',
    'concrete shear wall',
    'concrete topping',
    'coupler',
    'dapped end',
    'drop panel',
    'embed plate',
    'lift hook',
    'lintel',
    'post-tension anchorage',
    'rebar cage',
    'rebar chair',
    'rebar',
    'reinforcement',
    'shear key',
    'spandrel panel',
    'stirrup',
    'tilt-up panel',
    'void box'
  ],
  precast_prestressed: [
    'double tee',
    'hollow-core plank',
    'precast beam',
    'precast column',
    'precast stair',
    'precast wall panel',
    'prestressing strand',
    'shear connector',
    'structural precast'
  ],

  // --- Structural: steel ---
  structural_steel: [
    'angle',
    'beam',
    'bolt',
    'braced frame',
    'channel',
    'clip angle',
    'column base',
    'column splice',
    'connection plate',
    'decking',
    'girt',
    'gusset plate',
    'hollow structural section',
    'joist girder',
    'moment connection',
    'moment frame',
    'purlin',
    'safety cable',
    'shear tab',
    'steel column',
    'steel joist',
    'steel plate',
    'stiffener',
    'structural steel',
    'threaded rod',
    'truss',
    'welded connection',
    'wide-flange beam'
  ],

  // --- Structural: wood & mass timber ---
  wood_light_frame: [
    'beam pocket',
    'blocking',
    'bottom plate',
    'ceiling joist',
    'engineered joist',
    'furring strip',
    'header',
    'I-joist',
    'jack stud',
    'king stud',
    'ledger',
    'lumber',
    'metal stud',
    'osb sheathing',
    'plywood sheathing',
    'purlin',
    'rafter',
    'ridge board',
    'rim joist',
    'sill plate',
    'stud',
    'subfloor',
    'top plate',
    'truss',
    'wall bracing',
    'wood beam',
    'wood column'
  ],
  mass_timber: [
    'CLT panel',
    'cross-laminated timber',
    'dowel-laminated timber',
    'glulam beam',
    'glulam column',
    'mass timber connector',
    'nail-laminated timber',
    'timber deck'
  ],
  masonry: [
    'brick',
    'CMU',
    'control joint',
    'coursing',
    'masonry anchor',
    'masonry veneer',
    'mortar joint',
    'reinforced masonry',
    'stone',
    'through-wall flashing',
    'wall tie'
  ],

  // --- Excavation & earthwork ---
  earthwork: [
    'borrow',
    'compaction',
    'cut',
    'embankment',
    'erosion control blanket',
    'excavation',
    'fill',
    'geogrid',
    'geotextile',
    'grading',
    'haul',
    'lime stabilization',
    'over-excavation',
    'proof roll',
    'silt fence',
    'stockpile',
    'strip footing excavation',
    'subgrade',
    'swale',
    'topsoil'
  ],
  shoring_retention: [
    'anchor',
    'caisson wall',
    'cantilever wall',
    'deadman',
    'lagging',
    'raker',
    'secant pile wall',
    'sheet pile',
    'soldier pile',
    'tieback',
    'underpinning pit'
  ],

  // --- Building shell: roof ---
  roofing: [
    'ballast',
    'base flashing',
    'cant strip',
    'counterflashing',
    'cricket',
    'drain sump',
    'EPDM',
    'expansion joint cover',
    'fall protection anchor',
    'gutter',
    'insulation board',
    'membrane roof',
    'metal roof',
    'parapet cap',
    'penetration boot',
    'ridge vent',
    'roof anchor',
    'roof hatch',
    'roof insulation',
    'roof paver',
    'roof screen',
    'roof vent',
    'scupper',
    'shingle',
    'slope',
    'snow guard',
    'TPO',
    'through-wall flashing'
  ],

  // --- Building shell: walls & cladding ---
  exterior_wall: [
    'batt insulation',
    'brick veneer',
    'cavity wall',
    'cladding panel',
    'continuous insulation',
    'corner trim',
    'drainage cavity',
    'furring',
    'metal panel',
    'rainscreen',
    'sheathing',
    'siding',
    'stone veneer',
    'stucco',
    'sunshade',
    'thermal break',
    'ventilated cavity',
    'window head',
    'window jamb',
    'window sill'
  ],

  // --- Glazing & storefront ---
  glazing: [
    'awning window',
    'balcony door',
    'casement window',
    'curtain wall mullion',
    'curtain wall transom',
    'curtain wall',
    'double glazing',
    'fixed glazing',
    'glass fin',
    'glazing gasket',
    'handrail glass',
    'IGU',
    'louver',
    'operable window',
    'sealant joint',
    'shadow box',
    'skylight',
    'spandrel panel',
    'storefront',
    'sunshade device',
    'triple glazing',
    'vision glass',
    'window wall'
  ],

  // --- Weather barriers ---
  weather_resistive: [
    'air barrier membrane',
    'building paper',
    'fluid-applied barrier',
    'peel-and-stick membrane',
    'self-adhered flashing',
    'sill pan',
    'through-wall sleeve',
    'vapor retarder',
    'weather barrier',
    'WRB'
  ],

  // --- Interior: framing & rough ---
  interior_rough: [
    'acoustic insulation',
    'backing',
    'batt insulation',
    'ceiling joist',
    'channel',
    'cold-formed steel',
    'corner bead',
    'drywall',
    'furring channel',
    'gypsum board',
    'hat channel',
    'metal stud',
    'resilient channel',
    'rough opening',
    'shaft wall',
    'sound batt',
    'track',
    'wood stud'
  ],

  // --- Interior: finishes ---
  interior_finishes: [
    'acoustic ceiling baffle',
    'acoustic ceiling tile',
    'acoustical panel',
    'baseboard',
    'carpet tile',
    'carpet',
    'ceiling grid',
    'chair rail',
    'cove base',
    'epoxy flooring',
    'hardwood flooring',
    'laminate flooring',
    'leveling compound',
    'luxury vinyl tile',
    'paint',
    'resilient flooring',
    'stone flooring',
    'stretch ceiling',
    'tile flooring',
    'VCT',
    'vinyl wallcovering',
    'wallcovering',
    'wood flooring'
  ],

  // --- Interior: openings & specialties ---
  interior_openings: [
    'access door',
    'door closer',
    'door frame',
    'door hardware',
    'door operator',
    'door stop',
    'electrified hinge',
    'exit device',
    'hinge',
    'lockset',
    'overhead door',
    'pocket door',
    'revolving door',
    'sliding door',
    'threshold'
  ],
  interior_specialties: [
    'access panel',
    'corner guard',
    'cubicle',
    'fire extinguisher cabinet',
    'fixed seating',
    'grab bar',
    'handrail',
    'locker',
    'markerboard',
    'mirror',
    'paper towel dispenser',
    'shower partition',
    'toilet accessory',
    'toilet partition',
    'towel bar',
    'visual display',
    'wall guard'
  ],

  millwork: [
    'appliance garage',
    'cabinet',
    'casework',
    'countertop',
    'crown molding',
    'custom millwork',
    'kick plate',
    'laminate countertop',
    'plastic laminate',
    'quartz countertop',
    'solid surface',
    'stone countertop',
    'wood trim'
  ],

  // --- Mechanical: equipment ---
  mechanical_equipment: [
    'air-cooled chiller',
    'air handling unit',
    'boiler',
    'cooling tower',
    'CRAC unit',
    'dehumidifier',
    'DOAS unit',
    'energy recovery ventilator',
    'exhaust fan',
    'fan coil unit',
    'heat exchanger',
    'heat pump',
    'humidifier',
    'make-up air unit',
    'package rooftop unit',
    'pump',
    'split system',
    'steam boiler',
    'terminal unit',
    'unit heater',
    'unit ventilator',
    'VAV box'
  ],

  // --- Mechanical: airside ---
  ductwork_airside: [
    'air device',
    'air plenum',
    'backdraft damper',
    'balancing damper',
    'duct access door',
    'duct liner',
    'duct silencer',
    'duct tap',
    'duct transition',
    'duct',
    'ductwork hanger',
    'flex duct',
    'grille',
    'louver',
    'radiant panel',
    'register',
    'return air grille',
    'smoke damper',
    'sound attenuator',
    'supply diffuser',
    'transfer grille',
    'volume damper'
  ],

  // --- Mechanical: hydronics & refrigerant ---
  mechanical_piping: [
    'air separator',
    'ball valve',
    'butterfly valve',
    'chilled water pipe',
    'condenser water pipe',
    'condensate drain',
    'control valve',
    'expansion tank',
    'flexible connector',
    'gate valve',
    'glycol pipe',
    'heat pump piping',
    'hydronic pipe',
    'insulated pipe',
    'pipe hanger',
    'pressure reducing valve',
    'refrigerant line',
    'strainer',
    'trap primer'
  ],

  // --- Plumbing: fixtures & equipment ---
  plumbing_fixtures: [
    'bathtub',
    'bidet',
    'drinking fountain',
    'floor drain',
    'floor sink',
    'grease interceptor',
    'lavatory',
    'mop sink',
    'service sink',
    'shower',
    'sink',
    'urinal',
    'water closet',
    'wash fountain'
  ],
  plumbing_piping: [
    'backflow preventer',
    'cleanout',
    'domestic cold water',
    'domestic hot water return',
    'domestic hot water',
    'drain pipe',
    'fixture branch',
    'hose bib',
    'manifold',
    'natural gas pipe',
    'pipe insulation',
    'pressure booster',
    'roof drain',
    'sanitary lift',
    'sanitary pipe',
    'sleeve',
    'storm drain',
    'trap',
    'vent pipe',
    'vent stack',
    'water booster pump',
    'water heater',
    'water meter',
    'water service'
  ],
  plumbing_specialty: [
    'acid waste pipe',
    'compressed air line',
    'interceptors',
    'medical air outlet',
    'medical gas alarm',
    'medical gas manifold',
    'medical vacuum outlet',
    'nitrogen',
    'oxygen outlet',
    'pure water loop',
    'waste neutralization'
  ],

  // --- Electrical: distribution ---
  electrical_distribution: [
    'automatic transfer switch',
    'bus duct',
    'cable bus',
    'circuit breaker',
    'disconnect switch',
    'distribution panel',
    'electrical closet',
    'electrical room',
    'feeder',
    'fused disconnect',
    'generator',
    'ground rod',
    'grounding bus',
    'lightning protection',
    'main switchboard',
    'meter socket',
    'motor control center',
    'panelboard',
    'pull box',
    'service entrance',
    'step-down transformer',
    'switchboard',
    'switchgear',
    'transformer',
    'UPS'
  ],
  electrical_branch: [
    'branch circuit',
    'cable tray',
    'conduit body',
    'conduit',
    'device box',
    'EMT',
    'floor box',
    'junction box',
    'MC cable',
    'outlet',
    'raceway',
    'surface raceway',
    'wireway'
  ],
  electrical_lighting: [
    'bollard light',
    'ceiling light',
    'control station',
    'dimmer',
    'emergency light',
    'exit sign',
    'fixture whip',
    'high-bay light',
    'LED fixture',
    'lighting control panel',
    'occupancy sensor',
    'pendant light',
    'photosensor',
    'recessed light',
    'strip light',
    'track lighting',
    'wall sconce'
  ],

  // --- Low voltage & systems ---
  low_voltage: [
    'access control reader',
    'AV plate',
    'camera',
    'ceiling speaker',
    'data rack',
    'fiber patch panel',
    'fire alarm annunciator',
    'fire alarm control panel',
    'fire alarm device',
    'intercom',
    'intrusion sensor',
    'network switch',
    'patch cord',
    'speaker grille',
    'structured cable',
    'telecom outlet',
    'Wi-Fi access point'
  ],

  // --- Fire protection ---
  fire_sprinkler: [
    'alarm valve',
    'backflow preventer fire',
    'branch line',
    'deluge valve',
    'dry pipe valve',
    'fire department connection',
    'fire pump',
    'flow switch',
    'hose valve',
    'inspector test',
    'pendant sprinkler',
    'pipe hanger fire',
    'preaction valve',
    'pressure gauge',
    'siamese connection',
    'sprinkler head',
    'standpipe riser',
    'supervisory switch',
    'tamper switch',
    'test drain',
    'wet pipe sprinkler'
  ],
  fire_special: [
    'clean agent cylinder',
    'foam bladder tank',
    'foam discharge',
    'hood suppression',
    'kitchen hood',
    'special hazard system'
  ],

  // --- Life safety (non-sprinkler) ---
  life_safety: [
    'area of refuge',
    'door holder',
    'duct smoke detector',
    'fire alarm strobe',
    'fire extinguisher',
    'fire-rated assembly',
    'flame detector',
    'heat detector',
    'manual pull station',
    'smoke detector',
    'voice evacuation speaker'
  ],

  // --- Controls & BAS ---
  controls_bms: [
    'actuator',
    'BACnet device',
    'building automation server',
    'control panel',
    'DDC controller',
    'flow meter',
    'humidity sensor',
    'pneumatic tubing',
    'pressure sensor',
    'thermostat',
    'VFD',
    'zone sensor'
  ],

  // --- Conveying ---
  conveying: [
    'elevator cab',
    'elevator counterweight',
    'elevator guide rail',
    'elevator hoistway',
    'elevator machine',
    'elevator pit',
    'elevator rail bracket',
    'escalator truss',
    'moving walk',
    'pit ladder'
  ],

  // --- Site: utilities ---
  site_utilities: [
    'catch basin',
    'cleanout',
    'culvert',
    'fire hydrant lead',
    'force main',
    'grease interceptor exterior',
    'headwall',
    'hydrant',
    'lift station',
    'manhole',
    'meter pit',
    'potable water main',
    'sanitary sewer main',
    'septic tank',
    'storm sewer',
    'utility trench',
    'valve vault',
    'water main'
  ],
  site_electrical: [
    'duct bank',
    'pad-mounted transformer',
    'site lighting pole',
    'site panel',
    'underground feeder'
  ],

  // --- Site: paving & hardscape ---
  site_paving: [
    'asphalt pavement',
    'bollard',
    'concrete curb',
    'concrete pavement',
    'expansion joint pavement',
    'parking bumper',
    'speed bump',
    'striping',
    'tactile warning'
  ],

  // --- Site: landscape ---
  landscape: [
    'drip emitter',
    'edging',
    'geogrid retaining',
    'grate',
    'irrigation controller',
    'irrigation main',
    'mulch',
    'plant bed',
    'retaining wall landscape',
    'root barrier',
    'sod',
    'tree grate',
    'tree pit',
    'turf',
    'zone valve'
  ],

  // --- Temporary & demolition ---
  temp_demolition: [
    'concrete saw cut',
    'containment barrier',
    'demolition',
    'dust barrier',
    'hoarding',
    'saw-cut slab',
    'selective demolition',
    'shoring post',
    'temporary bracing',
    'temporary fence',
    'temporary power',
    'temporary protection'
  ],

  // --- Equipment & FF&E (common) ---
  equipment_furnishings: [
    'appliance',
    'bench',
    'bleacher',
    'casework equipment',
    'chiller plant skid',
    'cooling tower fill',
    'dock leveler',
    'dock seal',
    'dumbwaiter',
    'food service equipment',
    'generator enclosure',
    'hoist',
    'lab casework',
    'loading dock',
    'modular furniture',
    'racking',
    'safe',
    'stage equipment',
    'walk-in cooler'
  ],

  // --- Fasteners, anchors, misc hardware ---
  fasteners: [
    'adhesive anchor',
    'bolt',
    'expansion anchor',
    'lag screw',
    'nail',
    'powder-actuated fastener',
    'screw',
    'toggle bolt',
    'wedge anchor',
    'welded stud'
  ],

  // --- Building common: grids, levels, openings ---
  building_references: [
    'benchmark',
    'building line',
    'column grid',
    'construction grid',
    'control joint building',
    'datum',
    'expansion joint building',
    'finish floor elevation',
    'grid line',
    'level',
    'opening',
    'property line',
    'reference plane',
    'survey point',
    'work point'
  ],

  // --- Extra part-level / field terms (fills gaps vs. elemental names) ---
  extended_parts_and_methods: [
    'abrasive blast',
    'admixture',
    'anchor channel',
    'annealed glass',
    'applied fireproofing',
    'asphalt shingle',
    'ball valve specialty',
    'bearing pad',
    'bird screen',
    'blast resistance',
    'bond breaker',
    'bonding agent',
    'building wrap',
    'cable tray cover',
    'cathodic protection anode',
    'caulk joint',
    'cavity fire blocking',
    'chip seal',
    'choker sling',
    'coffer dam',
    'cold-formed steel stud',
    'compression seal',
    'concrete curing compound',
    'concrete sealer',
    'conductor head',
    'construction joint sealant',
    'cool roof coating',
    'core drill',
    'corner guard stainless',
    'crane mat',
    'crawl space liner',
    'cross bracing',
    'daylight sensor',
    'deck flange',
    'deflection clip',
    'dehumidification desiccant',
    'door bottom sweep',
    'door coordinator',
    'door frame reinforcement',
    'door gasketing',
    'door hinge',
    'door lite',
    'door panic hardware',
    'door threshold extension',
    'door viewer',
    'double-check valve',
    'drainage geocomposite',
    'duct access panel',
    'duct flex connector',
    'duct smoke detector housing',
    'duct strap',
    'duct turning vane',
    'edge form',
    'elastomeric bearing',
    'elastomeric coating',
    'electric tracing',
    'electronic metering',
    'elevator guide shoe',
    'elevator rail',
    'embed channel',
    'engineered fill',
    'epoxy injection',
    'expansion loop',
    'fabric reinforcement',
    'fall protection anchor permanent',
    'fiber reinforcement',
    'finger joint lumber',
    'fire caulk',
    'fire collar',
    'fire wrap',
    'fishplate',
    'floor box cover',
    'floor stain',
    'fluid-applied flashing',
    'foam backer rod',
    'footing key',
    'form oil',
    'frost protected shallow foundation',
    'fuel oil day tank',
    'fully tempered glass',
    'gasketed louver',
    'gauge glass',
    'geomembrane',
    'glass fin bracket',
    'grout bag',
    'grout port',
    'guardrail post',
    'guy wire',
    'heat trace cable',
    'high-strength bolt',
    'hinge pin',
    'hose stream device',
    'impact glazing',
    'infrared heater',
    'intumescent paint',
    'inverter electrical',
    'isolation pad',
    'jacking shoe',
    'joint sealant',
    'kicker concrete',
    'knee brace',
    'laminated glass',
    'laminated strand lumber',
    'landscape fabric',
    'lead lining',
    'leaf filter',
    'ledger board',
    'lift-slab jack',
    'lightning rod',
    'lintel flashing',
    'load bank',
    'louver blade',
    'louver damper combo',
    'low-e coating',
    'masonry control joint',
    'masonry reinforcement ladder',
    'mastic',
    'metal deck shear stud',
    'meter main',
    'modular wiring',
    'moisture meter',
    'mortar net',
    'mullion splice',
    'noise barrier panel',
    'non-shrink grout',
    'occupancy sensor ceiling',
    'odor control vent',
    'oil water separator',
    'panel seam',
    'parge coat',
    'pedestal paver',
    'perimeter edge strip',
    'photovoltaic module',
    'pile splice',
    'pipe bollard',
    'pipe guide',
    'pipe roller',
    'pipe shoe',
    'pipe sleeve fire rated',
    'pipe support trapeze',
    'plastic shim',
    'platform edge',
    'plywood shear wall',
    'polyethylene vapor barrier sheet',
    'pond liner',
    'portland cement',
    'post-installed anchor',
    'potable water booster',
    'preaction valve trim',
    'prefabricated bathroom pod',
    'pressure reducing valve station',
    'pressure tank',
    'primer coat',
    'punch list item',
    'radiant manifold',
    'radiation shielding board',
    'recessed mat well',
    'reinforcing dowel',
    'retrofit bolt',
    'ridge vent baffled',
    'roof anchor permanent',
    'roof cricket flashing',
    'roof walkway pad',
    'rubber gasket',
    'sacrificial anode',
    'safety cable lifeline',
    'sand layer',
    'saw-cut joint seal',
    'scaffold tie-in',
    'scupper liner',
    'seismic brace',
    'seismic joint cover',
    'service sink faucet',
    'shear dowel',
    'sheet lead',
    'shim pack',
    'shotcrete',
    'shrink-wrap containment',
    'sight glass',
    'sill pan flashing',
    'single-ply membrane',
    'site power pedestal',
    'slab edge insulation board',
    'slip joint',
    'sloped insulation crickets',
    'smoke baffle',
    'smoke curtain',
    'snap cover raceway',
    'snow fence',
    'soffit vent',
    'solar thermal collector',
    'solid waste compactor',
    'sound mat',
    'spall repair mortar',
    'splash block',
    'split bus panel',
    'spray foam insulation',
    'sprinkler escutcheon',
    'stack head',
    'stair nosing',
    'steam trap station',
    'steel plate washer',
    'stiffener plate',
    'storm collar',
    'structural epoxy',
    'stub-up',
    'subdrain',
    'sump pump',
    'survey hub',
    'swing stage anchor',
    'tack weld',
    'tactile tile',
    'tank cathodic protection',
    'temporary fence panel',
    'thermal bridge break',
    'tie rod form system',
    'toggle bolt specialty',
    'traffic coating',
    'transfer girder',
    'trench drain body',
    'trench plate',
    'turnbuckle',
    'two-way cleanout',
    'unit skylight',
    'utility chase',
    'vacuum breaker',
    'vibration isolation pad',
    'vibration isolation hanger',
    'wall bracing plywood',
    'wall sleeve',
    'washer plate',
    'water hammer arrestor',
    'water softener',
    'weather stripping',
    'weep screed',
    'welded wire fabric',
    'window film',
    'window operator',
    'wind uplift clip',
    'wire mesh stucco',
    'wood preservative',
    'z-bar flashing'
  ],

  /**
   * Extra vocabulary for recognition (synonyms, BIM/host language, products, niche scopes).
   * Keeps COMPONENT_GROUPS navigable while maximizing “known term” coverage.
   */
  recognition_bim_hosting: [
    'adaptive component',
    'area',
    'area boundary',
    'assembly',
    'boundary conditions',
    'building pad',
    'ceiling',
    'ceiling grid line',
    'copy monitor',
    'design option',
    'detail component',
    'detail item',
    'detail line',
    'dimension string',
    'divided surface',
    'duct accessory',
    'duct insulation lining',
    'duct placeholder',
    'electrical circuit',
    'electrical equipment',
    'electrical fixture',
    'element',
    'elevator shaft',
    'face-based family',
    'family',
    'filled region',
    'flex duct run',
    'floor',
    'floor opening',
    'generic annotation',
    'generic model',
    'group',
    'host',
    'import instance',
    'in-place family',
    'insulation lining',
    'level',
    'line-based family',
    'linked model',
    'mass',
    'matchline',
    'mechanical equipment',
    'mechanical system',
    'model group',
    'model line',
    'MEP fabrication part',
    'multi-category',
    'nested family',
    'opening',
    'pad',
    'parametric',
    'part',
    'path of travel',
    'phase',
    'phasing',
    'pipe accessory',
    'pipe insulation',
    'pipe placeholder',
    'place holder',
    'placed family',
    'plan region',
    'point-based family',
    'profile',
    'project base point',
    'project north',
    'property line',
    'reference line',
    'reference plane',
    'reference point',
    'region',
    'repeating detail',
    'reveal',
    'revision cloud',
    'room',
    'room bounding',
    'room separation',
    'routing preference',
    'scope box',
    'section box',
    'shaft opening',
    'shared coordinates',
    'shared level',
    'site',
    'sketch line',
    'slab edge',
    'sloped glazing',
    'space',
    'space separation',
    'split face',
    'sprinkler system',
    'stair',
    'stair path',
    'stair run',
    'stair support',
    'structural beam',
    'structural brace',
    'structural column',
    'structural connection',
    'structural foundation',
    'structural framing',
    'sun path',
    'surface pattern',
    'survey point',
    'sweep',
    'swung door',
    'symbol',
    'system',
    'system panel',
    'system zone',
    'tag',
    'text note',
    'title block',
    'topography',
    'true north',
    'type catalog',
    'view',
    'view range',
    'viewport',
    'visibility graphics',
    'void',
    'wall',
    'wall sweep',
    'work plane',
    'workset',
    'zone'
  ],

  recognition_materials_products: [
    'AAC block',
    'acrylic solid surface',
    'aggregate base',
    'air entraining admixture',
    'aluminum composite panel',
    'aluminum storefront',
    'asphalt binder',
    'asphalt emulsion',
    'bio-based insulation',
    'brick veneer tie',
    'calcium silicate board',
    'cellular glass insulation',
    'cellulose insulation',
    'cement board',
    'cementitious fireproofing',
    'ceramic tile',
    'chipboard',
    'closed-cell foam',
    'cold-formed steel track',
    'composite metal deck',
    'composite panel',
    'concrete admixture',
    'concrete aggregate',
    'concrete curing blanket',
    'concrete pigment',
    'concrete sealer surface',
    'copper flashing',
    'cork flooring',
    'cotton insulation batt',
    'countertop laminate',
    'crushed stone base',
    'dense glass insulation',
    'dimension lumber',
    'engineered fill',
    'engineered wood product',
    'epdm flashing tape',
    'expanded metal lath',
    'extruded polystyrene insulation',
    'fiber cement siding',
    'fiberglass batt',
    'fiberglass duct liner',
    'fire-rated drywall',
    'flexible duct insulation',
    'fluid-applied air barrier',
    'galvanized sheet metal',
    'glass mat gypsum',
    'granite',
    'gravel',
    'hardwood lumber',
    'high-density polyethylene liner',
    'high-performance concrete',
    'hot-mix asphalt',
    'hydrated lime',
    'impact-resistant gypsum',
    'intumescent coating',
    'lead-lined gypsum',
    'limestone',
    'linoleum',
    'loose-fill insulation',
    'marble',
    'masonry mortar',
    'masonry reinforcement wire',
    'MDF',
    'metal composite material',
    'mineral fiber insulation',
    'mineral wool insulation',
    'moisture-resistant drywall',
    'mortar bed',
    'non-shrink grout bag',
    'open-cell foam',
    'oriented strand board',
    'phenolic foam insulation',
    'plastic laminate',
    'plywood sheathing rated',
    'polyethylene sheeting',
    'polyiso insulation',
    'polyurethane foam',
    'porcelain tile',
    'Portland cement Type I',
    'Portland cement Type II',
    'Portland cement Type III',
    'precast concrete finish',
    'PVC membrane',
    'quarry tile',
    'quartz surfacing',
    'rigid foam insulation',
    'rubber flooring',
    'sand aggregate',
    'sealant backer rod',
    'sheet membrane waterproofing',
    'silicone sealant',
    'slag cement',
    'slate',
    'slip-resistant tile',
    'softwood lumber',
    'sound mat underlayment',
    'spray polyurethane foam',
    'stainless steel sheet',
    'stone veneer anchor',
    'structural lightweight concrete',
    'structural steel primer',
    'stucco lath',
    'terrazzo',
    'thermal insulation board',
    'thermoplastic polyolefin',
    'urethane sealant',
    'vinyl composition tile',
    'vinyl sheet flooring',
    'vinyl wall base',
    'water-based acrylic coating',
    'waterproofing sheet',
    'wood I-joist',
    'wrought iron',
    'zinc cladding'
  ],

  recognition_mep_systems: [
    'active chilled beam',
    'active slab',
    'air-cooled condenser',
    'air economizer',
    'air-source heat pump',
    'atmospheric boiler',
    'BACnet gateway',
    'BACnet router',
    'balancing valve circuit setter',
    'barometric damper',
    'blow-off valve',
    'boiler stack',
    'breeching',
    'building chilled water loop',
    'building hot water loop',
    'chemical feed pot feeder',
    'chilled beam passive',
    'chilled water primary-secondary',
    'closed cooling tower',
    'coil freeze stat',
    'combustion air intake',
    'condensate neutralizer',
    'condensing boiler',
    'condensing unit',
    'cooling tower basin',
    'cooling tower cell',
    'cooling tower fan',
    'cross-flow cooling tower',
    'CRAC unit',
    'CRAH unit',
    'dedicated outdoor air',
    'dew point control',
    'differential pressure gauge',
    'direct digital control',
    'dry cooler',
    'duct static pressure sensor',
    'economizer damper',
    'electric duct heater',
    'electronic expansion valve',
    'enthalpy wheel',
    'evaporative condenser',
    'fan coil',
    'fan-powered box',
    'fire smoke damper combination',
    'floor-mounted unit heater',
    'free cooling coil',
    'glycol feeder',
    'head pressure control',
    'heat exchanger plate',
    'heat exchanger shell and tube',
    'heat pump water heater',
    'heat recovery wheel',
    'high-efficiency particulate filter',
    'humidifier steam canister',
    'hydronic balancing valve',
    'indirect-fired heater',
    'in-row cooler',
    'infrared tube heater',
    'laminar flow diffuser',
    'lead-lag boiler control',
    'magnetic bearing chiller',
    'make-up air heater',
    'manifold station hydronic',
    'mixed air plenum',
    'modulating burner',
    'oil-fired boiler',
    'open cooling tower',
    'outside air damper',
    'packaged rooftop air conditioner',
    'parallel fan-powered box',
    'plate and frame heat exchanger',
    'pneumatic actuator',
    'primary pump',
    'radiant ceiling panel',
    'radiant floor manifold',
    'refrigerant receiver',
    'return fan',
    'rotary heat exchanger',
    'secondary pump',
    'series fan-powered box',
    'smoke exhaust fan',
    'steam condensate pump',
    'steam pressure reducing station',
    'steam trap thermostatic',
    'supply fan',
    'thermal dispersion flow switch',
    'thermostatic mixing valve',
    'three-way valve mixing',
    'two-way control valve',
    'unitary heat pump',
    'variable frequency drive',
    'variable refrigerant flow',
    'ventilation heat recovery',
    'water-cooled chiller',
    'water economizer coil',
    'waterside economizer'
  ],

  recognition_plumbing_drainage: [
    'air admittance valve',
    'air gap drain',
    'battery of fixtures',
    'bottle trap',
    'branch drain',
    'building drain',
    'building sewer',
    'burst protection valve',
    'circuit vent',
    'circuit vent loop',
    'combination waste and vent',
    'condensate pump plumbing',
    'domestic booster package',
    'double check detector assembly',
    'double check valve assembly',
    'drain tile',
    'drainage vent terminal',
    'fixture carrier',
    'fixture unit',
    'floor sink basket',
    'flushometer valve',
    'grease trap interior',
    'horizontal wet vent',
    'hose bib vacuum breaker',
    'indirect waste receptor',
    'instantaneous water heater',
    'laundry box',
    'leader drain',
    'main sewer cleanout',
    'medical gas alarm panel',
    'medical gas zone valve',
    'oil interceptor',
    'plate heat exchanger domestic',
    'point-of-use water heater',
    'pressure reducing valve domestic',
    'reduced pressure detector assembly',
    'reduced pressure principle assembly',
    'roof overflow drain',
    'sand interceptor',
    'septic pump chamber',
    'sewage ejector',
    'siphon jet',
    'sovent system',
    'storm drainage leader',
    'sump ejector',
    'tempering valve',
    'trap primer valve',
    'vacuum breaker hose connection',
    'vent through roof',
    'water hammer arrestor chamber',
    'water hammer suppressor',
    'water service regulator',
    'wet vent',
    'yard drain'
  ],

  recognition_electrical_low_voltage: [
    'addressable fire alarm device',
    'arc fault circuit breaker',
    'arc flash relay',
    'audio visual rack',
    'automatic transfer switch bypass',
    'building entrance protector',
    'cable tray cover',
    'cable tray ladder',
    'card access reader',
    'cellular DAS headend',
    'clock system master',
    'closed-circuit television headend',
    'code blue station',
    'concrete encased electrode',
    'conduit expansion fitting',
    'copper bus duct',
    'current transformer cabinet',
    'data center PDU',
    'DC power plant',
    'door contact',
    'duct detector sampling tube',
    'electronic door lock',
    'elevator recall switch',
    'emergency lighting inverter',
    'ethernet switch',
    'fiber optic splice case',
    'fire alarm addressable module',
    'fire alarm communicator',
    'fire alarm graphic annunciator',
    'firefighter telephone jack',
    'ground fault circuit breaker',
    'grounding electrode conductor',
    'harmonic filter',
    'infrared motion sensor security',
    'intercom master station',
    'intrusion motion detector',
    'isolated ground receptacle',
    'isolation transformer',
    'k-rated transformer',
    'lightning protection air terminal',
    'load shed relay',
    'low-voltage lighting transformer',
    'main bonding jumper',
    'mass notification speaker',
    'meeting room AV plate',
    'motor disconnect',
    'nurse call station',
    'occupancy sensor line voltage',
    'overcurrent protective device',
    'patch panel fiber',
    'patch panel copper',
    'photovoltaic combiner box',
    'photovoltaic inverter',
    'power distribution unit rack',
    'power over ethernet switch',
    'public address amplifier',
    'rack power strip',
    'redundant power supply',
    'relay panel lighting',
    'residual current device',
    'room combine divider control',
    'satellite dish',
    'security DVR',
    'security NVR',
    'server rack',
    'shielded twisted pair cable',
    'short-circuit current rating',
    'smoke control panel',
    'sound masking emitter',
    'speaker strobes fire alarm',
    'structured cabling horizontal',
    'structured cabling backbone',
    'surge protective device',
    'switchboard section',
    'telecommunications bonding backbone',
    'telecommunications grounding busbar',
    'telecommunications main grounding busbar',
    'telephone MDF',
    'telephone IDF',
    'thermal overload relay',
    'touch panel AV control',
    'TVSS',
    'UPS battery cabinet',
    'UPS static switch',
    'video intercom',
    'voice data outlet',
    'VoIP gateway',
    'Wi-Fi controller',
    'wireless access point ceiling'
  ],

  recognition_architectural_misc: [
    'acoustic baffle ceiling',
    'acoustic cloud',
    'acoustic door seal',
    'acoustic door set',
    'acoustic isolation clip',
    'acoustic underlayment',
    'artificial turf',
    'athletic flooring',
    'automatic sliding door',
    'awning canopy fabric',
    'barn door hardware',
    'bullet-resistant glazing',
    'bullet-resistant wall system',
    'bulletin board',
    'ceiling access ladder',
    'ceiling cloud',
    'coiling door',
    'corner guard rubber',
    'corner bead metal',
    'decorative metal grille',
    'decorative metal screen',
    'decorative wall panel',
    'door astragal',
    'door coordinator flush bolt',
    'door drip cap',
    'door louvers',
    'door sound seal',
    'door viewer peep',
    'electrochromic glass',
    'electromagnetic door holder',
    'entrance floor grille',
    'entrance mat recess',
    'expansion joint cover interior',
    'flood barrier door',
    'folding partition',
    'fritted glass',
    'glass railing base shoe',
    'gymnasium divider curtain',
    'impact glazing film',
    'kalamein door',
    'kickplate stainless',
    'ladder cage',
    'ladder fall arrest',
    'louvered door',
    'magnetic lock',
    'motorized shade',
    'operable partition',
    'panic bar',
    'perforated metal ceiling',
    'photoluminescent egress marking',
    'radiation shielding lead',
    'radiation shielding window',
    'rolling grille',
    'rolling shutter',
    'roof access hatch ship stair',
    'roof smoke vent',
    'safety glazing film',
    'security glazing interlayer',
    'security mesh glass',
    'service window counter',
    'sliding folding partition',
    'smoke baffle curtain',
    'smoke curtain elevator',
    'sound isolation door',
    'stainless steel corner guard',
    'stainless steel wall panel',
    'storm-resistant shutter',
    'sunshade louver exterior',
    'switchable privacy glass',
    'tambour door',
    'telescoping bleacher',
    'ticket window',
    'transaction window',
    'wire mesh glass',
    'wood slat ceiling',
    'writing surface wall-mounted'
  ],

  recognition_structural_misc: [
    'adjustable column base',
    'bearing stiffener',
    'bent plate connection',
    'bolted end plate',
    'buckling restrained brace',
    'cast-in-place anchor channel',
    'chord reinforcement',
    'collector beam',
    'column capital',
    'concrete anchor stud rail',
    'concrete breakout reinforcement',
    'concrete corbel haunch',
    'concrete duct bank encasement',
    'concrete haunch drop',
    'concrete shear friction',
    'concrete slab shear stud rail',
    'concrete spandrel',
    'connection angle',
    'continuity plate',
    'cover plate weld',
    'crane rail',
    'diagonal brace rod',
    'drag strut',
    'edge angle',
    'embed anchor plate',
    'erection bolt',
    'face weld',
    'fillet weld',
    'fin plate connection',
    'fixed base column',
    'flange plate moment connection',
    'floor deck diaphragm',
    'girder line',
    'hairpin reinforcement',
    'headed shear stud',
    'hollow structural section column',
    'joist seat bearing',
    'kicker brace',
    'knee brace connection',
    'k-series joist',
    'lh-series joist',
    'longitudinal reinforcement',
    'moment resisting frame',
    'partial joint penetration weld',
    'pin connection',
    'pile batter',
    'pile splice weld',
    'post-installed rebar',
    'precast bearing pad',
    'pretensioned strand',
    'puddle weld',
    'rebar coupler mechanical',
    'rebar dowel',
    'rebar hook standard',
    'rebar lap splice',
    'reinforcing stirrup tie',
    'roof deck diaphragm',
    'rolled shape',
    'roof truss gable',
    'scissor truss',
    'seat angle',
    'shear bolt group',
    'shear tab connection',
    'shim stack structural',
    'slab on metal deck',
    'slender column',
    'splice sleeve rebar',
    'steel joist bridging',
    'steel joist chord',
    'steel joist web',
    'stiffened seat connection',
    'strap tie',
    'strongback brace',
    'structural steel primer coat',
    'through-bolt connection',
    'tie rod structural',
    'transfer truss',
    'truss gusset',
    'tube steel column',
    'welded moment connection',
    'wide flange girder',
    'wind girder',
    'wood shear wall hold-down'
  ],

  recognition_site_civil_misc: [
    'aggregate piers',
    'bioinfiltration basin',
    'biosoil',
    'bollard removable',
    'bollard retractable',
    'catch basin frame',
    'chain link fence',
    'channel drain',
    'check dam',
    'cofferdam',
    'compost blanket',
    'concrete wheel stop',
    'construction entrance rock pad',
    'culvert headwall',
    'curb machine-laid',
    'detention pond outlet',
    'dissipator pad',
    'downspout splash block',
    'drainage easement',
    'drop inlet',
    'dry well infiltration',
    'erosion control compost sock',
    'filter fabric sock',
    'french drain trench',
    'geocomposite drain',
    'grade stake',
    'gravel ring well',
    'grit chamber',
    'guardrail end treatment',
    'high-visibility crosswalk',
    'inlet grate',
    'jet grout column',
    'leach field pipe',
    'level spreader',
    'manhole adjusting ring',
    'manhole chimney',
    'modular block wall',
    'noise barrier wall',
    'oil water separator vault',
    'ornamental fence',
    'permeable paver',
    'pervious concrete pavement',
    'pipe bedding stone',
    'pollution control pit',
    'porous asphalt',
    'pre-cast trench drain',
    'rain garden',
    'retention basin baffle',
    'riprap apron',
    'roadway sub-base',
    'sand filter vault',
    'sediment basin',
    'silt fence compost',
    'slot drain',
    'soil nail wall',
    'stormwater biofilter',
    'street light foundation',
    'street light pole',
    'street tree pit',
    'subsurface drainage pipe',
    'surface inlet',
    'swale check dam',
    'tactile pad detectable warning',
    'trench box shield',
    'turbidity barrier',
    'underground detention tank',
    'utility trench bedding',
    'v-ditch',
    'wheel rolling compactor',
    'wire backstay'
  ],

  recognition_specialty_facility: [
    'air shower cleanroom',
    'animal holding pen',
    'autopsy suite',
    'biosafety cabinet',
    'biosafety level lab',
    'cage wash equipment',
    'clean room ceiling grid',
    'clean room wall panel',
    'cold storage door',
    'darkroom sink',
    'decontamination shower',
    'dental chair',
    'dialysis box-up',
    'dock shelter inflatable',
    'dock pit leveler',
    'fume hood bench',
    'fume hood walk-in',
    'gowning room bench',
    'grow room HVAC',
    'hyperbaric chamber',
    'isolation room anteroom',
    'isolation room pressure monitor',
    'kitchen exhaust hood island',
    'kitchen exhaust hood wall',
    'kitchen make-up air',
    'laminar flow hood',
    'MRI suite RF shield',
    'negative pressure room',
    'operating room boom',
    'operating room ceiling',
    'pharmacy cleanroom',
    'positive pressure room',
    'radiation vault door',
    'radiology lead glass',
    'reverse osmosis skid',
    'SCIF door',
    'SCIF room',
    'shelter safe room',
    'sound studio isolation',
    'spray paint booth',
    'sterile processing washer',
    'tank farm containment',
    'teaching station lab',
    'telehealth cart',
    'ultra-low freezer',
    'walk-in freezer',
    'walk-in refrigerator',
    'x-ray lead lining',
    'zoo enclosure mesh'
  ]
};

/** @typedef {keyof typeof COMPONENT_GROUPS} ComponentGroupKey */

/** Flat list: part vocabulary + all elemental taxonomy leaves (deduplicated). */
export const BUILDING_COMPONENTS = [
  ...new Set(
    [
      ...Object.values(COMPONENT_GROUPS).flatMap((arr) => arr.map((s) => s.trim())),
      ...ELEMENTAL_TAXONOMY_LEAVES
    ]
  )
].sort((a, b) => a.localeCompare(b));

/** Lowercase set for matching */
export const BUILDING_COMPONENTS_LC = new Set(
  BUILDING_COMPONENTS.map((s) => s.toLowerCase())
);

/**
 * Normalize labels from Revit/families for looser matching (punctuation, underscores).
 * @param {string} text
 * @returns {string}
 */
export function normalizeComponentLabel(text) {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[_\-–—]+/g, ' ')
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Normalized set — same vocabulary as BUILDING_COMPONENTS after `normalizeComponentLabel`. */
export const BUILDING_COMPONENTS_NORM = new Set(
  BUILDING_COMPONENTS.map((s) => normalizeComponentLabel(s))
);

/** Human-readable labels for each group (optional UI). */
export const COMPONENT_GROUP_LABELS = {
  foundations: 'Foundations & piles',
  below_grade_envelope: 'Below-grade envelope & drainage',
  slab_on_grade: 'Slabs on grade',
  structural_concrete: 'Structural concrete',
  precast_prestressed: 'Precast & prestressed',
  structural_steel: 'Structural steel',
  wood_light_frame: 'Wood & light-gauge framing',
  mass_timber: 'Mass timber',
  masonry: 'Masonry',
  earthwork: 'Earthwork & grading',
  shoring_retention: 'Shoring & excavation support',
  roofing: 'Roofing & roof accessories',
  exterior_wall: 'Exterior walls & cladding',
  glazing: 'Glazing & curtain wall',
  weather_resistive: 'Weather & air barriers',
  interior_rough: 'Interior rough & drywall',
  interior_finishes: 'Interior finishes & flooring',
  interior_openings: 'Interior doors & hardware',
  interior_specialties: 'Interior specialties',
  millwork: 'Millwork & casework',
  mechanical_equipment: 'Mechanical equipment',
  ductwork_airside: 'Ductwork & air devices',
  mechanical_piping: 'Mechanical piping & hydronics',
  plumbing_fixtures: 'Plumbing fixtures',
  plumbing_piping: 'Plumbing piping & drains',
  plumbing_specialty: 'Specialty plumbing & med gas',
  electrical_distribution: 'Electrical distribution',
  electrical_branch: 'Electrical branch & raceway',
  electrical_lighting: 'Lighting',
  low_voltage: 'Low voltage & technology',
  fire_sprinkler: 'Fire sprinkler & standpipe',
  fire_special: 'Special fire suppression',
  life_safety: 'Life safety devices',
  controls_bms: 'Controls & BAS',
  conveying: 'Elevators & escalators',
  site_utilities: 'Site utilities',
  site_electrical: 'Site electrical',
  site_paving: 'Paving & site hardscape',
  landscape: 'Landscape & irrigation',
  temp_demolition: 'Demolition & temporary',
  equipment_furnishings: 'Equipment & FF&E',
  fasteners: 'Anchors & fasteners',
  building_references: 'Grids, datums & references',
  extended_parts_and_methods: 'Extended parts, methods & jobsite terms',
  recognition_bim_hosting: 'BIM / model hosting & documentation terms',
  recognition_materials_products: 'Materials & building products',
  recognition_mep_systems: 'MEP systems & HVAC recognition',
  recognition_plumbing_drainage: 'Plumbing & drainage recognition',
  recognition_electrical_low_voltage: 'Electrical, power & technology recognition',
  recognition_architectural_misc: 'Architectural openings & specialty recognition',
  recognition_structural_misc: 'Structural connections & members recognition',
  recognition_site_civil_misc: 'Site & civil recognition',
  recognition_specialty_facility: 'Specialty facility & equipment recognition'
};

/** @type {ComponentGroupKey[]} */
export const COMPONENT_GROUP_KEYS = /** @type {ComponentGroupKey[]} */ (
  Object.keys(COMPONENT_GROUPS)
);

/**
 * @param {ComponentGroupKey} group
 * @returns {string[]}
 */
export function componentsInGroup(group) {
  return COMPONENT_GROUPS[group] ?? [];
}

/**
 * @param {string} text
 * @returns {boolean}
 */
export function isKnownComponentTerm(text) {
  if (typeof text !== 'string') return false;
  return BUILDING_COMPONENTS_LC.has(text.trim().toLowerCase());
}

/**
 * Exact lowercase match, or normalized string matches a known normalized term.
 * @param {string} text
 * @returns {boolean}
 */
export function isKnownComponentTermLoose(text) {
  if (typeof text !== 'string') return false;
  const t = text.trim();
  if (!t) return false;
  if (BUILDING_COMPONENTS_LC.has(t.toLowerCase())) return true;
  return BUILDING_COMPONENTS_NORM.has(normalizeComponentLabel(t));
}
