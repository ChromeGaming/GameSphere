// list of all active game objects
var g = [];

export function get() { return g }
export function add(obj) { g.push(obj); }
export function remove(obj) { g = g.filter((x) => x != obj); }
export function clear(obj) { g = []; }