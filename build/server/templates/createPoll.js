var Handlebars = require("handlebars");module.exports = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div>\n  <form action=\"/api/createpoll\" method=\"post\">\n    <div>\n      <label for=\"title\">Title</label>\n      <input type=\"text\" name='title' id=\"title\" required />\n    </div>\n    <div id=\"itemContainer\">\n      <div class=\"item\">\n        <label for=\"item1\">Item #1</label>\n        <input type=\"text\" name='item1' id=\"item1\" required />\n      </div>\n      <div class=\"item\">\n        <label for=\"item2\">Item #2</label>\n        <input type=\"text\" name='item2' id=\"item2\" required />\n      </div>\n    </div>\n    <div>\n      <button type=\"button\" id=\"addItem\">+</button>\n      <button type=\"button\" id=\"removeItem\">-</button>\n    </div>\n    <div>\n      <button type=\"submit\">Create</button>\n    </div>\n  </form>\n</div>\n\n<script src=\"/js/createPoll.js\" defer></script>";
},"useData":true});