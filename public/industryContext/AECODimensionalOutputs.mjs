/**
 * Dimensional & annotated output types — what typically appears on drawings / in model views
 * (lengths, offsets, elevations, performance numbers, ratings, spots, civil stationing, etc.).
 *
 * Cross-checked against AECOHats (HatGroup priorities) and AECOBuildingComponents (COMPONENT_GROUPS).
 * Use for lens rules, auto-dimension strategy, and “what should this hat see?” checklists.
 *
 * Legacy names: DRAWING_PRESENTATION_* aliases re-export the same data for older imports.
 */

/** @typedef {keyof typeof DIMENSIONAL_OUTPUT_GROUPS} DimensionalOutputGroupKey */

/**
 * Grouped output kinds (strings are stable labels for rules and UI).
 */
export const DIMENSIONAL_OUTPUT_GROUPS = {
  linear_dimensions: [
    'aligned dimension',
    'linear dimension',
    'overall length',
    'overall width',
    'running dimension',
    'continuous dimension',
    'baseline dimension',
    'chain dimension',
    'ordinate dimension',
    'opening width',
    'opening height',
    'rough opening width',
    'rough opening height',
    'clear opening width',
    'clear opening height',
    'span',
    'bay spacing',
    'module spacing',
    'on-center spacing',
    'repetitive spacing',
    'edge distance',
    'end distance',
    'lap length',
    'splice length',
    'development length',
    'development length rebar',
    'bar spacing dimension',
    'mesh spacing dimension',
    'arc length',
    'radius',
    'diameter',
    'chord length',
    'perimeter linear',
    'cut length',
    'stock length',
    'weld length',
    'seam length',
    'joint spacing',
    'true length vs projected length',
    'minimum dimension string',
    'maximum dimension string'
  ],

  spot_instrument_dimensions: [
    'spot elevation',
    'spot slope',
    'spot coordinate',
    'spot easting northing',
    'relative elevation',
    'survey elevation',
    'level relative to datum',
    'slope arrow',
    'spot grade',
    'invert spot',
    'rim spot'
  ],

  offsets_alignments: [
    'offset from grid',
    'offset from grid line',
    'offset from baseline',
    'offset from building line',
    'offset from property line',
    'offset from right-of-way',
    'offset from easement',
    'offset from column centerline',
    'offset from wall centerline',
    'offset from finish face',
    'offset from structure face',
    'offset from core',
    'offset from centerline',
    'inset',
    'setback',
    'setback from ROW',
    'reveal width',
    'throat dimension',
    'eccentricity',
    'in-plane offset',
    'out-of-plane offset',
    'parallel offset',
    'normal distance',
    'minimum clearance',
    'maximum span',
    'work point offset',
    'bearing offset',
    'maneuvering clearance',
    'door swing clearance',
    'pocket door pocket depth'
  ],

  vertical_elevation: [
    'elevation',
    'finished floor elevation',
    'structural top of steel',
    'top of concrete',
    'top of deck',
    'underside of deck',
    'top of wall',
    'bottom of wall',
    'top of footing',
    'bottom of footing',
    'invert elevation',
    'rim elevation',
    'sill elevation',
    'head elevation',
    'parapet elevation',
    'roof elevation',
    'grade elevation',
    'benchmark elevation',
    'datum elevation',
    'story height',
    'floor-to-floor height',
    'clear height',
    'headroom',
    'ceiling elevation',
    'reflected ceiling plane elevation',
    'soffit elevation',
    'riser height',
    'tread depth',
    'going dimension',
    'nosing projection',
    'vertical rise',
    'total rise',
    'drop',
    'step height',
    'platform elevation',
    'pit depth',
    'trench depth',
    'cover depth below grade',
    'top of wall framing',
    'top of blocking'
  ],

  depths_thicknesses: [
    'slab thickness',
    'topping thickness',
    'membrane thickness',
    'insulation thickness',
    'total wall assembly thickness',
    'air cavity depth',
    'gypsum layer thickness',
    'sheathing thickness',
    'cladding thickness',
    'veneer thickness',
    'coating thickness',
    'laminated build-up thickness',
    'cover concrete',
    'cover to reinforcement',
    'embed depth',
    'penetration depth',
    'anchor embedment',
    'sleeve length through wall',
    'stud leg length',
    'flange thickness',
    'web thickness',
    'plate thickness',
    'gauge',
    'kerf depth',
    'rabbet depth',
    'reveal depth',
    'groove depth',
    'counterbore depth',
    'countersink depth',
    'drainage mat thickness',
    'waterproofing build-up thickness',
    'pavement structure layer thickness',
    'subbase thickness'
  ],

  sections_cuts: [
    'section cut depth',
    'section reference',
    'building section cut line',
    'partial section',
    'detail cut scope',
    'view depth',
    'far clip offset',
    'near clip offset',
    'crop region',
    'callout extent',
    'scope of demolition',
    'scope of new work',
    'work plane offset',
    'split line offset',
    'break line offset',
    'matchline offset',
    'detail boundary extent'
  ],

  angles_slopes: [
    'angle',
    'included angle',
    'slope ratio',
    'percent slope',
    'cross slope',
    'longitudinal slope',
    'pitch',
    'rake angle',
    'bevel angle',
    'miter angle',
    'bearing angle',
    'azimuth',
    'deflection angle',
    'camber',
    'sweep angle',
    'rotation',
    'skew',
    'plumb tolerance',
    'level tolerance',
    'pipe slope percent',
    'duct slope percent'
  ],

  areas_volumes: [
    'area gross',
    'area net',
    'rentable area',
    'usable area',
    'surface area',
    'floor area',
    'wall area',
    'roof area',
    'opening area',
    'glazing area',
    'glazing ratio',
    'volume',
    'excavation volume',
    'fill volume',
    'concrete volume',
    'formwork area',
    'paint area',
    'waterproofing area',
    'insulation board feet',
    'tonnage steel',
    'concrete yardage',
    'occupant load area basis',
    'catchment area',
    'stormwater tributary area'
  ],

  weights_loads: [
    'dead load',
    'live load',
    'roof load',
    'floor load',
    'point load',
    'line load',
    'uniform load',
    'wind load',
    'seismic weight',
    'tributary seismic weight',
    'snow load',
    'rain load',
    'equipment weight',
    'panel weight',
    'member weight',
    'shipping weight',
    'lift weight',
    'crane pick weight',
    'ballast weight',
    'mass',
    'density',
    'load per stud',
    'load per anchor',
    'factored load note',
    'unfactored load note'
  ],

  counts_quantities: [
    'count',
    'quantity',
    'each',
    'number of',
    'fixture count',
    'device count',
    'head count',
    'sprinkler count',
    'outlet count',
    'panel circuit count',
    'sheet count',
    'panel count',
    'module count',
    'pile count',
    'anchor count',
    'weld count',
    'bolt count',
    'stud count',
    'pair count doors',
    'parking stall count',
    'bicycle parking count',
    'linear feet',
    'square feet',
    'cubic yards',
    'man-hours',
    'allowance quantity'
  ],

  mep_flow_and_performance: [
    'supply airflow CFM',
    'return airflow CFM',
    'exhaust airflow CFM',
    'outdoor air CFM',
    'total airflow CFM',
    'face velocity',
    'duct velocity',
    'static pressure',
    'velocity pressure',
    'design GPM',
    'flow rate',
    'domestic flow rate',
    'drainage fixture units note',
    'water supply fixture units note',
    'pump head',
    'NPSH note',
    'sump discharge GPM',
    'pipe size callout',
    'duct width and height',
    'refrigerant line size',
    'coil entering air temperature',
    'coil leaving air temperature',
    'delta-T',
    'BTU per hour',
    'cooling tons',
    'heating MBH',
    'percent outside air',
    'relative humidity setpoint',
    'dew point note',
    'hydronic design supply temperature',
    'hydronic design return temperature',
    'steam pressure note',
    'condensate GPM',
    'gas pressure note',
    'medical gas pressure note',
    'compressed air pressure note'
  ],

  electrical_power_and_signal: [
    'voltage',
    'amperage',
    'phase',
    'wattage',
    'volt-amperes',
    'KVA',
    'demand KW',
    'available fault current',
    'interrupting rating',
    'wire size',
    'conductor size',
    'conduit size',
    'conduit fill percent',
    'conductor count',
    'grounding conductor size',
    'neutral conductor count',
    'voltage drop note',
    'short circuit rating note',
    'arc flash label reference',
    'disconnect rating',
    'breaker frame size',
    'trip setting note',
    'motor HP',
    'full load amperes',
    'lighting footcandle target',
    'illuminance lux target',
    'control voltage',
    'DALI group note',
    'dimming percent',
    'photocell setpoint',
    'emergency duration note',
    'battery runtime note',
    'fiber strand count',
    'category cable type callout'
  ],

  fire_life_outputs: [
    'sprinkler design density',
    'remote area of sprinkler operation',
    'hydraulic demand note',
    'hose stream allowance',
    'sprinkler spacing dimension',
    'deflector obstruction dimension',
    'ceiling height above sprinkler',
    'standpipe residual pressure',
    'fire flow demand',
    'smoke layer design height',
    'door fire rating annotation',
    'wall fire rating annotation',
    'floor ceiling assembly rating',
    'exit access travel distance',
    'common path of egress travel',
    'exit discharge distance',
    'exit width',
    'stair width',
    'occupant load',
    'egress capacity calculation note',
    'smoke compartment area',
    'fire barrier continuity note',
    'draft curtain depth',
    'smoke damper size'
  ],

  assembly_material_callouts: [
    'concrete compressive strength callout',
    'rebar grade and size',
    'weld symbol reference',
    'bolt grade and diameter',
    'anchor specification callout',
    'mortar type callout',
    'masonry unit strength',
    'steel grade callout',
    'metal deck gauge',
    'glass make-up each ply thickness',
    'insulating glass unit overall thickness',
    'wind load design pressure on cladding',
    'fastener pattern spacing',
    'pre-tension torque note',
    'fire-resistance rated assembly note',
    'UL assembly listing reference',
    'STC assembly rating',
    'IIC rating note',
    'impact protection rating',
    'missile impact zone note',
    'vapor permeance note',
    'perm rating',
    'R-value callout',
    'continuous insulation R-value'
  ],

  civil_station_geometry: [
    'station along alignment',
    'offset from centerline',
    'PI station',
    'curve radius',
    'tangent length',
    'arc length curve',
    'degree of curve',
    'spiral length',
    'vertical curve K-value',
    'vertical curve length',
    'high point low point station',
    'subgrade elevation',
    'finished grade elevation',
    'sump depth',
    'manhole rim to invert',
    'pipe run length between structures',
    'invert in invert out',
    'pipe cover depth',
    'trench width',
    'swale depth',
    'detention volume',
    'retention volume',
    'erosion control blanket area'
  ],

  elevator_conveying_outputs: [
    'cab clear width',
    'cab clear depth',
    'cab clear height',
    'door clear width',
    'door clear height',
    'elevator travel',
    'pit depth',
    'overhead clearance',
    'machine room minimum dimensions',
    'rated load pounds',
    'rated load persons',
    'speed FPM',
    'grouping control ID',
    'escalator rise',
    'escalator angle',
    'moving walk length'
  ],

  schedules_indices: [
    'door schedule',
    'window schedule',
    'finish schedule',
    'hardware schedule',
    'panel schedule',
    'equipment schedule',
    'fixture schedule',
    'load schedule',
    'panel schedule electrical',
    'diffuser schedule',
    'sprinkler schedule',
    'valve schedule',
    'manhole schedule',
    'room finish schedule',
    'room data sheet reference',
    'BAS points list reference',
    'I O schedule reference',
    'drawing index',
    'sheet index',
    'revision index',
    'keynote legend',
    'abbreviation legend',
    'symbol legend',
    'ladder diagram reference',
    'riser diagram reference',
    'one-line reference'
  ],

  references_datums: [
    'grid dimension',
    'grid intersection',
    'column grid ID',
    'level ID',
    'datum note',
    'benchmark callout',
    'survey reference',
    'property line tie',
    'true north to project north angle',
    'coordinate system note',
    'state plane zone note',
    'control joint location',
    'expansion joint location',
    'construction joint location',
    'pour break',
    'panel joint',
    'module ID',
    'piece mark',
    'shipping mark',
    'erection mark',
    'shop drawing reference',
    'specification section reference',
    'detail reference',
    'sheet reference',
    'RFI reference',
    'submittal reference'
  ],

  tolerances_quality: [
    'tolerance',
    'flatness tolerance',
    'levelness tolerance',
    'straightness tolerance',
    'plumb tolerance',
    'joint tolerance',
    'gap tolerance',
    'weld tolerance',
    'anchor bolt template tolerance',
    'bolt hole tolerance',
    'precast erection tolerance',
    'concrete strength',
    'slump',
    'air content',
    'cure time',
    'inspection hold point',
    'test pressure',
    'leak test',
    'duct leakage class note',
    'commissioning setpoint',
    'as-built variance',
    'thermal imaging note'
  ],

  time_sequence: [
    'construction sequence',
    'phasing note',
    'install order',
    'prerequisite work',
    'temporary support note',
    'cure before load',
    'dry-in milestone',
    'substantial completion marker'
  ],

  graphic_presentation: [
    'enlarged plan',
    'enlarged elevation',
    'isometric',
    'axonometric',
    'perspective',
    'exploded axonometric',
    'diagrammatic flow',
    'schematic riser',
    'schematic one-line',
    'single line diagram',
    'clash snapshot',
    'rendering',
    'photo inset',
    'underlay',
    'halftone ghost',
    'workset tint',
    'color-fill plan',
    'hatch pattern callout',
    'pattern direction note',
    'north arrow',
    'graphic scale',
    'bar scale',
    'matchline',
    'scope box note',
    'view title',
    'sheet border',
    'LOD note'
  ],

  bim_sheet_metadata: [
    'sheet scale notation',
    'not to scale flag',
    'revision number',
    'issue date',
    'file name reference',
    'model link note',
    'workset responsibility note',
    'survey base point note',
    'project base point note',
    'shared coordinates note'
  ],

  text_notes_flags: [
    'general note',
    'keynote',
    'leader note',
    'revision cloud',
    'revision triangle',
    'issue tag',
    'warranty note',
    'coordination note',
    'field verify note',
    'not to scale note',
    'typical note',
    'see structural note',
    'see MEP note',
    'by others note',
    'NIC note',
    'TBD note',
    'placeholder note',
    'means and methods note'
  ],

  safety_logistics: [
    'fall protection zone',
    'guardrail height',
    'toe board height',
    'warning line offset',
    'exclusion zone',
    'laydown area extent',
    'crane swing radius',
    'pick radius',
    'load chart reference',
    'hazard callout',
    'PPE note',
    'hot work boundary',
    'confined space note'
  ],

  environmental_sustainability: [
    'embodied carbon note',
    'recycled content callout',
    'VOC note',
    'thermal performance value',
    'U-factor callout',
    'SHGC callout',
    'VT callout',
    'air leakage rate assembly',
    'water use intensity note',
    'daylight factor',
    'acoustic STC callout',
    'IEQ note',
    'rainwater harvesting capacity',
    'solar panel area'
  ]
};

