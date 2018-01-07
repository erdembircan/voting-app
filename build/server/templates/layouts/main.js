var Handlebars = require("handlebars");module.exports = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "      <a href='/createpoll'>\n        <div class=\"navItem\">\n          Create Poll\n          <div class=\"hoverSelection\"></div>\n        </div>\n      </a>\n      <a href=\"/user\">\n        <div class=\"navItem\">\n          <img style=\"border-radius:10%\" src="
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.avatar : stack1), depth0))
    + " />\n          <div class=\"hoverSelection\"></div>\n        </div>\n      </a>\n      <a href='/logout'>\n        <div class=\"navItem\">\n          <i class=\"fa fa-sign-out fa-2x\" aria-hidden=\"true\" style=\"color:grey\"></i>\n          <div class=\"hoverSelection\"></div>\n        </div>\n      </a>\n";
},"3":function(depth0,helpers,partials,data) {
    return "      <a href=\"/login\" target=\"_blank\" id='popUp'>\n        <div class=\"navItem\">\n          <div>\n            Sign in with <br/>\n            <i class=\"fa fa-twitter fa-2x\" style='color: #00aced' aria-hidden=\"true\"></i>\n            <div class=\"hoverSelection\"></div>\n          </div>\n        </div>\n      </a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n  <meta charset=\"utf8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <script src=\"https://use.fontawesome.com/29b0cb94dd.js\"></script>\n  <link rel=\"stylesheet\" href=\"/css/main.css\" /> "
    + ((stack1 = ((helper = (helper = helpers.extraHead || (depth0 != null ? depth0.extraHead : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"extraHead","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n</head>\n\n<body id=\"base\">\n  <div class=\"topNav\">\n    <div class=\"left\">\n      <a href='/'>\n        <div class=\"logo\">\n          VOTING APP\n        </div>\n      </a>\n    </div>\n    <div class=\"right\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.user : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "    </div>\n  </div>\n  <div class=\"partialWrapper\">\n    "
    + ((stack1 = ((helper = (helper = helpers.mainBody || (depth0 != null ? depth0.mainBody : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"mainBody","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n\n  </div>\n  <div class=\"footer\">\n    <p style=\"color: dimgray; margin-bottom: 5px\">Erdem Bircan</p>\n    <a target='_blank' href=\"https://github.com/erdembircan\">\n      <img class='footerImg' src=\"http://www.freeiconspng.com/uploads/github-logo-icon-30.png\" alt=\"\" />\n    </a>\n\n  </div>\n  "
    + ((stack1 = ((helper = (helper = helpers.extraScripts || (depth0 != null ? depth0.extraScripts : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"extraScripts","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n\n  <script src=\"/js/index.js\" defer></script>\n\n  <div data-message='"
    + alias3(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"message","hash":{},"data":data}) : helper)))
    + "'></div>\n  <div data-error='"
    + alias3(((helper = (helper = helpers.error || (depth0 != null ? depth0.error : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"error","hash":{},"data":data}) : helper)))
    + "'></div>\n\n</body>\n\n</html>";
},"useData":true});