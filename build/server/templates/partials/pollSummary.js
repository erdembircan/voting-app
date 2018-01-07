var Handlebars = require("handlebars/runtime");module.exports = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<tr class=\"pollRow\" onclick=\"window.location.replace('/poll/"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "')\">\n  <td>"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</td>\n  <td>"
    + alias3(((helper = (helper = helpers.totalVotes || (depth0 != null ? depth0.totalVotes : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"totalVotes","hash":{},"data":data}) : helper)))
    + "</td>\n  <td>\n    <canvas id=\"poll\" width=\"51\" height=\"51\" data-id="
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + ">\n    </canvas>\n  </td>\n</tr>";
},"useData":true});