/** Flat, sorted, deduped output labels. */
export const ALL_DIMENSIONAL_OUTPUT_KINDS = [
  ...new Set(
    Object.values(DIMENSIONAL_OUTPUT_GROUPS).flatMap((arr) => arr.map((s) => s.trim()))
  )
].sort((a, b) => a.localeCompare(b));

export const ALL_DIMENSIONAL_OUTPUT_KINDS_LC = new Set(
  ALL_DIMENSIONAL_OUTPUT_KINDS.map((s) => s.toLowerCase())
);

export const DIMENSIONAL_OUTPUT_GROUP_LABELS = {
  linear_dimensions: 'Linear & chain dimensions',
  spot_instrument_dimensions: 'Spot elevation, slope & coordinates',
  offsets_alignments: 'Offsets, alignments & clearances',
  vertical_elevation: 'Elevations & vertical geometry',
  depths_thicknesses: 'Thicknesses & build-up depth',
  sections_cuts: 'Sections, clips & extents',
  angles_slopes: 'Angles & slopes',
  areas_volumes: 'Areas & volumes',
  weights_loads: 'Loads & weights',
  counts_quantities: 'Counts & quantities',
  mep_flow_and_performance: 'MEP flow, pressure & capacity',
  electrical_power_and_signal: 'Electrical power & signal',
  fire_life_outputs: 'Fire protection & life safety metrics',
  assembly_material_callouts: 'Assembly, material & rating callouts',
  civil_station_geometry: 'Civil alignment, station & drainage',
  elevator_conveying_outputs: 'Elevator & conveying sizes',
  schedules_indices: 'Schedules, legends & indices',
  references_datums: 'References & datums',
  tolerances_quality: 'Tolerances, tests & QC',
  time_sequence: 'Sequence & phasing',
  graphic_presentation: 'Graphic presentation',
  bim_sheet_metadata: 'BIM & sheet metadata',
  text_notes_flags: 'Notes & revision graphics',
  safety_logistics: 'Safety & logistics',
  environmental_sustainability: 'Sustainability & environmental'
};

