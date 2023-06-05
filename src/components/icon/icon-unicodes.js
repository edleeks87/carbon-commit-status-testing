const communications = {
  call: "\\e93d",
  mobile: "\\e932",
  fax: "\\e925",
  email: "\\e922",
  email_switch: "\\e996",
  marker: "\\e93f",
};

const business = {
  person: "\\e93c",
  person_info: "\\e994",
  person_tick: "\\e97b",
  people: "\\e93b",
  people_switch: "\\e995",
  business: "\\e90d",
  shop: "\\e947",
  bank: "\\e977",
};

const primaryNavigation = {
  home: "\\e929",
  dashboard: "\\f007",
  settings: "\\e91a",
  search: "\\e92f",
  feedback: "\\e930",
  logout: "\\e92e",
  alert: "\\e90b",
  alert_on: "\\f001",
  talk: "\\e95a",
};

const actions = {
  calendar: "\\e90e",
  calendar_today: "\\e970",
  dropdown: "\\e910",
  caret_up: "\\e9a8",
  caret_left: "\\e9a6",
  caret_right: "\\e9a7",
  caret_large_down: "\\e9a4",
  caret_large_up: "\\e9a5",
  caret_large_left: "\\e9a2",
  caret_large_right: "\\e9a3",
  plus: "\\e940",
  plus_large: "\\e967",
  minus: "\\e931",
  minus_large: "\\e968",
  edit: "\\e93a",
  edited: "\\e938",
  favourite: "\\e94f",
  favourite_lined: "\\e94e",
  credit_card: "\\e91c",
  credit_card_slash: "\\e966",
  save: "\\e926",
  uploaded: "\\e905",
  arrow_left_boxed: "\\e988",
  question: "\\e943",
  info: "\\e92a",
  download: "\\e900",
  upload: "\\e906",
  share: "\\e946",
  close: "\\e91e",
  cross: "\\e91d",
  cross_circle: "\\e992",
  filter: "\\e928",
  refresh: "\\e945",
  computer_clock: "\\e997",
  refresh_clock: "\\e986",
  sync: "\\e944",
  attach: "\\e937",
  camera: "\\e90f",
  image: "\\e93e",
  folder: "\\e927",
  help: "\\e951",
  connect: "\\e955",
  disconnect: "\\e953",
  split: "\\e952",
  filter_new: "\\e954",
  delivery: "\\e959",
  chat: "\\e914",
  chat_notes: "\\e956",
  bullet_list: "\\e95b",
  bullet_list_numbers: "\\e989",
  bullet_list_dotted: "\\e98a",
  view: "\\e957",
  hide: "\\e998",
  video: "\\e95e",
  play: "\\e95f",
  pause: "\\e96d",
  play_circle: "\\e96c",
  pause_circle: "\\e96b",
  scan: "\\e96e",
  lookup: "\\e96f",
  bold: "\\e98c",
  italic: "\\e98b",
  undo: "\\e9aa",
  box_arrow_left: "\\f006",
};

const batchActions = {
  cart: "\\e90a",
  basket_with_squares: "\\e975",
  delete: "\\e90c",
  print: "\\e942",
  csv: "\\e94a",
  pdf: "\\e91f",
  duplicate: "\\e921",
  copy: "\\e91b",
  check_all: "\\f028",
  check_none: "\\f029",
};

const navigation = {
  chevron_up: "\\e918",
  chevron_down: "\\e915",
  chevron_right: "\\e917",
  chevron_left: "\\e916",
  chevron_up_thick: "\\e99d",
  chevron_down_thick: "\\e99c",
  chevron_left_thick: "\\e99f",
  chevron_right_thick: "\\e99e",
  link: "\\e92d",
  list_view: "\\e92c",
  card_view: "\\e94b",
  sort_down: "\\e948",
  sort_up: "\\e949",
  arrow_left: "\\e902",
  arrow_right: "\\e904",
  arrow_down: "\\e901",
  arrow_up: "\\e907",
  arrow_left_right_small: "\\e964",
  arrow_left_small: "\\e963",
  arrow_right_small: "\\e962",
  block_arrow_right: "\\e97e",
  drag_vertical: "\\e94d",
  drag: "\\e94c",
  fit_height: "\\e909",
  fit_width: "\\e908",
  ellipsis_horizontal: "\\e960",
  ellipsis_vertical: "\\e961",
  u_turn_left: "\\f004",
  u_turn_right: "\\f005",
};

