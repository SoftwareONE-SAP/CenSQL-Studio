var fs = require("fs");
var path = require("path");

var PageSelector = function(){
    this.init();
}

PageSelector.prototype.init = function(){
    
    window.addEventListener('app-ready', function (e) {
        this.changePanel("dashboard");
    }.bind(this), false);

    $(document).on("click", ".page-selector", function(event) {
        var panelName = $(event.target).attr("page");

        this.changePanel(panelName);
    }.bind(this))

};

PageSelector.prototype.changePanel = function(panelName){
    fs.readFile(path.join("panels", panelName + ".html"), "utf-8", function(err, data) {
        if(err){
            $("#page-main-container").html(err)
            return;
        }
        
        $("#page-main-container").html(data.toString())

        APP.page = panelName;

        window.dispatchEvent(new Event('app-load-' + panelName));
    });
}

new PageSelector();