/**
 * Suggested output groups per COMPONENT_GROUPS key (AECOBuildingComponents) — for rule wiring.
 * Hats already map to component buckets; this adds “what to draw” hints per bucket.
 * @type {Record<string, DimensionalOutputGroupKey[]>}
 */
export const COMPONENT_GROUP_TO_DIMENSIONAL_OUTPUT_HINTS = {
  foundations: [
    'vertical_elevation',
    'depths_thicknesses',
    'linear_dimensions',
    'references_datums',
    'assembly_material_callouts',
    'tolerances_quality'
  ],
  below_grade_envelope: [
    'depths_thicknesses',
    'vertical_elevation',
    'offsets_alignments',
    'areas_volumes',
    'assembly_material_callouts'
  ],
  slab_on_grade: [
    'depths_thicknesses',
    'linear_dimensions',
    'vertical_elevation',
    'angles_slopes',
    'tolerances_quality'
  ],
  structural_concrete: [
    'linear_dimensions',
    'vertical_elevation',
    'depths_thicknesses',
    'assembly_material_callouts',
    'weights_loads',
    'references_datums',
    'tolerances_quality'
  ],
  precast_prestressed: [
    'linear_dimensions',
    'vertical_elevation',
    'weights_loads',
    'references_datums',
    'assembly_material_callouts',
    'counts_quantities'
  ],
  structural_steel: [
    'linear_dimensions',
    'angles_slopes',
    'assembly_material_callouts',
    'weights_loads',
    'references_datums',
    'tolerances_quality'
  ],
  wood_light_frame: [
    'linear_dimensions',
    'vertical_elevation',
    'depths_thicknesses',
    'counts_quantities',
    'references_datums'
  ],
  mass_timber: [
    'linear_dimensions',
    'assembly_material_callouts',
    'weights_loads',
    'references_datums'
  ],
  masonry: [
    'linear_dimensions',
    'vertical_elevation',
    'assembly_material_callouts',
    'counts_quantities'
  ],
  earthwork: [
    'areas_volumes',
    'vertical_elevation',
    'civil_station_geometry',
    'angles_slopes'
  ],
  shoring_retention: [
    'linear_dimensions',
    'vertical_elevation',
    'depths_thicknesses',
    'weights_loads',
    'references_datums'
  ],
  roofing: [
    'linear_dimensions',
    'angles_slopes',
    'areas_volumes',
    'assembly_material_callouts',
    'vertical_elevation'
  ],
  exterior_wall: [
    'linear_dimensions',
    'depths_thicknesses',
    'vertical_elevation',
    'offsets_alignments',
    'assembly_material_callouts',
    'environmental_sustainability'
  ],
  glazing: [
    'linear_dimensions',
    'assembly_material_callouts',
    'offsets_alignments',
    'vertical_elevation'
  ],
  weather_resistive: [
    'depths_thicknesses',
    'linear_dimensions',
    'assembly_material_callouts',
    'environmental_sustainability'
  ],
  interior_rough: [
    'linear_dimensions',
    'vertical_elevation',
    'depths_thicknesses',
    'offsets_alignments'
  ],
  interior_finishes: [
    'linear_dimensions',
    'vertical_elevation',
    'areas_volumes',
    'schedules_indices'
  ],
  interior_openings: [
    'linear_dimensions',
    'vertical_elevation',
    'offsets_alignments',
    'schedules_indices'
  ],
  interior_specialties: [
    'linear_dimensions',
    'counts_quantities',
    'schedules_indices'
  ],
  millwork: [
    'linear_dimensions',
    'vertical_elevation',
    'depths_thicknesses',
    'schedules_indices'
  ],
  mechanical_equipment: [
    'mep_flow_and_performance',
    'linear_dimensions',
    'vertical_elevation',
    'weights_loads',
    'schedules_indices'
  ],
  ductwork_airside: [
    'mep_flow_and_performance',
    'linear_dimensions',
    'vertical_elevation',
    'offsets_alignments'
  ],
  mechanical_piping: [
    'mep_flow_and_performance',
    'linear_dimensions',
    'vertical_elevation',
    'depths_thicknesses'
  ],
  plumbing_fixtures: [
    'linear_dimensions',
    'vertical_elevation',
    'counts_quantities',
    'schedules_indices',
    'mep_flow_and_performance'
  ],
  plumbing_piping: [
    'mep_flow_and_performance',
    'linear_dimensions',
    'vertical_elevation',
    'angles_slopes'
  ],
  plumbing_specialty: [
    'mep_flow_and_performance',
    'linear_dimensions',
    'vertical_elevation',
    'schedules_indices'
  ],
  electrical_distribution: [
    'electrical_power_and_signal',
    'linear_dimensions',
    'vertical_elevation',
    'schedules_indices'
  ],
  electrical_branch: [
    'electrical_power_and_signal',
    'linear_dimensions',
    'vertical_elevation',
    'offsets_alignments'
  ],
  electrical_lighting: [
    'electrical_power_and_signal',
    'linear_dimensions',
    'vertical_elevation',
    'schedules_indices'
  ],
  low_voltage: [
    'electrical_power_and_signal',
    'linear_dimensions',
    'schedules_indices'
  ],
  fire_sprinkler: [
    'fire_life_outputs',
    'linear_dimensions',
    'vertical_elevation',
    'counts_quantities',
    'schedules_indices'
  ],
  fire_special: ['fire_life_outputs', 'linear_dimensions', 'mep_flow_and_performance'],
  life_safety: [
    'fire_life_outputs',
    'linear_dimensions',
    'vertical_elevation',
    'offsets_alignments',
    'counts_quantities'
  ],
  controls_bms: [
    'mep_flow_and_performance',
    'electrical_power_and_signal',
    'schedules_indices'
  ],
  conveying: [
    'elevator_conveying_outputs',
    'linear_dimensions',
    'vertical_elevation',
    'electrical_power_and_signal'
  ],
  site_utilities: [
    'civil_station_geometry',
    'linear_dimensions',
    'vertical_elevation',
    'mep_flow_and_performance'
  ],
  site_electrical: [
    'electrical_power_and_signal',
    'civil_station_geometry',
    'linear_dimensions'
  ],
  site_paving: [
    'civil_station_geometry',
    'linear_dimensions',
    'angles_slopes',
    'areas_volumes'
  ],
  landscape: ['areas_volumes', 'linear_dimensions', 'counts_quantities', 'civil_station_geometry'],
  temp_demolition: [
    'sections_cuts',
    'areas_volumes',
    'linear_dimensions',
    'safety_logistics',
    'time_sequence'
  ],
  equipment_furnishings: [
    'linear_dimensions',
    'vertical_elevation',
    'weights_loads',
    'schedules_indices',
    'electrical_power_and_signal'
  ],
  fasteners: ['assembly_material_callouts', 'linear_dimensions', 'tolerances_quality'],
  building_references: ['references_datums', 'spot_instrument_dimensions', 'bim_sheet_metadata'],
  extended_parts_and_methods: ['tolerances_quality', 'linear_dimensions', 'assembly_material_callouts'],
  recognition_bim_hosting: ['bim_sheet_metadata', 'graphic_presentation', 'references_datums'],
  recognition_materials_products: ['assembly_material_callouts', 'environmental_sustainability'],
  recognition_mep_systems: ['mep_flow_and_performance', 'schedules_indices'],
  recognition_plumbing_drainage: ['mep_flow_and_performance', 'linear_dimensions'],
  recognition_electrical_low_voltage: ['electrical_power_and_signal', 'schedules_indices'],
  recognition_architectural_misc: [
    'linear_dimensions',
    'vertical_elevation',
    'offsets_alignments',
    'assembly_material_callouts'
  ],
  recognition_structural_misc: [
    'linear_dimensions',
    'assembly_material_callouts',
    'weights_loads',
    'tolerances_quality'
  ],
  recognition_site_civil_misc: ['civil_station_geometry', 'linear_dimensions', 'environmental_sustainability'],
  recognition_specialty_facility: [
    'mep_flow_and_performance',
    'electrical_power_and_signal',
    'schedules_indices',
    'fire_life_outputs'
  ]
};

