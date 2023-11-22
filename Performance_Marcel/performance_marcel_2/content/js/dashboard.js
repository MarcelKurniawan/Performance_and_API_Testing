/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7609375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.65, 500, 1500, "POST Registration"], "isController": false}, {"data": [0.8, 500, 1500, "GET Categories"], "isController": false}, {"data": [0.9, 500, 1500, "PUT Profiles"], "isController": false}, {"data": [0.525, 500, 1500, "POST Create Offers"], "isController": false}, {"data": [0.75, 500, 1500, "POST Create Offers-1"], "isController": false}, {"data": [0.775, 500, 1500, "POST Create Offers-0"], "isController": false}, {"data": [0.775, 500, 1500, "PUT Offer-0"], "isController": false}, {"data": [0.725, 500, 1500, "PUT Offer-1"], "isController": false}, {"data": [0.775, 500, 1500, "POST Products"], "isController": false}, {"data": [0.8, 500, 1500, "PUT Products"], "isController": false}, {"data": [0.775, 500, 1500, "GET Offers"], "isController": false}, {"data": [0.825, 500, 1500, "POST Sign In"], "isController": false}, {"data": [0.75, 500, 1500, "GET Products"], "isController": false}, {"data": [0.875, 500, 1500, "DELETE Products"], "isController": false}, {"data": [0.95, 500, 1500, "GET Profiles"], "isController": false}, {"data": [0.525, 500, 1500, "PUT Offer"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 320, 0, 0.0, 543.1812500000007, 11, 2574, 325.5, 1357.5000000000002, 1963.9999999999989, 2472.370000000002, 2.114849548281354, 16.18782827669502, 1.505571771467375], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST Registration", 20, 0, 0.0, 864.6000000000001, 324, 1969, 570.0, 1844.0000000000005, 1964.0, 1969.0, 0.13273337846268202, 0.22629485558608423, 0.07124697409376286], "isController": false}, {"data": ["GET Categories", 20, 0, 0.0, 354.6000000000002, 11, 1256, 32.5, 1200.7000000000007, 1255.05, 1256.0, 0.13337423476532803, 0.13936565546767674, 0.055095020806380623], "isController": false}, {"data": ["PUT Profiles", 20, 0, 0.0, 319.45, 20, 1321, 124.0, 996.9000000000001, 1304.8999999999996, 1321.0, 0.13799860621407725, 0.19811694433136226, 0.17272735701619413], "isController": false}, {"data": ["POST Create Offers", 20, 0, 0.0, 1128.8999999999999, 193, 2545, 475.5, 2483.7000000000003, 2542.45, 2545.0, 0.13319126265316994, 3.598212687716436, 0.12083465137187001], "isController": false}, {"data": ["POST Create Offers-1", 20, 0, 0.0, 723.2500000000001, 179, 1465, 423.0, 1451.0, 1464.45, 1465.0, 0.13323917764779555, 3.45584562950515, 0.05308748484404355], "isController": false}, {"data": ["POST Create Offers-0", 20, 0, 0.0, 405.55000000000007, 14, 1289, 52.5, 1078.6000000000004, 1279.1, 1289.0, 0.13338935686321587, 0.14382342667253578, 0.06786704582591355], "isController": false}, {"data": ["PUT Offer-0", 20, 0, 0.0, 427.84999999999997, 14, 1117, 158.5, 1058.0000000000002, 1114.45, 1117.0, 0.13409409382563744, 0.14422972162066122, 0.06468992416978994], "isController": false}, {"data": ["PUT Offer-1", 20, 0, 0.0, 720.3000000000002, 170, 1508, 479.0, 1385.0, 1502.0, 1508.0, 0.13420837191824025, 3.4562784249137715, 0.05347364818617386], "isController": false}, {"data": ["POST Products", 20, 0, 0.0, 441.7499999999999, 31, 1329, 260.0, 1121.4, 1319.05, 1329.0, 0.13547473734835297, 0.24177080934301529, 0.22266013960671685], "isController": false}, {"data": ["PUT Products", 20, 0, 0.0, 403.59999999999997, 27, 1347, 219.5, 1209.2000000000007, 1341.6499999999999, 1347.0, 0.13625184791568737, 0.24274517455564865, 0.22465587892660793], "isController": false}, {"data": ["GET Offers", 20, 0, 0.0, 459.10000000000014, 19, 1129, 232.5, 1109.9, 1128.1, 1129.0, 0.13371665440930666, 0.1474539513271378, 0.05628113090860467], "isController": false}, {"data": ["POST Sign In", 20, 0, 0.0, 374.4999999999999, 18, 1387, 55.5, 1048.1000000000004, 1370.6499999999996, 1387.0, 0.13335733765411106, 0.2559705538663626, 0.07058562207864082], "isController": false}, {"data": ["GET Products", 20, 0, 0.0, 422.95000000000005, 24, 1019, 313.0, 971.4, 1016.65, 1019.0, 0.13484539974918755, 0.23159434037001575, 0.056229478215725666], "isController": false}, {"data": ["DELETE Products", 20, 0, 0.0, 280.55, 17, 909, 206.0, 670.2, 897.1499999999999, 909.0, 0.13739755294958197, 0.1177405788215412, 0.07448181801007124], "isController": false}, {"data": ["GET Profiles", 20, 0, 0.0, 215.8, 17, 974, 53.5, 668.2000000000005, 959.8999999999999, 974.0, 0.13893906132770165, 0.19916860168255202, 0.05712240704976797], "isController": false}, {"data": ["PUT Offer", 20, 0, 0.0, 1148.1499999999999, 186, 2574, 637.5, 2342.8, 2562.5, 2574.0, 0.13394142741379195, 3.593469298532002, 0.11798356203832065], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 320, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
