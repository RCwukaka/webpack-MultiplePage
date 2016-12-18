require("./css/nav.css");
var html = require("./tmpl/nav.html");

module.exports = function() {
  return $(html).clone();
}