/** Which output groups each HatGroup should prioritize (aligned with AECOHats). */
export const DEFAULT_DIMENSIONAL_OUTPUT_FOCUS_BY_HAT_GROUP = {
  design_consultant: [
    'linear_dimensions',
    'spot_instrument_dimensions',
    'offsets_alignments',
    'vertical_elevation',
    'depths_thicknesses',
    'sections_cuts',
    'areas_volumes',
    'graphic_presentation',
    'text_notes_flags',
    'references_datums',
    'environmental_sustainability',
    'bim_sheet_metadata',
    'assembly_material_callouts'
  ],
  engineering_consultant: [
    'linear_dimensions',
    'spot_instrument_dimensions',
    'offsets_alignments',
    'vertical_elevation',
    'depths_thicknesses',
    'sections_cuts',
    'angles_slopes',
    'areas_volumes',
    'weights_loads',
    'references_datums',
    'tolerances_quality',
    'graphic_presentation',
    'assembly_material_callouts',
    'mep_flow_and_performance',
    'electrical_power_and_signal',
    'fire_life_outputs',
    'civil_station_geometry'
  ],
  specialty_consultant: [
    'linear_dimensions',
    'offsets_alignments',
    'vertical_elevation',
    'depths_thicknesses',
    'areas_volumes',
    'weights_loads',
    'references_datums',
    'tolerances_quality',
    'environmental_sustainability',
    'text_notes_flags',
    'mep_flow_and_performance',
    'electrical_power_and_signal',
    'fire_life_outputs',
    'assembly_material_callouts'
  ],
  stakeholder: [
    'areas_volumes',
    'counts_quantities',
    'schedules_indices',
    'graphic_presentation',
    'time_sequence',
    'text_notes_flags',
    'bim_sheet_metadata'
  ],
  regulatory: [
    'linear_dimensions',
    'offsets_alignments',
    'vertical_elevation',
    'fire_life_outputs',
    'references_datums',
    'text_notes_flags',
    'schedules_indices',
    'tolerances_quality',
    'environmental_sustainability',
    'graphic_presentation',
    'assembly_material_callouts'
  ],
  preconstruction: [
    'linear_dimensions',
    'areas_volumes',
    'counts_quantities',
    'weights_loads',
    'schedules_indices',
    'references_datums',
    'time_sequence',
    'mep_flow_and_performance',
    'electrical_power_and_signal'
  ],
  gc_field: [
    'linear_dimensions',
    'vertical_elevation',
    'spot_instrument_dimensions',
    'offsets_alignments',
    'sections_cuts',
    'counts_quantities',
    'references_datums',
    'time_sequence',
    'safety_logistics',
    'text_notes_flags',
    'tolerances_quality',
    'bim_sheet_metadata',
    'fire_life_outputs'
  ],
  structural_site_trade: [
    'linear_dimensions',
    'vertical_elevation',
    'spot_instrument_dimensions',
    'offsets_alignments',
    'depths_thicknesses',
    'angles_slopes',
    'areas_volumes',
    'weights_loads',
    'counts_quantities',
    'references_datums',
    'tolerances_quality',
    'safety_logistics',
    'assembly_material_callouts',
    'civil_station_geometry'
  ],
  envelope_trade: [
    'linear_dimensions',
    'offsets_alignments',
    'vertical_elevation',
    'depths_thicknesses',
    'sections_cuts',
    'angles_slopes',
    'areas_volumes',
    'references_datums',
    'tolerances_quality',
    'graphic_presentation',
    'assembly_material_callouts',
    'environmental_sustainability'
  ],
  interior_trade: [
    'linear_dimensions',
    'offsets_alignments',
    'vertical_elevation',
    'depths_thicknesses',
    'areas_volumes',
    'counts_quantities',
    'references_datums',
    'graphic_presentation',
    'text_notes_flags',
    'schedules_indices'
  ],
  mep_trade: [
    'linear_dimensions',
    'offsets_alignments',
    'vertical_elevation',
    'depths_thicknesses',
    'sections_cuts',
    'counts_quantities',
    'schedules_indices',
    'references_datums',
    'graphic_presentation',
    'tolerances_quality',
    'mep_flow_and_performance',
    'electrical_power_and_signal'
  ],
  mep_subtrade: [
    'linear_dimensions',
    'offsets_alignments',
    'vertical_elevation',
    'depths_thicknesses',
    'counts_quantities',
    'schedules_indices',
    'references_datums',
    'tolerances_quality',
    'mep_flow_and_performance',
    'electrical_power_and_signal'
  ],
  fire_protection_trade: [
    'linear_dimensions',
    'vertical_elevation',
    'offsets_alignments',
    'depths_thicknesses',
    'counts_quantities',
    'schedules_indices',
    'references_datums',
    'tolerances_quality',
    'safety_logistics',
    'fire_life_outputs',
    'mep_flow_and_performance'
  ],
  conveyance_specialty: [
    'linear_dimensions',
    'vertical_elevation',
    'offsets_alignments',
    'depths_thicknesses',
    'counts_quantities',
    'references_datums',
    'schedules_indices',
    'tolerances_quality',
    'elevator_conveying_outputs',
    'electrical_power_and_signal'
  ],
  site_civil_trade: [
    'linear_dimensions',
    'vertical_elevation',
    'spot_instrument_dimensions',
    'offsets_alignments',
    'angles_slopes',
    'areas_volumes',
    'counts_quantities',
    'references_datums',
    'safety_logistics',
    'environmental_sustainability',
    'graphic_presentation',
    'civil_station_geometry',
    'mep_flow_and_performance'
  ],
  demolition_abatement: [
    'linear_dimensions',
    'vertical_elevation',
    'sections_cuts',
    'areas_volumes',
    'counts_quantities',
    'references_datums',
    'time_sequence',
    'safety_logistics',
    'text_notes_flags'
  ],
  operations: [
    'counts_quantities',
    'schedules_indices',
    'references_datums',
    'tolerances_quality',
    'graphic_presentation',
    'text_notes_flags',
    'mep_flow_and_performance',
    'electrical_power_and_signal'
  ]
};

