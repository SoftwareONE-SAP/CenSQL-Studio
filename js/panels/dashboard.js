var moment = require("moment");

var DashboardPage = function() {
    console.log("Loaded DashboardPage")

    if (APP.ready) {
        this.init();
    } else {
        window.addEventListener('app-ready', function(e) {
            this.init();
        }.bind(this), false);
    }

    window.addEventListener('app-load-dashboard', function(e) {
        this.load();
    }.bind(this), false);

}

DashboardPage.prototype.init = function() {
    console.log("Starting DashboardPage")

}

DashboardPage.prototype.load = function() {
    console.log("Loading DashboardPage")

    this.displayHostInfo();
    this.displayBackupInfo();
    this.displayMemoryChart();
}

DashboardPage.prototype.displayMemoryChart = function() {

    APP.hdbHandler.exec("MAIN", "SELECT NAME, SUM(VALUE) AS TOTAL FROM SYS.M_MEMORY WHERE NAME IN ('GLOBAL_ALLOCATION_LIMIT', 'TOTAL_MEMORY_SIZE_IN_USE') GROUP BY NAME ORDER BY NAME", function(err, data) {

        if (err) {
            throw err;
        }

        $("#dashboard-memory-chart").highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                margin: [0, 0, 0, 0],
                spacing: [0, 0, 0, 0]
            },
            title: {
                text: null
            },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                    },
                    size: '100%'
                }
            },
            series: [{
                type: 'pie',
                name: 'Memory USed',
                innerSize: '30%',
                data: [{
                    name: 'Free',
                    y: data[0].TOTAL - data[1].TOTAL,
                    color: "#33ff33"
                }, {
                    name: 'Used',
                    y: data[1].TOTAL,
                    color: "#ff3333"
                }]
            }],
            credits: {
                enabled: false
            }
        });

    });

}

DashboardPage.prototype.displayBackupInfo = function() {
    APP.hdbHandler.exec("MAIN", "SELECT BACKUP_ID, UTC_START_TIME, STATE_NAME FROM sys.m_backup_catalog\
                                 WHERE ENTRY_TYPE_NAME = 'complete data backup'\
                                 ORDER BY entry_id DESC\
                                 LIMIT 5",
        function(err, data) {
            if (err) {
                throw err;
            }

            var html = "";

            for (var i = 0; i < data.length; i++) {
                html += "<tr><td>" + data[i].BACKUP_ID + "</td><td>" + moment(data[i].UTC_START_TIME).format("lll") + "</td><td>" + data[i].STATE_NAME + "</td></tr>"
            };

            $("#dashboard-backup-status").html(html);

        })
}

DashboardPage.prototype.displayHostInfo = function() {
    APP.hdbHandler.exec("MAIN", "SELECT HOST,HOST_ACTIVE,HOST_STATUS FROM SYS.M_LANDSCAPE_HOST_CONFIGURATION ORDER BY HOST", function(err, data) {
        if (err) {
            throw err;
        }

        var html = "";

        for (var i = 0; i < data.length; i++) {
            html += "<tr><td>" + data[i].HOST + "</td><td>" + data[i].HOST_STATUS + "</td><td>" + data[i].HOST_ACTIVE + "</td></tr>"
        };

        $("#dashboard-host-status").html(html);

    })
}

new DashboardPage();