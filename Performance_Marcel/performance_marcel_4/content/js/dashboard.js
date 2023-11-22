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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 80, 0, 0.0, 74.72499999999997, 10, 350, 22.0, 173.8, 321.95, 350.0, 16.5016501650165, 128.14119546720298, 11.728821807962046], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST Registration", 5, 0, 0.0, 329.6, 321, 350, 326.0, 350.0, 350.0, 350.0, 1.157675387821255, 1.972796437253994, 0.6211199785830054], "isController": false}, {"data": ["GET Categories", 5, 0, 0.0, 11.2, 10, 14, 11.0, 14.0, 14.0, 14.0, 1.2490632025980515, 1.3051734636522607, 0.5159704440419685], "isController": false}, {"data": ["PUT Profiles", 5, 0, 0.0, 22.4, 22, 23, 22.0, 23.0, 23.0, 23.0, 1.2512512512512513, 1.7942747434934936, 1.5452464182932932], "isController": false}, {"data": ["POST Create Offers", 5, 0, 0.0, 173.0, 171, 176, 172.0, 176.0, 176.0, 176.0, 1.2007684918347743, 32.86751958753602, 1.0893690712055717], "isController": false}, {"data": ["POST Create Offers-1", 5, 0, 0.0, 158.6, 155, 161, 158.0, 161.0, 161.0, 161.0, 1.2048192771084338, 31.68251129518072, 0.48004518072289154], "isController": false}, {"data": ["POST Create Offers-0", 5, 0, 0.0, 14.4, 13, 16, 14.0, 16.0, 16.0, 16.0, 1.2481278082875686, 1.3424687187968047, 0.6350337774588117], "isController": false}, {"data": ["PUT Offer-0", 5, 0, 0.0, 13.4, 12, 18, 12.0, 18.0, 18.0, 18.0, 1.2484394506866416, 1.341340901997503, 0.6022745006242197], "isController": false}, {"data": ["PUT Offer-1", 5, 0, 0.0, 153.8, 147, 168, 152.0, 168.0, 168.0, 168.0, 1.20598166907863, 31.706953991799324, 0.48050832127351667], "isController": false}, {"data": ["POST Products", 5, 0, 0.0, 31.4, 30, 33, 31.0, 33.0, 33.0, 33.0, 1.2481278082875686, 2.226884282950574, 2.0464908106590114], "isController": false}, {"data": ["PUT Products", 5, 0, 0.0, 27.2, 26, 28, 27.0, 28.0, 28.0, 28.0, 1.2493753123438283, 2.2181292166416795, 2.0624453398300853], "isController": false}, {"data": ["GET Offers", 5, 0, 0.0, 17.6, 16, 18, 18.0, 18.0, 18.0, 18.0, 1.2468827930174564, 1.371571072319202, 0.5248110193266833], "isController": false}, {"data": ["POST Sign In", 5, 0, 0.0, 18.0, 17, 19, 18.0, 19.0, 19.0, 19.0, 1.2468827930174564, 2.3868551278054864, 0.6599711658354115], "isController": false}, {"data": ["GET Products", 5, 0, 0.0, 23.0, 20, 28, 22.0, 28.0, 28.0, 28.0, 1.2496875781054737, 2.1474123656585853, 0.5211099568857785], "isController": false}, {"data": ["DELETE Products", 5, 0, 0.0, 19.0, 17, 20, 20.0, 20.0, 20.0, 20.0, 1.2518778167250877, 1.0765660209063594, 0.6794860259138708], "isController": false}, {"data": ["GET Profiles", 5, 0, 0.0, 15.8, 15, 17, 16.0, 17.0, 17.0, 17.0, 1.25344697919278, 1.7984026385058913, 0.5153331818751566], "isController": false}, {"data": ["PUT Offer", 5, 0, 0.0, 167.2, 159, 181, 166.0, 181.0, 181.0, 181.0, 1.2022120702091847, 32.89951949086319, 1.0589797727819188], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 80, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