const statusSymbols = {
  error: "\\e923",
  warning: "\\e924",
  tick: "\\e950",
  tick_circle: "\\e993",
  tick_thick: "\\f003",
  draft: "\\e939",
  progressed: "\\e903",
  in_progress: "\\e920",
  clock: "\\e919",
  locked: "\\e935",
  unlocked: "\\e936",
  gift: "\\e941",
  blocked: "\\e933",
  key: "\\e92b",
  chart_line: "\\e912",
  chart_pie: "\\e913",
  chart_bar: "\\e911",
  blocked_square: "\\e934",
  disputed: "\\e958",
  lightbulb_on: "\\e95d",
  lightbulb_off: "\\e95c",
};

const misc = {
  boxed_shapes: "\\e982",
  circles_connection: "\\e979",
  document_right_align: "\\e981",
  document_tick: "\\e980",
  document_vertical_lines: "\\e978",
  error_square: "\\e97f",
  factory: "\\e976",
  files_leaning: "\\e97a",
  ledger: "\\e973",
  ledger_arrow_left: "\\e971",
  ledger_arrow_right: "\\e972",
  money_bag: "\\e974",
  spanner: "\\e984",
  split_container: "\\e987",
  stacked_boxes: "\\e97c",
  tag: "\\e985",
  three_boxes: "\\e97d",
  circle_with_dots: "\\e965",
  squares_nine: "\\e969",
  coins: "\\e96a",
  file_generic: "\\e991",
  file_pdf: "\\e990",
  file_excel: "\\e98e",
  file_word: "\\e98f",
  file_image: "\\e98d",
  euro: "\\e9a0",
  pound: "\\e9a1",
  stacked_squares: "\\e983",
  expand: "\\e99b",
  flag: "\\e999",
  square_dot: "\\e99a",
  envelope_dollar: "\\e9ab",
  envelope_euro: "\\e9a9",
  sage_coin: "\\e9ac",
  palm_tree: "\\f002",
  arrow_bottom_right_circle: "\\f014",
  arrow_top_left_circle: "\\f017",
  arrows_left_right: "\\f027",
  bank_with_card: "\\f019",
  bed: "\\f010",
  car_lock: "\\f021",
  car_money: "\\f011",
  car_repair: "\\f022",
  cash: "\\f020",
  construction: "\\f008",
  drill: "\\f015",
  form_refresh: "\\f018",
  graduation_hat: "\\f013",
  hand_cash_coins: "\\f009",
  hand_cash_note: "\\f024",
  laptop: "\\f012",
  percentage_boxed: "\\f016",
  petrol_pump: "\\f026",
  plane: "\\f025",
  theatre_masks: "\\f023",
};

const legacyNames = {
  add: actions.plus,
  create: actions.plus,
  services: actions.plus,
  admin: actions.favourite,
  analysis: statusSymbols.chart_line,
  graph: statusSymbols.chart_line,
  basket: batchActions.cart,
  // `tsc` emits an invalid .d.ts file if we're using normal property access (.delete):
  // it tries to use `delete` as an identifier, but `delete` is a reserved keyword.
  // By using ["delete"] instead, tsc generates a different - valid - .d.ts file
  // See also: https://github.com/microsoft/TypeScript/issues/53111
  /* eslint-disable-next-line dot-notation */
  bin: batchActions["delete"],
  /* eslint-disable-next-line dot-notation */
  bulk_destroy: batchActions["delete"],
  caret_down: actions.dropdown,
  collaborate: actions.share,
  contacts: business.people,
  entry: navigation.list_view,
  go: statusSymbols.progressed,
  submitted: statusSymbols.progressed,
  grid: actions.split,
  individual: business.person,
  location: communications.marker,
  message: communications.email,
  old_warning: statusSymbols.warning,
  phone: communications.call,
  piggy_bank: actions.save,
  question_hollow: actions.video,
  question_mark: actions.question,
  remove: actions.minus,
  settings_old: primaryNavigation.settings,
  true_tick: statusSymbols.tick,
  arrow: navigation.arrow_right,
  in_transit: navigation.arrow_left_right_small,
  progress: misc.circle_with_dots,
};

const iconUnicodes = {
  ...communications,
  ...business,
  ...primaryNavigation,
  ...actions,
  ...batchActions,
  ...navigation,
  ...statusSymbols,
  ...misc,
  ...legacyNames,
  none: "",
};

export default iconUnicodes;
