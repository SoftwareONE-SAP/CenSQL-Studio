var ConsolePage = function() {
    console.log("Loaded ConsolePage")

    if (APP.ready) {
        this.init();
    } else {
        window.addEventListener('app-ready', function (e) {
            this.init();
        }.bind(this), false);
    }

    window.addEventListener('app-load-console', function (e) {
        this.load();
    }.bind(this), false);

}

ConsolePage.prototype.init = function() {
    console.log("Starting ConsolePage");

    var _this = this;
    
    $(document).on("click", "#console-expand", function(event){
        console.log("Making sql console expand")
        $("#console-expand").hide()
        $("#console-minimise").show()

        $("#console-editor-parent").css("height", "700px");
        
        _this.editor.refresh();
    })

    $(document).on("click", "#console-minimise", function(event){
        console.log("Making sql console minimise")
        $("#console-minimise").hide()
        $("#console-expand").show()

        $("#console-editor-parent").css("height", "200px");
        
        _this.editor.refresh();
    })

    $(document).on("click", "#console-run", function(event){
        _this.runQuery();
    })
}

ConsolePage.prototype.load = function(){

    console.log("Loading ConsolePage")

    this.editor = CodeMirror.fromTextArea(document.getElementById("console-textarea"), {
        lineNumbers: true,
        mode: "text/x-sql",
        viewportMargin: Infinity
    });

    // console.log(this.editor);
}

ConsolePage.prototype.runQuery = function(){
    var sql = this.editor.getValue();

    APP.hdbHandler.exec("MAIN", sql, function(err, data){
        if(err){
            
            $("#console-error").show();
            $("#console-error-details").html(err.toString());
            $("#console-table").hide();

            return;

        }else{
            $("#console-table").show();
            $("#console-error").hide();
        }

        /**
         * Generate header row
         * @type {String}
         */
        var headerRow = "";

        var columns = Object.keys(data[0]);

        for (var i = 0; i < columns.length; i++) {
            headerRow += "<th>" + columns[i] + "</th>";
        };

        $("#console-results-columns").html(headerRow);

        /**
         * Generate data rows
         */
        var dataRows = "";

        for (var i = 0; i < data.length; i++) {
            dataRows += "<tr>";

            for (var k = 0; k < columns.length; k++) {
                dataRows += "<td>" + data[i][columns[k]] + "</td>";
            };

            dataRows += "</tr>";
        };

        $("#console-query-results").html(dataRows);

    });

}

new ConsolePage();