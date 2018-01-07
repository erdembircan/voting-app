var Handlebars = require("handlebars/runtime");module.exports = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"item\">\n  <label for=\"item"
    + alias3(((helper = (helper = helpers.itemNumber || (depth0 != null ? depth0.itemNumber : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"itemNumber","hash":{},"data":data}) : helper)))
    + "\">Item #"
    + alias3(((helper = (helper = helpers.itemNumber || (depth0 != null ? depth0.itemNumber : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"itemNumber","hash":{},"data":data}) : helper)))
    + "</label>\n  <input type=\"text\" name='item"
    + alias3(((helper = (helper = helpers.itemNumber || (depth0 != null ? depth0.itemNumber : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"itemNumber","hash":{},"data":data}) : helper)))
    + "' id=\"item"
    + alias3(((helper = (helper = helpers.itemNumber || (depth0 != null ? depth0.itemNumber : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"itemNumber","hash":{},"data":data}) : helper)))
    + "\" required />\n</div>";
},"useData":true});