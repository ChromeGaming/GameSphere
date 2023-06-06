(function () {
  "use strict";

  function unbindAllEvents(ele) {
    ele.parentNode.replaceChild(ele.cloneNode(true), ele);
  }

  function getParentByTagName(obj, tag) {
    var parent = obj.parentNode;
    if (!parent || !parent.tagName) {
      return false;
    }

    return (parent.tagName.toLowerCase() == tag) ? parent : getParentByTagName(parent, tag);
  }

  function purgeElement(ele) {
    while (ele.hasChildNodes()) {
      ele.removeChild(ele.lastChild);
    }
  }

  window.DOMHelper = {
    unbindAllEvents: unbindAllEvents,
    getParentByTagName: getParentByTagName,
    purgeElement: purgeElement
  };
})();