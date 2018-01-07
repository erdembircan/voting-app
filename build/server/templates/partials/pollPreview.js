var Handlebars = require("handlebars");module.exports = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"pollPreview\">\n  <p>"
    + this.escapeExpression(((helper = (helper = helpers.pollMessage || (depth0 != null ? depth0.pollMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"pollMessage","hash":{},"data":data}) : helper)))
    + "</p>\n  <table class=\"pollTable\">\n    <thead>\n      <th>title</th>\n      <th>votes</th>\n      <th>chart</th>\n    </thead>\n    <tbody class=\"tableBody\">\n    </tbody>\n  </table>\n</div>";
},"useData":true});