/**
 * Expand hat-group focus to concrete output strings.
 * @param {string} hatGroup AECOHats HatGroup id
 * @returns {string[]}
 */
export function dimensionalOutputsForHatGroup(hatGroup) {
  const keys = DEFAULT_DIMENSIONAL_OUTPUT_FOCUS_BY_HAT_GROUP[hatGroup];
  if (!keys) return [];
  return [...new Set(keys.flatMap((k) => DIMENSIONAL_OUTPUT_GROUPS[k] ?? []))].sort((a, b) =>
    a.localeCompare(b)
  );
}

/**
 * Union of output kinds suggested for a set of component group keys.
 * @param {string[]} componentGroupKeys from a hat’s componentGroupKeys
 * @returns {string[]}
 */
export function dimensionalOutputsForComponentGroups(componentGroupKeys) {
  const out = new Set();
  for (const cg of componentGroupKeys) {
    const hints = COMPONENT_GROUP_TO_DIMENSIONAL_OUTPUT_HINTS[cg];
    if (!hints) continue;
    for (const og of hints) {
      for (const s of DIMENSIONAL_OUTPUT_GROUPS[og] ?? []) {
        out.add(s.trim());
      }
    }
  }
  return [...out].sort((a, b) => a.localeCompare(b));
}

// --- Backward-compatible aliases (previous file name / export names) ---
export const DRAWING_PRESENTATION_GROUPS = DIMENSIONAL_OUTPUT_GROUPS;
export const ALL_PRESENTATION_DELIVERABLE_KINDS = ALL_DIMENSIONAL_OUTPUT_KINDS;
export const ALL_PRESENTATION_DELIVERABLE_KINDS_LC = ALL_DIMENSIONAL_OUTPUT_KINDS_LC;
export const DRAWING_PRESENTATION_GROUP_LABELS = DIMENSIONAL_OUTPUT_GROUP_LABELS;
/** @typedef {DimensionalOutputGroupKey} DrawingPresentationGroupKey */
export const DEFAULT_PRESENTATION_FOCUS_BY_HAT_GROUP = DEFAULT_DIMENSIONAL_OUTPUT_FOCUS_BY_HAT_GROUP;
export function presentationDeliverablesForHatGroup(hatGroup) {
  return dimensionalOutputsForHatGroup(hatGroup);
}
