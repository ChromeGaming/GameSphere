const TIME_SCALE = 2.0; // Every time unit should multiply this
const TIME_PACE = 30; // This is hours by minute
const TIME_INTERVAL = 32;

const ANTS_PER_CELL = 18;

const TEXTS = {
    scoutFound: "<div><p>You sent <b>%1</b> ants to scout a radius of <b>%2m</b> after food:</p><p class=\"msghighlight\">You've found <b>%3</b>. There's about (e) <b>%4</b> energy in this resource.</p><p>How many ants do you wish to send to pick the resource?</p></div>",
    hatchResults: "<p>You successfully hatched <b>%1</b> eggs!</p>",
    buildRoomPrompt: "<p>To build another cell in the colony you'll need <b>%1</b> energy and <b>%2</b> ants to complete in about <b>%3</b> days.</p>",
    hatchEggError: "<p>You don't have enough space in your colony to hatch more eggs.</p>",
    defaultError: "<p class=\"msgerror\">Ops, you can't do that right now.</p>",
    buildRoomResult: "<p class=\"msghighlight\">You just built another cell in your colony. You can now accomodate <b>%1</b> ants.</p>",
    infoWidgetEnergy: "<div><span>0</span><span>ENERGY</span></div>",
    infoWidgetHours: "<div><span>0</span><span>HOURS</span></div>",
    infoWidgetDays: "<div><span>0</span><span>DAYS</span></div>",
    infoWidget: "<div class=\"infowidgettitle\">Cost</div>",
    energyError: "<p class=\"msgerror\">Seems like you don't have enough energy for that.</p>",
    sufferAttack: "<p class=\"msgerror\">Oh! You let your defenses down and suffered an attack!</p>",
    fetchedResources: "<div><p>Your ants successfully fetched <b>%1</b> energy in the resource.</p>%2</div>",
    lostAnts: "<p class=\"msgerror\">However, <b>%1</b> ants got lost.</p>",
};

const MESSAGE_INTRO = [
    ["Welcome, <b>My Queen</b>. I'm Antherous, and I'm here to give you another chance.", 3],
    ["Ok, I know you might be lost now. But I'll explain...", 2],
    ["I don't know how to tell you that, but... you went mad. You led your colony to ashes.", 4],
    ["All the ants died a terrible death when the <b>War</b> came, you couldn't protect your own ants.", 6],
    ["So I managed to create this virtual interface for you so you can control our colony once again.", 5],
    ["You just have to <b>Send Ant Scouts</b> after food, then send some ants to <b>Fetch the Resources</b> found in form of <b>Energy</b>. Focus on <b>Building more Cells</b> on the colony. You'll probably need to <b>Hatch some Eggs</b> to populate your colony.", 9],
    ["Please don't let your defenses down, keep always some ants in the colony to protect it in case of an invasion.", 5],
    ["Well, I trust you!", 4],
];

const MESSAGE_GAMEOVER = [
    ["Oh! I believed you and you failed us again.", 4],
    ["I really don't know what to say... I trusted you. I might give you another chance.", 3],
    ["<b><a href=\"http://bruno.croci.me\">CrociDB</a></b> thanks you for playing this anyway.", 2],
];

const MESSAGE_WIN = [
    ["Oh! I knew I should trust you!", 5],
    ["You really saved us, made our colony grow again, but... Erm...", 4],
    ["I'm not sure how to tell you that, but...", 4],
    ["well...", 4],
    ["You're not real. You didn't die. You're just an AI I created, beucase machines are better with management than ants are.", 6],
    ["I'll be shutting you down now.", 5],
    ["Ah, I forgot: <b><a href=\"http://bruno.croci.me\">CrociDB</a></b> thanks you for playing this anyway.", 3],
];

const PLACES = [
    { d: 3, n: "Chewed Gum", e: 5 },
    { d: 5, n: "Shattered Soda Can", e: 10 },
    { d: 15, n: "Smashed Candy", e: 20 },
    { d: 20, n: "Banana Peel", e: 22 },
    { d: 25, n: "Gummy Bear Head", e: 30 },
    { d: 30, n: "Candy Cane", e: 40  },
    { d: 45, n: "Fallen Ice Cream", e: 60  },
    { d: 70, n: "Piece of Chocolate", e: 100  }
];

const SOUNDS = {
    message: jsfxr([2,,0.09,,0.49,0.34,,0.0525,,,,0.28,0.29,,,,,,1,,,,,0.5]),
    progress_start: jsfxr([2,0.08,0.3967,,0.52,0.3191,,0.104,,,,,,0.2888,,,,,0.7558,,,,,0.4]),
    range_change: jsfxr([3,,0.0346,,0.1453,0.5152,,-0.86,-0.26,,,-0.38,,,,,,,1,,,,,0.3]),
    dialog_open: jsfxr([3,,0.0346,,0.1453,0.5152,,-0.86,-0.26,,,-0.38,,,,,,,1,,,,,0.5]),
    dialog_close: jsfxr([3,,0.0346,,0.1453,0.5152,,-0.86,-0.26,,,-0.84,,,,,,,1,,,,,0.5]),
    fade_out: jsfxr([3,0.29,0.2779,0.4006,0.3918,0.8028,,-0.3415,,,,,,,,,0.3766,-0.0329,1,,,,,0.4]),
    fade_in: jsfxr([3,0.19,0.25,0.75,0.3918,0.8028,,-0.3415,0.48,,,0.02,,,,,0.3766,-0.0329,1,,,,,0.4]),
    warn: jsfxr([0,0.08,0.14,0.31,0.44,0.854,,,,,,0.3732,0.5938,,0.1999,,,0.02,0.44,,,,-0.02,0.2]),
    attack: jsfxr([3,0.1,0.18,0.4024,0.72,0.14,,,,,,-0.1928,0.7063,,,0.5103,0.0235,-0.2935,1,,,,,0.5]),
    action_open: jsfxr([3,0.12,0.1155,0.4985,0.08,0.0844,,0.2071,,,,,,,,,,,0.76,,,,,0.5]),
    action_close: jsfxr([3,0.12,0.1155,0.4985,0.08,0.0844,,0.12,,,,,,,,,,,0.76,,,,,0.5]),
    built_cell: jsfxr([0,0.21,0.2491,,0.3617,0.2314,,0.2303,,0.47,0.1,,,0.5499,,,0.4599,-0.4,1,0.02,,,,0.4]),
};

const MAP_COLUMNS = 7;
const MAP = [
    [{c: 3}],
    [{c: 1, l: [0]}, {c: 5, l: [0]}],
    [{c: 2, l: [ 1, 2]}]
];
