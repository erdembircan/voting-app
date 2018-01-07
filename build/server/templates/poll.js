var Handlebars = require("handlebars");module.exports = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"indexWrapper\" style=\"margin-top: 10px\">\n  <h2>"
    + alias3(((helper = (helper = helpers.pollTitle || (depth0 != null ? depth0.pollTitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"pollTitle","hash":{},"data":data}) : helper)))
    + "</h2>\n  <div class=\"mainPageWrapper\" style=\"align-items: center; width: 50%; justify-content: space-around\">\n    <div class=\"chart\"></div>\n    <canvas id=\"poll\" width=\"300\" height=\"300\" data-id="
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + ">\n      <p>your browser doesn't support canvas</p>\n    </canvas>\n  </div>\n  <script src=\"/js/poll.js\" defer></script>\n</div>";
},"useData":true});