export default function() {
  var HANDLES = {};

  return {
    clear: () => HANDLES = {},
    on: (e, handler) => (HANDLES[e] || (HANDLES[e] = [])).push(handler),
    off: (e, handler) => (HANDLES[e] = (HANDLES[e] || []).filter((x) => x != handler)),
    emit: (e, data) => (HANDLES[e] || []).forEach((handler) => handler(data)),
  };
  return
}