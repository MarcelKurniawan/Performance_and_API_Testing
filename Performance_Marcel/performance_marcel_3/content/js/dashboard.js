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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 160, 0, 0.0, 76.28124999999997, 10, 332, 22.0, 173.9, 321.84999999999997, 330.16999999999996, 15.448488944675098, 119.94557952954524, 10.971689587959835], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST Registration", 10, 0, 0.0, 324.2, 319, 332, 323.0, 331.7, 332.0, 332.0, 1.0181225819588677, 1.7334928922317248, 0.5461472014355528], "isController": false}, {"data": ["GET Categories", 10, 0, 0.0, 11.0, 10, 12, 11.0, 12.0, 12.0, 12.0, 1.051967178624027, 1.099223516726278, 0.4345528482011361], "isController": false}, {"data": ["PUT Profiles", 10, 0, 0.0, 21.6, 19, 24, 22.0, 23.9, 24.0, 24.0, 1.050972149238045, 1.5060513005780345, 1.3089940225959011], "isController": false}, {"data": ["POST Create Offers", 10, 0, 0.0, 173.39999999999998, 169, 182, 173.0, 181.4, 182.0, 182.0, 1.0346611484738748, 28.31051151060528, 0.9386720770822556], "isController": false}, {"data": ["POST Create Offers-1", 10, 0, 0.0, 158.2, 155, 168, 157.0, 167.4, 168.0, 168.0, 1.0364842454394694, 27.246174725331677, 0.4129741915422886], "isController": false}, {"data": ["POST Create Offers-0", 10, 0, 0.0, 15.1, 13, 17, 15.0, 17.0, 17.0, 17.0, 1.0515247108307044, 1.1303890641430074, 0.5350042718191378], "isController": false}, {"data": ["PUT Offer-0", 10, 0, 0.0, 13.399999999999999, 12, 18, 12.5, 17.700000000000003, 18.0, 18.0, 1.052299273913501, 1.1326604098705673, 0.5076521887824897], "isController": false}, {"data": ["PUT Offer-1", 10, 0, 0.0, 165.4, 149, 273, 154.0, 261.50000000000006, 273.0, 273.0, 1.0374520178441746, 27.278301366843035, 0.41335978835978837], "isController": false}, {"data": ["POST Products", 10, 0, 0.0, 33.3, 31, 40, 32.5, 39.400000000000006, 40.0, 40.0, 1.0508617065994115, 1.8724631541614123, 1.7107289696300967], "isController": false}, {"data": ["PUT Products", 10, 0, 0.0, 28.7, 27, 31, 29.0, 30.9, 31.0, 31.0, 1.0513036164844407, 1.8646265900967198, 1.7264376576955425], "isController": false}, {"data": ["GET Offers", 10, 0, 0.0, 18.700000000000003, 17, 21, 19.0, 20.9, 21.0, 21.0, 1.0515247108307044, 1.159963196635121, 0.44258510778128285], "isController": false}, {"data": ["POST Sign In", 10, 0, 0.0, 18.3, 16, 24, 17.0, 23.700000000000003, 24.0, 24.0, 1.0508617065994115, 2.0126464638503574, 0.5562178173602353], "isController": false}, {"data": ["GET Products", 10, 0, 0.0, 23.3, 21, 33, 22.0, 32.1, 33.0, 33.0, 1.051967178624027, 1.8076576635808963, 0.4386620949926362], "isController": false}, {"data": ["DELETE Products", 10, 0, 0.0, 20.4, 18, 29, 18.5, 28.700000000000003, 29.0, 29.0, 1.0513036164844407, 0.9016160507779646, 0.5716463414634146], "isController": false}, {"data": ["GET Profiles", 10, 0, 0.0, 16.7, 14, 19, 16.5, 18.9, 19.0, 19.0, 1.0516352928804291, 1.507206988116521, 0.432361775686192], "isController": false}, {"data": ["PUT Offer", 10, 0, 0.0, 178.79999999999998, 161, 291, 166.5, 279.00000000000006, 291.0, 291.0, 1.0360547036883547, 28.356736298176546, 0.9126184987567344], "isController": false}]}, function(index, item){
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
