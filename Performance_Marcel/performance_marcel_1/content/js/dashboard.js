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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "POST Registration"], "isController": false}, {"data": [1.0, 500, 1500, "GET Categories"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Profiles"], "isController": false}, {"data": [1.0, 500, 1500, "POST Create Offers"], "isController": false}, {"data": [1.0, 500, 1500, "POST Create Offers-1"], "isController": false}, {"data": [1.0, 500, 1500, "POST Create Offers-0"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Offer-0"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Offer-1"], "isController": false}, {"data": [1.0, 500, 1500, "POST Products"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Products"], "isController": false}, {"data": [1.0, 500, 1500, "GET Offers"], "isController": false}, {"data": [1.0, 500, 1500, "POST Sign In"], "isController": false}, {"data": [1.0, 500, 1500, "GET Products"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Products"], "isController": false}, {"data": [1.0, 500, 1500, "GET Profiles"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Offer"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 160, 0, 0.0, 73.66874999999999, 10, 344, 23.0, 169.8, 319.95, 335.4599999999998, 16.271738025017797, 126.33826702811959, 11.578815436540221], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST Registration", 10, 0, 0.0, 324.09999999999997, 308, 344, 320.5, 342.6, 344.0, 344.0, 1.0728462611307799, 1.8291819211994422, 0.5755023937882202], "isController": false}, {"data": ["GET Categories", 10, 0, 0.0, 10.6, 10, 12, 10.0, 12.0, 12.0, 12.0, 1.1109876680368849, 1.1608953171869794, 0.45893338240195536], "isController": false}, {"data": ["PUT Profiles", 10, 0, 0.0, 22.2, 20, 26, 22.0, 25.8, 26.0, 26.0, 1.1117287381878822, 1.5905103529738744, 1.392483671484158], "isController": false}, {"data": ["POST Create Offers", 10, 0, 0.0, 169.70000000000002, 164, 177, 169.0, 176.8, 177.0, 177.0, 1.0924186148131965, 29.8991987792222, 0.9910711847279877], "isController": false}, {"data": ["POST Create Offers-1", 10, 0, 0.0, 156.5, 151, 164, 156.0, 163.8, 164.0, 164.0, 1.093972213105787, 28.762495213871567, 0.43587955365933706], "isController": false}, {"data": ["POST Create Offers-0", 10, 0, 0.0, 13.2, 13, 14, 13.0, 14.0, 14.0, 14.0, 1.110864252388358, 1.1974335564319039, 0.5651955815374361], "isController": false}, {"data": ["PUT Offer-0", 10, 0, 0.0, 12.7, 11, 14, 12.5, 14.0, 14.0, 14.0, 1.1122233344455565, 1.1975951646090535, 0.5365608664219775], "isController": false}, {"data": ["PUT Offer-1", 10, 0, 0.0, 151.5, 148, 161, 151.0, 160.2, 161.0, 161.0, 1.0957703265395573, 28.808700758820954, 0.4365959894806049], "isController": false}, {"data": ["POST Products", 10, 0, 0.0, 31.4, 30, 35, 31.0, 34.8, 35.0, 35.0, 1.1102475852115021, 1.9745926779171756, 1.8186809564782946], "isController": false}, {"data": ["PUT Products", 10, 0, 0.0, 28.0, 26, 30, 28.0, 29.9, 30.0, 30.0, 1.1107408641563923, 1.9678770271020771, 1.8301191269576806], "isController": false}, {"data": ["GET Offers", 10, 0, 0.0, 18.099999999999998, 17, 22, 17.5, 21.8, 22.0, 22.0, 1.1116051578479322, 1.2249367774566473, 0.4678728740551356], "isController": false}, {"data": ["POST Sign In", 10, 0, 0.0, 18.6, 16, 25, 17.0, 24.6, 25.0, 25.0, 1.1101243339253997, 2.1257146425399647, 0.5875853408081706], "isController": false}, {"data": ["GET Products", 10, 0, 0.0, 22.3, 21, 24, 22.0, 23.9, 24.0, 24.0, 1.1113580795732385, 1.9049372082685043, 0.46342763669704384], "isController": false}, {"data": ["DELETE Products", 10, 0, 0.0, 19.9, 16, 29, 17.0, 28.700000000000003, 29.0, 29.0, 1.1122233344455565, 0.9529929234790346, 0.6041197447447447], "isController": false}, {"data": ["GET Profiles", 10, 0, 0.0, 15.700000000000001, 14, 17, 16.0, 17.0, 17.0, 17.0, 1.1127183709803048, 1.5971420524090352, 0.4574750333815511], "isController": false}, {"data": ["PUT Offer", 10, 0, 0.0, 164.20000000000002, 160, 175, 162.5, 174.2, 175.0, 175.0, 1.0940919037199124, 29.94264565098468, 0.9637411105032823], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 160, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
