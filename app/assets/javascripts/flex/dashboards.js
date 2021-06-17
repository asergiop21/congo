Congo.namespace('flex_dashboards.action_index');

Congo.flex_dashboards.config = {
  geo_selection: ''
}

//filters
var parsed_data = "";
var table_data = "";
var dataFromTable = []; // variable que captura ids de la tabla
var dataForCharts = {transactions: dataFromTable}; // variable para los charts
var userData = [];
dataInsc_date = {};
dataPrices = {};
dataUnit_prices = {};
dataTerrain_surfaces = {};
dataBuilding_surfaces = {};
dataDensity = {};
dataMaxHeight = {};
var filteredData = {};

function exportToExcel() {
    $("#table").table2excel({
        // exclude CSS class
        exclude: ".noExl",
        name: "Datos descargados",
        filename: "planilla de resultados", //do not include extension
        fileext: ".xls" // file extension
    });
}

function genCharts() {
    $("#table .form-check-input").each(function () {
        if (!$(this).is(":checked")) {
            dataFromTable.push($(this).val()); //variable que captura los datos de la tabla
        }
    });
    $(".user_data").each(function () {
        userData.push([$(this).attr('name'), $(this).val()]); //variable que captura los datos ingresados por el usuario
    })

    data = {transactions: dataFromTable};
    // TODO: Agregar a data un array con los ids de los registros a graficar

    // Ejemplo:
    // data = { transactions: [3929666,3898209,2615973,2597245,2594402,2506068,2503657,2503587,2482173,2464137,2307090,2303584,2261290,2261019,2255696,2254176,2189686,2189029,2186890,2186605,2185362,2165865,2165542,2163594,2163184,2156936,2155103,2122455,2095374,2095232,2091701,2066314,2019829,2010087,2003976,1990372,1968867,1968673,1968366,1909958,1904943,1902446,1901418,1887898,20611,20493,20264,19586,16595,16173,15621] }

    console.log('Parámetros charts');
    console.log(data);

    $.ajax({
        async: false,
        type: 'get',
        url: 'flex/dashboards/search_data_for_charts.json',
        datatype: 'json',
        data: data,
        success: function (data) {

            console.log('Datos charts');
            console.log(data);

            charts = data

            // Ejemplo:
            // charts = JSON.parse('[{"title":"Cantidad","series":[{"data":[{"name":"1/2018","count":1},{"name":"1/2019","count":6},{"name":"1/2020","count":2},{"name":"2/2018","count":4},{"name":"2/2019","count":4},{"name":"2/2020","count":6},{"name":"3/2018","count":5},{"name":"3/2019","count":7},{"name":"3/2020","count":1},{"name":"4/2018","count":4},{"name":"4/2019","count":1},{"name":"4/2020","count":1},{"name":"5/2018","count":2},{"name":"5/2019","count":1},{"name":"6/2018","count":3},{"name":"6/2019","count":1},{"name":"6/2020","count":2}]}]},{"title":"Superficie Útil","series":[{"data":[{"name":"1/2018","count":"126.0"},{"name":"1/2019","count":"129.3333333333333333"},{"name":"1/2020","count":"119.5"},{"name":"2/2018","count":"131.75"},{"name":"2/2019","count":"129.0"},{"name":"2/2020","count":"125.8333333333333333"},{"name":"3/2018","count":"133.2"},{"name":"3/2019","count":"123.1428571428571429"},{"name":"3/2020","count":"112.0"},{"name":"4/2018","count":"131.25"},{"name":"4/2019","count":"100.0"},{"name":"4/2020","count":"131.0"},{"name":"5/2018","count":"127.0"},{"name":"5/2019","count":"176.0"},{"name":"6/2018","count":"110.3333333333333333"},{"name":"6/2019","count":"132.0"},{"name":"6/2020","count":"141.0"}]}]},{"title":"Precio","series":[{"data":[{"name":"1/2018","count":"3165.0"},{"name":"1/2019","count":"1836.5"},{"name":"1/2020","count":"2034.0"},{"name":"2/2018","count":"1956.75"},{"name":"2/2019","count":"2149.75"},{"name":"2/2020","count":"2334.3333333333333333"},{"name":"3/2018","count":"1487.4"},{"name":"3/2019","count":"1213.2857142857142857"},{"name":"3/2020","count":"4703.0"},{"name":"4/2018","count":"3113.75"},{"name":"4/2019","count":"2162.0"},{"name":"4/2020","count":"1953.0"},{"name":"5/2018","count":"1308.5"},{"name":"5/2019","count":"731.0"},{"name":"6/2018","count":"1405.0"},{"name":"6/2019","count":"2504.0"},{"name":"6/2020","count":"2431.5"}]}]},{"title":"Precio Unitario","series":[{"data":[{"name":"1/2018","count":"25.1"},{"name":"1/2019","count":"13.9833333333333333"},{"name":"1/2020","count":"17.45"},{"name":"2/2018","count":"15.65"},{"name":"2/2019","count":"17.475"},{"name":"2/2020","count":"19.45"},{"name":"3/2018","count":"10.86"},{"name":"3/2019","count":"10.5857142857142857"},{"name":"3/2020","count":"42.0"},{"name":"4/2018","count":"25.425"},{"name":"4/2019","count":"21.6"},{"name":"4/2020","count":"14.9"},{"name":"5/2018","count":"10.1"},{"name":"5/2019","count":"4.2"},{"name":"6/2018","count":"13.0333333333333333"},{"name":"6/2019","count":"19.0"},{"name":"6/2020","count":"20.4"}]}]},{"title":"Volúmen Mercado","series":[{"data":[{"name":"1/2018","count":"3165.0"},{"name":"1/2019","count":"11019.0"},{"name":"1/2020","count":"4068.0"},{"name":"2/2018","count":"7827.0"},{"name":"2/2019","count":"8599.0"},{"name":"2/2020","count":"14005.9999999999999998"},{"name":"3/2018","count":"7437.0"},{"name":"3/2019","count":"8492.9999999999999999"},{"name":"3/2020","count":"4703.0"},{"name":"4/2018","count":"12455.0"},{"name":"4/2019","count":"2162.0"},{"name":"4/2020","count":"1953.0"},{"name":"5/2018","count":"2617.0"},{"name":"5/2019","count":"731.0"},{"name":"6/2018","count":"4215.0"},{"name":"6/2019","count":"2504.0"},{"name":"6/2020","count":"4863.0"}]}]},{"title":"Superficie Útil (barras)","series":[{"data":[{"name":"1","count":"122.1"},{"name":"2","count":"131.2"},{"name":"3","count":"125.2"},{"name":"4","count":"136.1"},{"name":"5","count":"124.0"},{"name":"6","count":"111.1"}]}]},{"title":"Precio (barras)","series":[{"data":[{"name":"1","count":"2165.0"},{"name":"2","count":"1336.5"},{"name":"3","count":"2134.0"},{"name":"4","count":"1356.75"},{"name":"5","count":"2449.75"},{"name":"6","count":"2134.3333333333333333"}]}]},{"title":"Precio Unitario (barras)","series":[{"data":[{"name":"1","count":"23.1"},{"name":"2","count":"23.9833333333333333"},{"name":"3","count":"19.45"},{"name":"4","count":"25.65"},{"name":"5","count":"13.475"},{"name":"6","count":"29.45"}]}]},{"title":"Superficie por UF","series":[{"data":[{"name":"29.5","count":"23.1","radius":"23.1"},{"name":"32.5","count":"132.9833333333333333","radius":"23.1"},{"name":"33.6","count":"123.45","radius":"23.1"},{"name":"44.1","count":"121.65","radius":"23.1"},{"name":"20.5","count":"110.475","radius":"23.1"},{"name":"15.5","count":"123.45","radius":"23.1"}]}]}]')


        },
        error: function (jqxhr, textstatus, errorthrown) {
            console.log("algo malo paso");
        }
    });

    var cantidadChart = $("#chartCantidad");
    var supUtilChart = $("#chartSupUtil");
    var precioChart = $("#chartPrecio");
    var precioUnitarioChart = $("#chartPrecioUnitario");
    var volMercadoChart = $("#chartVolMercado");
    var supUtilBarrasChart = $("#chartSupUtil-barras");
    var precioBarrasChart = $("#chartPrecio-barras");
    var precioUnitarioBarrasChart = $("#chartPrecioUnitario-barras");
    var supUFChart = $("#chartSupUF");
    labelsChart = [];
    dataChart = [];
    radioChart = [];
    $(charts).each(function () {
        if ($(this)[0]['title'] == 'Cantidad') {
            for (i = 0; i < $(this)[0]['series'][0]['data'].length; i++) {
                labelsChart.push($(this)[0]['series'][0]['data'][i]['name'])
                dataChart.push($(this)[0]['series'][0]['data'][i]['count'])
            }
            var chartCantidad = new Chart(cantidadChart, {
                type: 'line',
                data: {
                    labels: labelsChart,
                    datasets: [{
                        data: dataChart,
                        label: "",
                        fill: false,
                        borderColor: 'rgb(0,162,255)',
                        tension: 0.1,
                        backgroundColor: '#fff',
                        borderWidth: 2
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: false
                    },
                    plugins: {
                        datalabels: {
                            display: false
                        }
                    }
                }
            });
            labelsChart = [];
            dataChart = [];
        }
        if ($(this)[0]['title'] == 'Superficie Útil') {
            for (i = 0; i < $(this)[0]['series'][0]['data'].length; i++) {
                labelsChart.push($(this)[0]['series'][0]['data'][i]['name'])
                dataChart.push($(this)[0]['series'][0]['data'][i]['count'])
            }
            var chartSupUtil = new Chart(supUtilChart, {
                type: 'line',
                data: {
                    labels: labelsChart,
                    datasets: [{
                        data: dataChart,
                        label: "",
                        fill: false,
                        borderColor: 'rgb(0,162,255)',
                        tension: 0.1,
                        backgroundColor: '#fff',
                        borderWidth: 2
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: false
                    },
                    plugins: {
                        datalabels: {
                            display: false
                        }
                    }
                }
            });
            labelsChart = [];
            dataChart = [];
        }
        if ($(this)[0]['title'] == 'Precio') {
            for (i = 0; i < $(this)[0]['series'][0]['data'].length; i++) {
                labelsChart.push($(this)[0]['series'][0]['data'][i]['name'])
                dataChart.push($(this)[0]['series'][0]['data'][i]['count'])
            }
            var chartPrecio = new Chart(precioChart, {
                type: 'line',
                data: {
                    labels: labelsChart,
                    datasets: [{
                        data: dataChart,
                        label: "",
                        fill: false,
                        borderColor: 'rgb(0,162,255)',
                        tension: 0.1,
                        backgroundColor: '#fff',
                        borderWidth: 2
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: false
                    },
                    plugins: {
                        datalabels: {
                            display: false
                        }
                    }
                }
            });
            labelsChart = [];
            dataChart = [];
        }
        if ($(this)[0]['title'] == 'Precio Unitario') {
            for (i = 0; i < $(this)[0]['series'][0]['data'].length; i++) {
                labelsChart.push($(this)[0]['series'][0]['data'][i]['name'])
                dataChart.push($(this)[0]['series'][0]['data'][i]['count'])
            }
            var chartPrecioUnitario = new Chart(precioUnitarioChart, {
                type: 'line',
                data: {
                    labels: labelsChart,
                    datasets: [{
                        data: dataChart,
                        label: "",
                        fill: false,
                        borderColor: 'rgb(0,162,255)',
                        tension: 0.1,
                        backgroundColor: '#fff',
                        borderWidth: 2
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: false
                    },
                    plugins: {
                        datalabels: {
                            display: false
                        }
                    }
                }
            });
            labelsChart = [];
            dataChart = [];
        }
        if ($(this)[0]['title'] == 'Volúmen Mercado') {
            for (i = 0; i < $(this)[0]['series'][0]['data'].length; i++) {
                labelsChart.push($(this)[0]['series'][0]['data'][i]['name'])
                dataChart.push($(this)[0]['series'][0]['data'][i]['count'])
            }
            var chartVolMercado = new Chart(volMercadoChart, {
                type: 'line',
                data: {
                    labels: labelsChart,
                    datasets: [{
                        data: dataChart,
                        label: "",
                        fill: false,
                        borderColor: 'rgb(0,162,255)',
                        tension: 0.1,
                        backgroundColor: '#fff',
                        borderWidth: 2
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: false
                    },
                    plugins: {
                        datalabels: {
                            display: false
                        }
                    }
                }
            });
            labelsChart = [];
            dataChart = [];
        }
        if ($(this)[0]['title'] == 'Superficie Útil (barras)') {
            for (i = 0; i < $(this)[0]['series'][0]['data'].length; i++) {
                labelsChart.push($(this)[0]['series'][0]['data'][i]['name'])
                dataChart.push($(this)[0]['series'][0]['data'][i]['count'])
            }
            var chartSupUtilBarras = new Chart(supUtilBarrasChart, {
                type: 'bar',
                data: {
                    labels: labelsChart,
                    datasets: [{
                        data: dataChart,
                        label: "",
                        backgroundColor: 'rgb(0,162,255)',
                        tension: 0.1,
                        borderWidth: 2
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: false
                    },
                    plugins: {
                        datalabels: {
                            display: false
                        }
                    }
                }
            });
            labelsChart = [];
            dataChart = [];
        }
        if ($(this)[0]['title'] == 'Precio (barras)') {
            for (i = 0; i < $(this)[0]['series'][0]['data'].length; i++) {
                labelsChart.push($(this)[0]['series'][0]['data'][i]['name'])
                dataChart.push($(this)[0]['series'][0]['data'][i]['count'])
            }
            var chartPrecioBarras = new Chart(precioBarrasChart, {
                type: 'bar',
                data: {
                    labels: labelsChart,
                    datasets: [{
                        data: dataChart,
                        label: "",
                        backgroundColor: 'rgb(0,162,255)',
                        tension: 0.1,
                        borderWidth: 2
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: false
                    },
                    plugins: {
                        datalabels: {
                            display: false
                        }
                    }
                }
            });
            labelsChart = [];
            dataChart = [];
        }
        if ($(this)[0]['title'] == 'Precio Unitario (barras)') {
            for (i = 0; i < $(this)[0]['series'][0]['data'].length; i++) {
                labelsChart.push($(this)[0]['series'][0]['data'][i]['name'])
                dataChart.push($(this)[0]['series'][0]['data'][i]['count'])
            }
            var chartPrecioUnitarioBarras = new Chart(precioUnitarioBarrasChart, {
                type: 'bar',
                data: {
                    labels: labelsChart,
                    datasets: [{
                        data: dataChart,
                        label: "",
                        backgroundColor: 'rgb(0,162,255)',
                        tension: 0.1,
                        borderWidth: 2
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: false
                    },
                    plugins: {
                        datalabels: {
                            display: false
                        }
                    }
                }
            });
            labelsChart = [];
            dataChart = [];
        }
        if ($(this)[0]['title'] == 'Superficie por UF') {
            for (i = 0; i < $(this)[0]['series'][0]['data'].length; i++) {
                radioChart.push
                (
                    {
                        x: $(this)[0]['series'][0]['data'][i]['name'],
                        y: $(this)[0]['series'][0]['data'][i]['count'],
                        r: $(this)[0]['series'][0]['data'][i]['radius']
                    }
                );
            }
            console.log(radioChart);
            var chartSupUF = new Chart(supUFChart, {
                type: 'bubble',
                data: {
                    labels: labelsChart,
                    datasets: [{
                        data: radioChart,
                        label: "",
                        backgroundColor: 'rgb(0,162,255)',
                        borderWidth: 2
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: false
                    },
                    plugins: {
                        datalabels: {
                            display: false
                        }
                    }
                }
            });
            radioChart = [];
        }
    });
}

function clearTable() {
    $('tr.genTable').remove();
}

function update_table() {
    $(table_data).each(function (index) {
        $('#table tr:last').after(
            '<tr class="genTable">' +
            '<td><input class="form-check-input" type="checkbox" value="' + ($(this)[0]['id']) + '" checked></td>' +
            '<td>' + ($(this)[0]["property_typee"]) + '</td>' +
            '<td>' + ($(this)[0]['inscription_date']) + '</td>' +
            '<td>' + ($(this)[0]["address"]) + '</td>' +
            '<td>' + ($(this)[0]['c_name']) + '</td>' +
            '<td>' + ($(this)[0]['seller']) + '</td>' +
            '<td>' + ($(this)[0]['building_surface']) + '</td>' +
            '<td>' + ($(this)[0]['terrain_surface']) + '</td>' +
            '<td>' + ($(this)[0]['parking_lot']) + '</td>' +
            '<td>' + ($(this)[0]['cellar']) + '</td>' +
            '<td>' + ($(this)[0]['price']) + '</td>' +
            '<td class="hidden">' + '' + '</td>' +
            '<td class="hidden">' + '' + '</td>' +
            '<td class="hidden">' + ($(this)[0]['id']) + '</td>' +
            '<td class="hidden">' + '' + '</td>' +
            '<td class="hidden">' + '' + '</td>' +
            '</tr>'
        );
    });
    // sort table
    var table = $('table');

    $('#address_sort, #utilm2_sort, #e_sort, #uf_sort')
        .wrapInner('<span title="ordenar esta columna"/>')
        .each(function(){

            var th = $(this),
                thIndex = th.index(),
                inverse = false;

            th.click(function(){

                table.find('td').filter(function(){

                    return $(this).index() === thIndex;

                }).sortElements(function(a, b){

                    if( $.text([a]) == $.text([b]) )
                        return 0;

                    return $.text([a]) > $.text([b]) ?
                        inverse ? -1 : 1
                        : inverse ? 1 : -1;

                }, function(){

                    // parentNode is the element we want to move
                    return this.parentNode;

                });

                inverse = !inverse;

            });

        });
}

function getFilteredData() {

    // TODO: seller_types y property_types se deben enviar en un array con los ids seleccionados
    propertyTypes = $("#prop_type").val();
    sellerTypes = $("#seller_type").val();
    land_useType = $("#land_use").val();

    geom = Congo.flex_dashboards.config.geo_selection

    // TODO: agregar density_types (array con ids) y max_height (min y max)
    data = {
        geom: geom,
        property_types: propertyTypes,
        seller_types: sellerTypes,
        inscription_dates: dataInsc_date,
        max_height: dataMaxHeight,
        density_types: dataDensity,
        land_use: land_useType,
        building_surfaces: dataBuilding_surfaces,
        terrain_surfaces: dataTerrain_surfaces,
        prices: dataPrices,
        unit_prices: dataUnit_prices
    }

    console.log('Parámetros tabla');
    console.log(data);

    $.ajax({
        async: false,
        type: 'get',
        url: 'flex/dashboards/search_data_for_table.json',
        datatype: 'json',
        data: data,
        success: function (data) {

            console.log('Datos tabla');
            console.log(data);

            // table_data = data

            // Ejemplo:
            // table_data = JSON.parse('[{"id":3935608,"property_type_id":9,"address":"6925 Calle Rey Carlos Iii","inscription_date":"2020-12-30","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"73.0","terrain_surface":"164.0","parking_lot":0,"price":"1376.0"},{"id":3935590,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-30","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1145.0"},{"id":3935551,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-29","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1546.0"},{"id":3935550,"property_type_id":3,"address":"154 Blanco Garces","inscription_date":"2020-12-29","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":1,"price":"350.0"},{"id":3935549,"property_type_id":4,"address":"154 Blanco Garces","inscription_date":"2020-12-29","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"60.0"},{"id":3935548,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-29","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"2185.0"},{"id":3935545,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-29","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1105.0"},{"id":3935504,"property_type_id":2,"address":"55 Avenida Maria Rozas Velasquez","inscription_date":"2020-12-29","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"28.0","terrain_surface":"0.0","parking_lot":0,"price":"1500.0"},{"id":3935485,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-28","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":1,"price":"379.0"},{"id":3935484,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-28","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"2052.0"},{"id":3935474,"property_type_id":2,"address":"65 Avenida Las Rejas Norte","inscription_date":"2020-12-28","seller_type_id":1,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":1,"price":"2022.0"},{"id":3935460,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-28","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1357.0"},{"id":3935425,"property_type_id":3,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-28","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":1,"price":"420.0"},{"id":3935424,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-28","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"2424.0"},{"id":3935362,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-28","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1102.0"},{"id":3935327,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-24","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1345.0"},{"id":3935320,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-24","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1546.0"},{"id":3935315,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-24","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1102.0"},{"id":3935278,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-23","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"70.0"},{"id":3935277,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-23","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1075.0"},{"id":3935270,"property_type_id":4,"address":"4890 La Coruna","inscription_date":"2020-12-23","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"67.0"},{"id":3935263,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-23","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1395.0"},{"id":3935256,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-23","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1546.0"},{"id":3935235,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-23","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1476.0"},{"id":3935231,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-22","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1814.0"},{"id":3935207,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-22","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"2164.0"},{"id":3935148,"property_type_id":3,"address":"154 Blanco Garces","inscription_date":"2020-12-21","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":1,"price":"350.0"},{"id":3935147,"property_type_id":4,"address":"154 Blanco Garces","inscription_date":"2020-12-21","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"60.0"},{"id":3935146,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-21","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"2041.0"},{"id":3934892,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-18","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"2100.0"},{"id":3934842,"property_type_id":3,"address":"154 Blanco Garces","inscription_date":"2020-12-18","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":1,"price":"350.0"},{"id":3934841,"property_type_id":4,"address":"154 Blanco Garces","inscription_date":"2020-12-18","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"60.0"},{"id":3934840,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-18","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"2178.0"},{"id":3934825,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-18","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1440.0"},{"id":3934823,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-18","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1012.0"},{"id":3934782,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-17","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1442.0"},{"id":3934747,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-16","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1628.0"},{"id":3934729,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-16","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1628.0"},{"id":3934713,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-15","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1744.0"},{"id":3934702,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-15","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1230.0"},{"id":3934701,"property_type_id":3,"address":"154 Blanco Garces","inscription_date":"2020-12-15","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":1,"price":"330.0"},{"id":3934700,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-15","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1820.0"},{"id":3934659,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-15","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1171.0"},{"id":3934658,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-15","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"70.0"},{"id":3934657,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-15","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1640.0"},{"id":3934656,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-15","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1160.0"},{"id":3934655,"property_type_id":3,"address":"154 Blanco Garces","inscription_date":"2020-12-15","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":1,"price":"410.0"},{"id":3934654,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-15","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"2101.0"},{"id":3934651,"property_type_id":2,"address":"51 Maria Rozas Velasquez","inscription_date":"2020-12-14","seller_type_id":3,"county_id":26,"cellar":0,"building_surface":"31.0","terrain_surface":"0.0","parking_lot":0,"price":"1590.0"},{"id":3934630,"property_type_id":4,"address":"154 Blanco Garces","inscription_date":"2020-12-14","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"50.0"},{"id":3934629,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-14","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1245.0"},{"id":3934615,"property_type_id":2,"address":"135 General Velasquez","inscription_date":"2020-12-14","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"74.0","terrain_surface":"0.0","parking_lot":0,"price":"688.0"},{"id":3934588,"property_type_id":3,"address":"154 Blanco Garces","inscription_date":"2020-12-11","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":1,"price":"350.0"},{"id":3934587,"property_type_id":4,"address":"154 Blanco Garces","inscription_date":"2020-12-11","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"60.0"},{"id":3934586,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-11","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"2057.0"},{"id":3934581,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-11","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1949.0"},{"id":3934580,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-11","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1378.0"},{"id":3934577,"property_type_id":9,"address":"85 Cabildo","inscription_date":"2020-12-10","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"88.0","terrain_surface":"166.0","parking_lot":0,"price":"4490.0"},{"id":3934575,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-10","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1480.0"},{"id":3934561,"property_type_id":4,"address":"154 Blanco Garces","inscription_date":"2020-12-10","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"50.0"},{"id":3934560,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-10","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1245.0"},{"id":3934556,"property_type_id":3,"address":"154 Blanco Garces","inscription_date":"2020-12-10","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":1,"price":"60.0"},{"id":3934555,"property_type_id":4,"address":"154 Blanco Garces","inscription_date":"2020-12-10","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"350.0"},{"id":3934554,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-10","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"2052.0"},{"id":3934553,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-10","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"997.0"},{"id":3934549,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-10","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1687.0"},{"id":3934548,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-10","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1195.0"},{"id":3934545,"property_type_id":2,"address":"6260 Laguna Sur","inscription_date":"2020-12-10","seller_type_id":1,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"2063.0"},{"id":3934538,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-12-09","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1497.0"},{"id":3934534,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-09","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1433.0"},{"id":3934466,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-03","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"997.0"},{"id":3934463,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-02","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1146.0"},{"id":3934384,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-11-25","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1445.0"},{"id":3934260,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-11-16","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1449.0"},{"id":3934259,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-11-16","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1465.0"},{"id":3934204,"property_type_id":2,"address":"51 Maria Rozas Velasquez","inscription_date":"2020-11-11","seller_type_id":3,"county_id":26,"cellar":0,"building_surface":"38.0","terrain_surface":"0.0","parking_lot":0,"price":"2160.0"},{"id":3934192,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-11-10","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"70.0"},{"id":3934191,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-11-10","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"2045.0"},{"id":3933988,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-28","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1814.0"},{"id":3933776,"property_type_id":2,"address":"51 Maria Rozas Velasquez","inscription_date":"2020-10-01","seller_type_id":3,"county_id":26,"cellar":0,"building_surface":"31.0","terrain_surface":"0.0","parking_lot":0,"price":"2116.0"},{"id":3933772,"property_type_id":2,"address":"51 Maria Rozas Velasquez","inscription_date":"2020-09-25","seller_type_id":3,"county_id":26,"cellar":0,"building_surface":"47.0","terrain_surface":"0.0","parking_lot":1,"price":"3126.0"},{"id":3933770,"property_type_id":2,"address":"51 Maria Rozas Velasquez","inscription_date":"2020-09-24","seller_type_id":3,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":1,"price":"3122.0"},{"id":3933761,"property_type_id":2,"address":"6281 Oceanica","inscription_date":"2020-08-31","seller_type_id":1,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":1,"price":"4184.0"},{"id":3933754,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-08-25","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1350.0"},{"id":3933748,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-08-19","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1722.0"},{"id":3933723,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-07-09","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1711.0"},{"id":3933715,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-07-06","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"60.0"},{"id":3933714,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-07-06","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1517.0"},{"id":3933682,"property_type_id":2,"address":"51 Maria Rozas Velasquez","inscription_date":"2020-06-15","seller_type_id":3,"county_id":26,"cellar":0,"building_surface":"31.0","terrain_surface":"0.0","parking_lot":1,"price":"2550.0"},{"id":3933680,"property_type_id":2,"address":"51 Maria Rozas","inscription_date":"2020-06-12","seller_type_id":3,"county_id":26,"cellar":0,"building_surface":"31.0","terrain_surface":"0.0","parking_lot":0,"price":"2027.0"},{"id":3933664,"property_type_id":2,"address":"51 Maria Rozas Velasquez","inscription_date":"2020-06-01","seller_type_id":3,"county_id":26,"cellar":1,"building_surface":"44.0","terrain_surface":"0.0","parking_lot":1,"price":"3071.0"},{"id":3933663,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-05-29","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"1184.0"},{"id":3933662,"property_type_id":2,"address":"4890 La Coruna","inscription_date":"2020-05-29","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"21.0","terrain_surface":"0.0","parking_lot":0,"price":"1911.0"},{"id":3933626,"property_type_id":2,"address":"6241 Oceanica","inscription_date":"2020-01-27","seller_type_id":1,"county_id":26,"cellar":1,"building_surface":"69.0","terrain_surface":"0.0","parking_lot":1,"price":"4414.0"},{"id":3929942,"property_type_id":2,"address":"864 Pedro Leon Ugalde","inscription_date":"2020-12-15","seller_type_id":2,"county_id":46,"cellar":0,"building_surface":"54.0","terrain_surface":"0.0","parking_lot":2,"price":"2087.0"},{"id":3929666,"property_type_id":1,"address":"632 Cruchaga Montt","inscription_date":"2020-12-14","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"172.0","terrain_surface":"172.0","parking_lot":0,"price":"1032.0"},{"id":3927352,"property_type_id":4,"address":"864 Pedro Leon Ugalde","inscription_date":"2020-11-20","seller_type_id":2,"county_id":46,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"45.0"},{"id":3927346,"property_type_id":1,"address":"7044 Pasaje Lago Palena","inscription_date":"2020-11-20","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"44.0","terrain_surface":"105.0","parking_lot":0,"price":"794.0"},{"id":3927346,"property_type_id":1,"address":"7044 Pasaje Lago Palena","inscription_date":"2020-11-20","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"44.0","terrain_surface":"105.0","parking_lot":0,"price":"794.0"},{"id":3899600,"property_type_id":1,"address":"7525 Pasaje General Marcos Maturana","inscription_date":"2020-12-10","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"36.0","terrain_surface":"216.0","parking_lot":0,"price":"688.0"},{"id":3899491,"property_type_id":2,"address":"7313 Pasaje Quila","inscription_date":"2020-12-09","seller_type_id":2,"county_id":9,"cellar":0,"building_surface":"67.0","terrain_surface":"0.0","parking_lot":1,"price":"3102.0"},{"id":3899491,"property_type_id":2,"address":"7313 Pasaje Quila","inscription_date":"2020-12-09","seller_type_id":2,"county_id":9,"cellar":0,"building_surface":"67.0","terrain_surface":"0.0","parking_lot":1,"price":"3102.0"},{"id":3899466,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-12-09","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"2114.0"},{"id":3899430,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-12-09","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1887.0"},{"id":3899429,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-12-09","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1940.0"},{"id":3899428,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-12-09","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1478.0"},{"id":3899388,"property_type_id":2,"address":"323 Calle Los Ruisenores","inscription_date":"2020-12-07","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"49.0","terrain_surface":"0.0","parking_lot":0,"price":"1718.0"},{"id":3899388,"property_type_id":2,"address":"323 Calle Los Ruisenores","inscription_date":"2020-12-07","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"49.0","terrain_surface":"0.0","parking_lot":0,"price":"1718.0"},{"id":3899387,"property_type_id":2,"address":"760 Cruchaga Montt","inscription_date":"2020-12-07","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"50.0","terrain_surface":"0.0","parking_lot":0,"price":"1747.0"},{"id":3899375,"property_type_id":3,"address":"154 Calle Blanco Garces","inscription_date":"2020-12-07","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":1,"price":"250.0"},{"id":3899374,"property_type_id":4,"address":"154 Calle Blanco Garces","inscription_date":"2020-12-07","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"50.0"},{"id":3899373,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-12-07","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1269.0"},{"id":3899362,"property_type_id":2,"address":"61 Encinas","inscription_date":"2020-12-07","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"80.0","terrain_surface":"0.0","parking_lot":0,"price":"860.0"},{"id":3899357,"property_type_id":1,"address":"239 El Greco","inscription_date":"2020-12-07","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"35.0","terrain_surface":"123.0","parking_lot":0,"price":"1793.0"},{"id":3899353,"property_type_id":3,"address":"154 Calle Blanco Garces","inscription_date":"2020-12-07","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":1,"price":"350.0"},{"id":3899352,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-12-07","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1738.0"},{"id":3899330,"property_type_id":2,"address":"4464 Calle Compania","inscription_date":"2020-12-04","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"51.0","terrain_surface":"0.0","parking_lot":0,"price":"2200.0"},{"id":3899313,"property_type_id":2,"address":"760 Cruchaga Montt","inscription_date":"2020-12-04","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"47.0","terrain_surface":"0.0","parking_lot":0,"price":"1714.0"},{"id":3899244,"property_type_id":2,"address":"154 Blanco Baces","inscription_date":"2020-12-04","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1940.0"},{"id":3899220,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-12-03","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1570.0"},{"id":3899121,"property_type_id":2,"address":"760 Cruchaga Montt","inscription_date":"2020-12-03","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"49.0","terrain_surface":"0.0","parking_lot":0,"price":"1653.0"},{"id":3899110,"property_type_id":2,"address":"7343 Mar Del Sur","inscription_date":"2020-12-02","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"48.0","terrain_surface":"0.0","parking_lot":0,"price":"1722.0"},{"id":3899110,"property_type_id":2,"address":"7343 Mar Del Sur","inscription_date":"2020-12-02","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"48.0","terrain_surface":"0.0","parking_lot":0,"price":"1722.0"},{"id":3899098,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-12-02","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1570.0"},{"id":3899088,"property_type_id":2,"address":"6251 Laguna Sur","inscription_date":"2020-12-02","seller_type_id":1,"county_id":26,"cellar":1,"building_surface":"68.0","terrain_surface":"0.0","parking_lot":0,"price":"3323.0"},{"id":3899038,"property_type_id":2,"address":"51 Maria Rozas Velasquez","inscription_date":"2020-12-02","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"31.0","terrain_surface":"0.0","parking_lot":0,"price":"1740.0"},{"id":3898900,"property_type_id":1,"address":"7176 Marta Brunet","inscription_date":"2020-12-01","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"45.0","terrain_surface":"62.0","parking_lot":0,"price":"1158.0"},{"id":3898900,"property_type_id":1,"address":"7176 Marta Brunet","inscription_date":"2020-12-01","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"45.0","terrain_surface":"62.0","parking_lot":0,"price":"1158.0"},{"id":3898895,"property_type_id":1,"address":"5008 Edison","inscription_date":"2020-12-01","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"57.0","terrain_surface":"114.0","parking_lot":0,"price":"2583.0"},{"id":3898893,"property_type_id":2,"address":"7293 Pasaje Llongol","inscription_date":"2020-11-30","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"67.0","terrain_surface":"0.0","parking_lot":0,"price":"396.0"},{"id":3898893,"property_type_id":2,"address":"7293 Pasaje Llongol","inscription_date":"2020-11-30","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"67.0","terrain_surface":"0.0","parking_lot":0,"price":"396.0"},{"id":3898812,"property_type_id":2,"address":"65 Las Acacias","inscription_date":"2020-11-30","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"89.0","terrain_surface":"0.0","parking_lot":0,"price":"2756.0"},{"id":3898738,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-27","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1455.0"},{"id":3898644,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-26","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1200.0"},{"id":3898601,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-26","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1445.0"},{"id":3898592,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-11-26","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1776.0"},{"id":3898556,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-25","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1659.0"},{"id":3898555,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-25","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1378.0"},{"id":3898554,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-25","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1757.0"},{"id":3898533,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-25","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1825.0"},{"id":3898532,"property_type_id":4,"address":"285 Las Torres","inscription_date":"2020-11-25","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"50.0"},{"id":3898531,"property_type_id":3,"address":"285 Las Torres","inscription_date":"2020-11-25","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":1,"price":"250.0"},{"id":3898530,"property_type_id":2,"address":"285 Las Torres","inscription_date":"2020-11-25","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"54.0","terrain_surface":"0.0","parking_lot":0,"price":"2776.0"},{"id":3898529,"property_type_id":3,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-25","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":1,"price":"240.0"},{"id":3898528,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-25","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1848.0"},{"id":3898527,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-11-25","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1357.0"},{"id":3898410,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-24","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1395.0"},{"id":3898409,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-24","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1556.0"},{"id":3898408,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-24","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1395.0"},{"id":3898379,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-24","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1757.0"},{"id":3898365,"property_type_id":1,"address":"238 Las Torres","inscription_date":"2020-11-24","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"56.0","terrain_surface":"153.0","parking_lot":0,"price":"1035.0"},{"id":3898317,"property_type_id":1,"address":"510 Francisco Javier","inscription_date":"2020-11-24","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"147.0","terrain_surface":"110.0","parking_lot":0,"price":"250.0"},{"id":3898317,"property_type_id":1,"address":"510 Francisco Javier","inscription_date":"2020-11-24","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"147.0","terrain_surface":"110.0","parking_lot":0,"price":"250.0"},{"id":3898271,"property_type_id":3,"address":"4464 Calle Compania","inscription_date":"2020-11-23","seller_type_id":3,"county_id":46,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":1,"price":"150.0"},{"id":3898236,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-23","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1887.0"},{"id":3898209,"property_type_id":1,"address":"4588 Pasaje Elvira Davila","inscription_date":"2020-11-23","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"110.0","terrain_surface":"196.0","parking_lot":0,"price":"3831.0"},{"id":3898183,"property_type_id":1,"address":"4441 Porto Seguro","inscription_date":"2020-11-23","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"124.0","terrain_surface":"300.0","parking_lot":0,"price":"250.0"},{"id":3898183,"property_type_id":1,"address":"4441 Porto Seguro","inscription_date":"2020-11-23","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"124.0","terrain_surface":"300.0","parking_lot":0,"price":"250.0"},{"id":3898182,"property_type_id":1,"address":"4441 Porto Seguro","inscription_date":"2020-11-23","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"124.0","terrain_surface":"300.0","parking_lot":0,"price":"250.0"},{"id":3898182,"property_type_id":1,"address":"4441 Porto Seguro","inscription_date":"2020-11-23","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"124.0","terrain_surface":"300.0","parking_lot":0,"price":"250.0"},{"id":3898181,"property_type_id":1,"address":"4441 Porto Seguro","inscription_date":"2020-11-23","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"124.0","terrain_surface":"300.0","parking_lot":0,"price":"250.0"},{"id":3898181,"property_type_id":1,"address":"4441 Porto Seguro","inscription_date":"2020-11-23","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"124.0","terrain_surface":"300.0","parking_lot":0,"price":"250.0"},{"id":3898176,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-23","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1757.0"},{"id":3898137,"property_type_id":3,"address":"810 Calle Radal","inscription_date":"2020-11-20","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":1,"price":"200.0"},{"id":3898137,"property_type_id":3,"address":"810 Calle Radal","inscription_date":"2020-11-20","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":1,"price":"200.0"},{"id":3898118,"property_type_id":2,"address":"5064 Buzo Sobenes","inscription_date":"2020-11-20","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1139.0"},{"id":3898117,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-11-20","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"69.0"},{"id":3898116,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-11-20","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"58.0"},{"id":3898078,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-11-20","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1290.0"},{"id":3898072,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-20","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1494.0"},{"id":3898062,"property_type_id":1,"address":"5115 Nueva Imperial","inscription_date":"2020-11-20","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"130.0","terrain_surface":"340.0","parking_lot":0,"price":"2866.0"},{"id":3898062,"property_type_id":1,"address":"5115 Nueva Imperial","inscription_date":"2020-11-20","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"130.0","terrain_surface":"340.0","parking_lot":0,"price":"2866.0"},{"id":3898019,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-19","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1552.0"},{"id":3897989,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-19","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1776.0"},{"id":3897952,"property_type_id":1,"address":"7058 Laguna Sur","inscription_date":"2020-11-18","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"64.0","terrain_surface":"270.0","parking_lot":0,"price":"4020.0"},{"id":3897952,"property_type_id":1,"address":"7058 Laguna Sur","inscription_date":"2020-11-18","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"64.0","terrain_surface":"270.0","parking_lot":0,"price":"4020.0"},{"id":3897923,"property_type_id":2,"address":"327 Los Ruisenores","inscription_date":"2020-11-18","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"56.0","terrain_surface":"0.0","parking_lot":0,"price":"1779.0"},{"id":3897923,"property_type_id":2,"address":"327 Los Ruisenores","inscription_date":"2020-11-18","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"56.0","terrain_surface":"0.0","parking_lot":0,"price":"1779.0"},{"id":3897918,"property_type_id":3,"address":"4650 Buzo Sobenes","inscription_date":"2020-11-18","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":1,"price":"300.0"},{"id":3897917,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-11-18","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"2023.0"},{"id":3897898,"property_type_id":1,"address":"6926 Calle Pasaje Martin De Mujica","inscription_date":"2020-11-18","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"63.0","terrain_surface":"159.0","parking_lot":0,"price":"3282.0"},{"id":3897812,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-17","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1776.0"},{"id":3897779,"property_type_id":2,"address":"38 Santa Petronila","inscription_date":"2020-11-16","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"21.0","terrain_surface":"0.0","parking_lot":0,"price":"1500.0"},{"id":3897736,"property_type_id":4,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-16","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"60.0"},{"id":3897735,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-16","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"2503.0"},{"id":3897733,"property_type_id":2,"address":"38 Santa Petronila","inscription_date":"2020-11-16","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"21.0","terrain_surface":"0.0","parking_lot":0,"price":"1175.0"},{"id":3897697,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-16","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1782.0"},{"id":3897681,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-16","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1776.0"},{"id":3897663,"property_type_id":1,"address":"4718 Calle La Coruna","inscription_date":"2020-11-16","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"170.0","terrain_surface":"325.0","parking_lot":0,"price":"3802.0"},{"id":3897644,"property_type_id":2,"address":"4464 Compania","inscription_date":"2020-11-13","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"39.0","terrain_surface":"0.0","parking_lot":0,"price":"1990.0"},{"id":3897629,"property_type_id":1,"address":"6024 Calle Lago Llanquihue","inscription_date":"2020-11-13","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"56.0","terrain_surface":"56.0","parking_lot":0,"price":"1745.0"},{"id":3897453,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-11-12","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1554.0"},{"id":3897430,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-11-12","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"60.0"},{"id":3897429,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-11-12","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1509.0"},{"id":3897408,"property_type_id":2,"address":"6988 La Travesia","inscription_date":"2020-11-11","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"49.0","terrain_surface":"0.0","parking_lot":0,"price":"2030.0"},{"id":3897408,"property_type_id":2,"address":"6988 La Travesia","inscription_date":"2020-11-11","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"49.0","terrain_surface":"0.0","parking_lot":0,"price":"2030.0"},{"id":3897373,"property_type_id":1,"address":"2 Calle Plazuela Del Peumo","inscription_date":"2020-11-11","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"85.0","terrain_surface":"145.0","parking_lot":0,"price":"281.0"},{"id":3897358,"property_type_id":2,"address":"5462 Camino De Loyola","inscription_date":"2020-11-11","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"761.0"},{"id":3897300,"property_type_id":1,"address":"333 Calle Pasaje Antonio Machado","inscription_date":"2020-11-10","seller_type_id":3,"county_id":9,"cellar":0,"building_surface":"68.0","terrain_surface":"139.0","parking_lot":0,"price":"2726.0"},{"id":3897300,"property_type_id":1,"address":"333 Calle Pasaje Antonio Machado","inscription_date":"2020-11-10","seller_type_id":3,"county_id":9,"cellar":0,"building_surface":"68.0","terrain_surface":"139.0","parking_lot":0,"price":"2726.0"},{"id":3897296,"property_type_id":1,"address":"333 Teniente Cruz","inscription_date":"2020-11-10","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"61.0","terrain_surface":"171.0","parking_lot":0,"price":"1384.0"},{"id":3897176,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-11-10","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1735.0"},{"id":3897012,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-09","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1379.0"},{"id":3896970,"property_type_id":3,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-06","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":1,"price":"290.0"},{"id":3896969,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-06","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"990.0"},{"id":3896904,"property_type_id":2,"address":"864 Calle Pedro Leon Ugalde","inscription_date":"2020-11-05","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"44.0","terrain_surface":"0.0","parking_lot":0,"price":"797.0"},{"id":3896733,"property_type_id":1,"address":"472 Calle Pasaje Las Diucas","inscription_date":"2020-11-04","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"54.0","terrain_surface":"119.0","parking_lot":0,"price":"250.0"},{"id":3896733,"property_type_id":1,"address":"472 Calle Pasaje Las Diucas","inscription_date":"2020-11-04","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"54.0","terrain_surface":"119.0","parking_lot":0,"price":"250.0"},{"id":3896636,"property_type_id":2,"address":"65 Las Rejas Norte","inscription_date":"2020-11-04","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"27.0","terrain_surface":"0.0","parking_lot":0,"price":"2000.0"},{"id":3896593,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-04","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1887.0"},{"id":3896464,"property_type_id":1,"address":"7137 Calle Los Halcones","inscription_date":"2020-11-03","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"54.0","terrain_surface":"80.0","parking_lot":0,"price":"797.0"},{"id":3896464,"property_type_id":1,"address":"7137 Calle Los Halcones","inscription_date":"2020-11-03","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"54.0","terrain_surface":"80.0","parking_lot":0,"price":"797.0"},{"id":3896329,"property_type_id":1,"address":"7106 Calle Laguna Sur","inscription_date":"2020-11-03","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"44.0","terrain_surface":"120.0","parking_lot":0,"price":"797.0"},{"id":3896329,"property_type_id":1,"address":"7106 Calle Laguna Sur","inscription_date":"2020-11-03","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"44.0","terrain_surface":"120.0","parking_lot":0,"price":"797.0"},{"id":3896246,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-11-02","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1980.0"},{"id":3896225,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-11-02","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1161.0"},{"id":3896013,"property_type_id":4,"address":"51 Maria Rozas Velasquez","inscription_date":"2020-10-29","seller_type_id":3,"county_id":26,"cellar":2,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"100.0"},{"id":3895981,"property_type_id":2,"address":"51 Av Maria R Velasquez","inscription_date":"2020-10-28","seller_type_id":1,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":1,"price":"2498.0"},{"id":3895974,"property_type_id":2,"address":"774 Radal","inscription_date":"2020-10-28","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"55.0","terrain_surface":"0.0","parking_lot":0,"price":"763.0"},{"id":3895974,"property_type_id":2,"address":"774 Radal","inscription_date":"2020-10-28","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"55.0","terrain_surface":"0.0","parking_lot":0,"price":"763.0"},{"id":3895972,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-10-28","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1940.0"},{"id":3895955,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-28","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1160.0"},{"id":3895954,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-10-28","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1424.0"},{"id":3895949,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-28","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1177.0"},{"id":3895948,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-28","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"70.0"},{"id":3895947,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-28","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1938.0"},{"id":3895946,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-28","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1937.0"},{"id":3895912,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-28","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"70.0"},{"id":3895911,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-28","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1163.0"},{"id":3895865,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-10-27","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1766.0"},{"id":3895854,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-10-27","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1130.0"},{"id":3895841,"property_type_id":3,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-27","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":1,"price":"260.0"},{"id":3895838,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-27","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1514.0"},{"id":3895832,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-27","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1622.0"},{"id":3895816,"property_type_id":2,"address":"51 Maria Rozas Velasquez","inscription_date":"2020-10-27","seller_type_id":3,"county_id":26,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":1,"price":"2605.0"},{"id":3895805,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-27","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"64.0"},{"id":3895804,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-27","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1514.0"},{"id":3895782,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-26","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1517.0"},{"id":3895766,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-26","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1937.0"},{"id":3895765,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-26","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"2212.0"},{"id":3895755,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-26","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1317.0"},{"id":3895752,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-26","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"64.0"},{"id":3895751,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-26","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1514.0"},{"id":3895750,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-26","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"64.0"},{"id":3895749,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-26","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1514.0"},{"id":3895745,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-26","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"64.0"},{"id":3895744,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-26","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1514.0"},{"id":3895743,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-10-26","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1499.0"},{"id":3895742,"property_type_id":2,"address":"61 Maria Rozas Velasquez","inscription_date":"2020-10-26","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"28.0","terrain_surface":"0.0","parking_lot":0,"price":"1553.0"},{"id":3895727,"property_type_id":4,"address":"285 Las Torres","inscription_date":"2020-10-26","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"50.0"},{"id":3895717,"property_type_id":4,"address":"154 Calle Blanco Garces","inscription_date":"2020-10-26","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"60.0"},{"id":3895716,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-10-26","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1762.0"},{"id":3895715,"property_type_id":4,"address":"154 Calle Blanco Garces","inscription_date":"2020-10-26","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"60.0"},{"id":3895714,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-10-26","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1772.0"},{"id":3895676,"property_type_id":1,"address":"6544 Laguna Sur","inscription_date":"2020-10-23","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"80.0","terrain_surface":"169.0","parking_lot":0,"price":"278.0"},{"id":3895673,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-23","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"2212.0"},{"id":3895671,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-23","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"60.0"},{"id":3895670,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-23","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1309.0"},{"id":3895649,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-23","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"64.0"},{"id":3895648,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-23","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1514.0"},{"id":3895647,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-23","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1130.0"},{"id":3895646,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-23","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"70.0"},{"id":3895645,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-23","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1407.0"},{"id":3895637,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-10-23","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1425.0"},{"id":3895634,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-10-23","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1599.0"},{"id":3895630,"property_type_id":2,"address":"51 Maria Rozas Velasquez","inscription_date":"2020-10-23","seller_type_id":3,"county_id":26,"cellar":0,"building_surface":"30.0","terrain_surface":"0.0","parking_lot":0,"price":"1935.0"},{"id":3895584,"property_type_id":2,"address":"200 Neptuno","inscription_date":"2020-10-22","seller_type_id":1,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"2762.0"},{"id":3895577,"property_type_id":2,"address":"4890 La Coruna","inscription_date":"2020-10-22","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"41.0","terrain_surface":"0.0","parking_lot":1,"price":"3173.0"},{"id":3895546,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-22","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1743.0"},{"id":3895540,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-22","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1622.0"},{"id":3895523,"property_type_id":2,"address":"65 Las Rejas Norte","inscription_date":"2020-10-22","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"27.0","terrain_surface":"0.0","parking_lot":0,"price":"931.0"},{"id":3895434,"property_type_id":1,"address":"506 Pasaje Las Garzas","inscription_date":"2020-10-21","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"52.0","terrain_surface":"87.0","parking_lot":0,"price":"2786.0"},{"id":3895434,"property_type_id":1,"address":"506 Pasaje Las Garzas","inscription_date":"2020-10-21","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"52.0","terrain_surface":"87.0","parking_lot":0,"price":"2786.0"},{"id":3895380,"property_type_id":2,"address":"760 Calle Cruchaga Montt","inscription_date":"2020-10-20","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"50.0","terrain_surface":"0.0","parking_lot":0,"price":"650.0"},{"id":3895333,"property_type_id":1,"address":"522 Pasaje Los Mirlos","inscription_date":"2020-10-20","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"88.0","terrain_surface":"94.0","parking_lot":0,"price":"2061.0"},{"id":3895333,"property_type_id":1,"address":"522 Pasaje Los Mirlos","inscription_date":"2020-10-20","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"88.0","terrain_surface":"94.0","parking_lot":0,"price":"2061.0"},{"id":3895312,"property_type_id":1,"address":"226 Pasaje Flor De Quillen","inscription_date":"2020-10-20","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"48.0","terrain_surface":"132.0","parking_lot":0,"price":"2800.0"},{"id":3895312,"property_type_id":1,"address":"226 Pasaje Flor De Quillen","inscription_date":"2020-10-20","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"48.0","terrain_surface":"132.0","parking_lot":0,"price":"2800.0"},{"id":3895265,"property_type_id":1,"address":"1018 Ernesto Samit","inscription_date":"2020-10-19","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"140.0","terrain_surface":"211.0","parking_lot":0,"price":"2954.0"},{"id":3895251,"property_type_id":1,"address":"106 Lago General Carrera","inscription_date":"2020-10-19","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"154.0","terrain_surface":"207.0","parking_lot":0,"price":"250.0"},{"id":3895251,"property_type_id":1,"address":"106 Lago General Carrera","inscription_date":"2020-10-19","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"154.0","terrain_surface":"207.0","parking_lot":0,"price":"250.0"},{"id":3895247,"property_type_id":1,"address":"1315 Gaspar De Toro","inscription_date":"2020-10-19","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"62.0","terrain_surface":"152.0","parking_lot":0,"price":"695.0"},{"id":3895237,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-19","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"70.0"},{"id":3895236,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-19","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1163.0"},{"id":3895232,"property_type_id":1,"address":"4350 Porto Seguro","inscription_date":"2020-10-19","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"56.0","terrain_surface":"0.0","parking_lot":0,"price":"1043.0"},{"id":3895232,"property_type_id":1,"address":"4350 Porto Seguro","inscription_date":"2020-10-19","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"56.0","terrain_surface":"0.0","parking_lot":0,"price":"1043.0"},{"id":3895063,"property_type_id":1,"address":"6974 Pasaje Los Condes","inscription_date":"2020-10-15","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"56.0","terrain_surface":"128.0","parking_lot":0,"price":"2383.0"},{"id":3895063,"property_type_id":1,"address":"6974 Pasaje Los Condes","inscription_date":"2020-10-15","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"56.0","terrain_surface":"128.0","parking_lot":0,"price":"2383.0"},{"id":3895045,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-10-15","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1757.0"},{"id":3895042,"property_type_id":1,"address":"4414 Calle Catedral","inscription_date":"2020-10-15","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"132.0","terrain_surface":"782.0","parking_lot":0,"price":"11136.0"},{"id":3895041,"property_type_id":1,"address":"4428 Calle Catedral","inscription_date":"2020-10-15","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"8566.0"},{"id":3895033,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-10-15","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1757.0"},{"id":3895028,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-15","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1290.0"},{"id":3894937,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-14","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"2122.0"},{"id":3894911,"property_type_id":2,"address":"3657 Laguna Sur","inscription_date":"2020-10-13","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"96.0","terrain_surface":"0.0","parking_lot":0,"price":"1629.0"},{"id":3894898,"property_type_id":2,"address":"51 Maria Rozas Velasquez","inscription_date":"2020-10-13","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"44.0","terrain_surface":"0.0","parking_lot":0,"price":"696.0"},{"id":3894879,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-10-09","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1378.0"},{"id":3894832,"property_type_id":2,"address":"51 Maria Rozas Velasquez","inscription_date":"2020-10-07","seller_type_id":3,"county_id":26,"cellar":0,"building_surface":"21.0","terrain_surface":"0.0","parking_lot":0,"price":"1215.0"},{"id":3894807,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-07","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"70.0"},{"id":3894806,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-07","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1050.0"},{"id":3894792,"property_type_id":2,"address":"65 Las Rejas Norte","inscription_date":"2020-10-06","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"27.0","terrain_surface":"0.0","parking_lot":0,"price":"1645.0"},{"id":3894782,"property_type_id":2,"address":"200 Calle Neptuno","inscription_date":"2020-10-06","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"59.0","terrain_surface":"0.0","parking_lot":0,"price":"3040.0"},{"id":3894768,"property_type_id":2,"address":"65 Maria Rozas Velasquez","inscription_date":"2020-10-06","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"27.0","terrain_surface":"0.0","parking_lot":0,"price":"1645.0"},{"id":3894759,"property_type_id":4,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-06","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"70.0"},{"id":3894758,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-10-06","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1050.0"},{"id":3894739,"property_type_id":2,"address":"65 Maria Rosas Velasquez","inscription_date":"2020-10-05","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"27.0","terrain_surface":"0.0","parking_lot":0,"price":"1645.0"},{"id":3894701,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2020-10-01","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"28.0","terrain_surface":"0.0","parking_lot":0,"price":"1790.0"},{"id":3894684,"property_type_id":1,"address":"355 Pasaje Las Taguas","inscription_date":"2020-10-01","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"79.0","terrain_surface":"104.0","parking_lot":0,"price":"2612.0"},{"id":3894683,"property_type_id":2,"address":"145 Padre Alberto Hurtado","inscription_date":"2020-10-01","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"32.0","terrain_surface":"0.0","parking_lot":0,"price":"1602.0"},{"id":3894665,"property_type_id":1,"address":"816 Carlos Pezoa Veliz","inscription_date":"2020-10-01","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"48.0","terrain_surface":"90.0","parking_lot":0,"price":"1393.0"},{"id":3894659,"property_type_id":2,"address":"65 Las Rejas Norte","inscription_date":"2020-09-30","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"27.0","terrain_surface":"0.0","parking_lot":0,"price":"1533.0"},{"id":3894651,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-09-30","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1044.0"},{"id":3894646,"property_type_id":2,"address":"51 Maria Rozas Velasquez","inscription_date":"2020-09-30","seller_type_id":3,"county_id":26,"cellar":0,"building_surface":"44.0","terrain_surface":"0.0","parking_lot":1,"price":"2990.0"},{"id":3894644,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-09-30","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1307.0"},{"id":3894629,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-09-29","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1570.0"},{"id":3894628,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-09-29","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1570.0"},{"id":3894619,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-09-29","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1290.0"},{"id":3894598,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-09-29","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1529.0"},{"id":3894593,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-09-29","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"2158.0"},{"id":3894566,"property_type_id":1,"address":"162 Jose De Rivera","inscription_date":"2020-09-28","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"77.0","terrain_surface":"88.0","parking_lot":0,"price":"2265.0"},{"id":3894556,"property_type_id":1,"address":"4417 Nueva Imperial","inscription_date":"2020-09-28","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"96.0","terrain_surface":"82.0","parking_lot":0,"price":"523.0"},{"id":3894556,"property_type_id":1,"address":"4417 Nueva Imperial","inscription_date":"2020-09-28","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"96.0","terrain_surface":"82.0","parking_lot":0,"price":"523.0"},{"id":3894546,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-09-28","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1408.0"},{"id":3894545,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-09-28","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"971.0"},{"id":3894544,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-09-28","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"971.0"},{"id":3894543,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-09-28","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1161.0"},{"id":3894542,"property_type_id":4,"address":"154 Calle Blanco Garces","inscription_date":"2020-09-28","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"50.0"},{"id":3894541,"property_type_id":3,"address":"154 Calle Blanco Garces","inscription_date":"2020-09-28","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":1,"price":"239.0"},{"id":3894540,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-09-28","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1665.0"},{"id":3894527,"property_type_id":2,"address":"51 Maria Rozas Velasquez","inscription_date":"2020-09-25","seller_type_id":3,"county_id":26,"cellar":1,"building_surface":"47.0","terrain_surface":"0.0","parking_lot":1,"price":"3248.0"},{"id":3894504,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-09-25","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1893.0"},{"id":3894502,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-09-25","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1433.0"},{"id":3894501,"property_type_id":2,"address":"154 Calle Blanco Garces","inscription_date":"2020-09-25","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1433.0"},{"id":3894496,"property_type_id":2,"address":"51 Maria Rozas Velasquez","inscription_date":"2020-09-24","seller_type_id":3,"county_id":26,"cellar":0,"building_surface":"31.0","terrain_surface":"0.0","parking_lot":0,"price":"1390.0"},{"id":3894484,"property_type_id":2,"address":"61 Maria Rozas Velasquez","inscription_date":"2020-09-24","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"27.0","terrain_surface":"0.0","parking_lot":0,"price":"1780.0"},{"id":3894382,"property_type_id":1,"address":"553 Calle Blanco Garces","inscription_date":"2020-09-11","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"124.0","terrain_surface":"500.0","parking_lot":0,"price":"488.0"},{"id":3894350,"property_type_id":2,"address":"810 Calle Radal","inscription_date":"2020-09-09","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"45.0","terrain_surface":"0.0","parking_lot":0,"price":"1570.0"},{"id":3894350,"property_type_id":2,"address":"810 Calle Radal","inscription_date":"2020-09-09","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"45.0","terrain_surface":"0.0","parking_lot":0,"price":"1570.0"},{"id":3894349,"property_type_id":2,"address":"760 Cruchaga Montt","inscription_date":"2020-09-09","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"49.0","terrain_surface":"0.0","parking_lot":0,"price":"1941.0"},{"id":3894330,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-09-04","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1333.0"},{"id":3894306,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-09-02","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1601.0"},{"id":3894304,"property_type_id":2,"address":"4464 Compania","inscription_date":"2020-09-01","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":1,"price":"1057.0"},{"id":3894288,"property_type_id":3,"address":"154 Calle Blanco Garces","inscription_date":"2020-08-31","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":1,"price":"275.0"},{"id":3894286,"property_type_id":1,"address":"4631 Paraguay","inscription_date":"2020-08-31","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"594.0","terrain_surface":"594.0","parking_lot":0,"price":"16283.0"},{"id":3894250,"property_type_id":2,"address":"6281 Oceanica","inscription_date":"2020-08-21","seller_type_id":1,"county_id":26,"cellar":1,"building_surface":"71.0","terrain_surface":"0.0","parking_lot":1,"price":"2093.0"},{"id":3894134,"property_type_id":2,"address":"4650 Buzo Sobenes","inscription_date":"2020-07-07","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1338.0"},{"id":3894008,"property_type_id":4,"address":"51 Maria Rozas Velasquez","inscription_date":"2020-04-21","seller_type_id":3,"county_id":26,"cellar":2,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"100.0"},{"id":3893969,"property_type_id":2,"address":"4890 La Coruna","inscription_date":"2020-03-02","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"41.0","terrain_surface":"0.0","parking_lot":0,"price":"2177.0"},{"id":3893960,"property_type_id":2,"address":"55 Maria Rozas Velasquez","inscription_date":"2020-02-21","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"21.0","terrain_surface":"0.0","parking_lot":0,"price":"813.0"},{"id":3893922,"property_type_id":1,"address":"876 Carlos Pezoa Veliz","inscription_date":"2020-01-10","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"45.0","terrain_surface":"90.0","parking_lot":0,"price":"250.0"},{"id":2641043,"property_type_id":2,"address":"864 Pedro Leon Ugalde","inscription_date":"2018-11-23","seller_type_id":3,"county_id":46,"cellar":0,"building_surface":"45.0","terrain_surface":"0.0","parking_lot":0,"price":"1804.0"},{"id":2641007,"property_type_id":2,"address":"5933 General Oscar Bonilla","inscription_date":"2018-11-16","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"250.0"},{"id":2640930,"property_type_id":1,"address":"511 Los Pidenes","inscription_date":"2020-12-22","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"48.0","terrain_surface":"0.0","parking_lot":0,"price":"2000.0"},{"id":2640930,"property_type_id":1,"address":"511 Los Pidenes","inscription_date":"2020-12-22","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"48.0","terrain_surface":"0.0","parking_lot":0,"price":"2000.0"},{"id":2640899,"property_type_id":2,"address":"540 Teniente Cruz","inscription_date":"2020-12-21","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"47.0","terrain_surface":"0.0","parking_lot":0,"price":"679.0"},{"id":2640899,"property_type_id":2,"address":"540 Teniente Cruz","inscription_date":"2020-12-21","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"47.0","terrain_surface":"0.0","parking_lot":0,"price":"679.0"},{"id":2640739,"property_type_id":2,"address":"760 Cruchaga Montt","inscription_date":"2020-12-16","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"2000.0"},{"id":2640729,"property_type_id":9,"address":"7015 Pasaje El Sauce Sur","inscription_date":"2020-12-16","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"45.0","terrain_surface":"74.0","parking_lot":0,"price":"2090.0"},{"id":2640729,"property_type_id":9,"address":"7015 Pasaje El Sauce Sur","inscription_date":"2020-12-16","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"45.0","terrain_surface":"74.0","parking_lot":0,"price":"2090.0"},{"id":2640692,"property_type_id":2,"address":"864 Pedro Leon Ugalde","inscription_date":"2020-12-16","seller_type_id":2,"county_id":46,"cellar":0,"building_surface":"54.0","terrain_surface":"0.0","parking_lot":3,"price":"1374.0"},{"id":2640630,"property_type_id":1,"address":"7026 Las Amapolas","inscription_date":"2018-10-08","seller_type_id":2,"county_id":31,"cellar":0,"building_surface":"127.0","terrain_surface":"200.0","parking_lot":0,"price":"250.0"},{"id":2640521,"property_type_id":1,"address":"6585 Territorio Antartico","inscription_date":"2018-08-28","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"40.0","terrain_surface":"170.0","parking_lot":0,"price":"250.0"},{"id":2640519,"property_type_id":1,"address":"5895 Obispo Rodriguez","inscription_date":"2018-08-27","seller_type_id":7,"county_id":31,"cellar":0,"building_surface":"42.0","terrain_surface":"162.0","parking_lot":0,"price":"250.0"},{"id":2640500,"property_type_id":1,"address":"6172 Pasaje Rysel Berger","inscription_date":"2018-08-23","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"50.0","terrain_surface":"162.0","parking_lot":0,"price":"250.0"},{"id":2640477,"property_type_id":2,"address":"11 Santa Marta","inscription_date":"2018-08-22","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"43.0","terrain_surface":"0.0","parking_lot":0,"price":"250.0"},{"id":2640472,"property_type_id":9,"address":"751 La Scala","inscription_date":"2018-08-22","seller_type_id":7,"county_id":31,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"250.0"},{"id":2640448,"property_type_id":9,"address":"4321 Nueva Imperial","inscription_date":"2018-08-21","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"186.0","terrain_surface":"323.0","parking_lot":0,"price":"250.0"},{"id":2640448,"property_type_id":9,"address":"4321 Nueva Imperial","inscription_date":"2018-08-21","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"186.0","terrain_surface":"323.0","parking_lot":0,"price":"250.0"},{"id":2640414,"property_type_id":1,"address":"509 Los Mirlos","inscription_date":"2018-08-16","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"52.0","terrain_surface":"86.0","parking_lot":0,"price":"250.0"},{"id":2640414,"property_type_id":1,"address":"509 Los Mirlos","inscription_date":"2018-08-16","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"52.0","terrain_surface":"86.0","parking_lot":0,"price":"250.0"},{"id":2640277,"property_type_id":1,"address":"6022 Capitan Pedro De Cordova","inscription_date":"2018-05-10","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"66.0","terrain_surface":"162.0","parking_lot":0,"price":"347.0"},{"id":2640232,"property_type_id":9,"address":"6044 Las Canas","inscription_date":"2018-04-24","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"103.0","terrain_surface":"220.0","parking_lot":0,"price":"250.0"},{"id":2640216,"property_type_id":1,"address":"5983 Ministro Mora","inscription_date":"2018-04-20","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"12.0","terrain_surface":"162.0","parking_lot":0,"price":"250.0"},{"id":2640206,"property_type_id":1,"address":"320 Pairo","inscription_date":"2018-04-18","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"36.0","terrain_surface":"162.0","parking_lot":0,"price":"347.0"},{"id":2640192,"property_type_id":1,"address":"649 Salerno","inscription_date":"2018-04-02","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"45.0","terrain_surface":"400.0","parking_lot":0,"price":"250.0"},{"id":2640174,"property_type_id":1,"address":"6123 Santa Luisa","inscription_date":"2018-03-28","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"70.0","terrain_surface":"200.0","parking_lot":0,"price":"250.0"},{"id":2640167,"property_type_id":9,"address":"6514 Territorio Antartico","inscription_date":"2018-03-27","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"81.0","terrain_surface":"170.0","parking_lot":0,"price":"250.0"},{"id":2640139,"property_type_id":1,"address":"1021 Estados Unidos","inscription_date":"2018-03-23","seller_type_id":7,"county_id":31,"cellar":0,"building_surface":"36.0","terrain_surface":"162.0","parking_lot":0,"price":"36541.0"},{"id":2640118,"property_type_id":1,"address":"5983 Ministro Mora M Rodriguez","inscription_date":"2018-03-21","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"12.0","terrain_surface":"162.0","parking_lot":0,"price":"250.0"},{"id":2639972,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-21","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"42.0","terrain_surface":"0.0","parking_lot":1,"price":"1861.0"},{"id":2639957,"property_type_id":1,"address":"6470 Coronel Alfonso Ugarte","inscription_date":"2018-02-21","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"72.0","terrain_surface":"205.0","parking_lot":0,"price":"250.0"},{"id":2639956,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-21","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"44.0","terrain_surface":"0.0","parking_lot":0,"price":"1675.0"},{"id":2639939,"property_type_id":2,"address":"886 Pedro Leon Ugalde","inscription_date":"2018-02-21","seller_type_id":2,"county_id":46,"cellar":0,"building_surface":"42.0","terrain_surface":"0.0","parking_lot":0,"price":"1980.0"},{"id":2639917,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-21","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"28.0","terrain_surface":"0.0","parking_lot":0,"price":"1256.0"},{"id":2639916,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-21","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"20.0","terrain_surface":"0.0","parking_lot":0,"price":"1065.0"},{"id":2639915,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-21","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"20.0","terrain_surface":"0.0","parking_lot":0,"price":"1000.0"},{"id":2639914,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-21","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"28.0","terrain_surface":"0.0","parking_lot":0,"price":"1345.0"},{"id":2639860,"property_type_id":1,"address":"1094 Las Encinas","inscription_date":"2018-02-21","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"73.0","terrain_surface":"200.0","parking_lot":0,"price":"1650.0"},{"id":2639859,"property_type_id":2,"address":"897 Gaspar De Orense","inscription_date":"2018-02-21","seller_type_id":2,"county_id":46,"cellar":0,"building_surface":"31.0","terrain_surface":"0.0","parking_lot":0,"price":"1453.0"},{"id":2639857,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-21","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"42.0","terrain_surface":"0.0","parking_lot":0,"price":"1675.0"},{"id":2639847,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-21","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"28.0","terrain_surface":"0.0","parking_lot":0,"price":"1206.0"},{"id":2639791,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-20","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"43.0","terrain_surface":"0.0","parking_lot":1,"price":"1395.0"},{"id":2639784,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-20","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"28.0","terrain_surface":"0.0","parking_lot":0,"price":"1159.0"},{"id":2639783,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-20","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"29.0","terrain_surface":"0.0","parking_lot":0,"price":"1182.0"},{"id":2639770,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-20","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"28.0","terrain_surface":"0.0","parking_lot":0,"price":"1516.0"},{"id":2639769,"property_type_id":2,"address":"897 Gaspar De Orense","inscription_date":"2018-02-20","seller_type_id":2,"county_id":46,"cellar":0,"building_surface":"32.0","terrain_surface":"0.0","parking_lot":0,"price":"1415.0"},{"id":2639757,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-20","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"20.0","terrain_surface":"0.0","parking_lot":0,"price":"1138.0"},{"id":2639756,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-20","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"21.0","terrain_surface":"0.0","parking_lot":0,"price":"1105.0"},{"id":2639755,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-20","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"42.0","terrain_surface":"0.0","parking_lot":1,"price":"2067.0"},{"id":2639736,"property_type_id":9,"address":"7105 Los Alerces","inscription_date":"2018-02-20","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"88.0","terrain_surface":"160.0","parking_lot":0,"price":"742.0"},{"id":2639335,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-15","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"28.0","terrain_surface":"0.0","parking_lot":1,"price":"1900.0"},{"id":2639313,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-15","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"44.0","terrain_surface":"0.0","parking_lot":0,"price":"1617.0"},{"id":2639296,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-15","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"26.0","terrain_surface":"0.0","parking_lot":0,"price":"833.0"},{"id":2639244,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-14","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"27.0","terrain_surface":"0.0","parking_lot":0,"price":"1272.0"},{"id":2639199,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-14","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"29.0","terrain_surface":"0.0","parking_lot":1,"price":"1866.0"},{"id":2639183,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-14","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":"42.0","terrain_surface":"0.0","parking_lot":1,"price":"2293.0"},{"id":2639181,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2018-02-14","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"28.0","terrain_surface":"0.0","parking_lot":0,"price":"1298.0"},{"id":2639069,"property_type_id":9,"address":"4887 La Coruna","inscription_date":"2018-01-10","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"134.0","terrain_surface":"202.0","parking_lot":0,"price":"250.0"},{"id":2625290,"property_type_id":1,"address":"7053 Pasaje Piedra Callada","inscription_date":"2020-09-23","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"46.0","terrain_surface":"62.0","parking_lot":0,"price":"627.0"},{"id":2625290,"property_type_id":1,"address":"7053 Pasaje Piedra Callada","inscription_date":"2020-09-23","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"46.0","terrain_surface":"62.0","parking_lot":0,"price":"627.0"},{"id":2625169,"property_type_id":1,"address":"474 Pasaje Las Tortolas","inscription_date":"2020-10-13","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"52.0","terrain_surface":"118.0","parking_lot":0,"price":"484.0"},{"id":2625169,"property_type_id":1,"address":"474 Pasaje Las Tortolas","inscription_date":"2020-10-13","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"52.0","terrain_surface":"118.0","parking_lot":0,"price":"484.0"},{"id":2624916,"property_type_id":1,"address":"206 Reina Ana","inscription_date":"2020-10-07","seller_type_id":2,"county_id":9,"cellar":0,"building_surface":"56.0","terrain_surface":"127.0","parking_lot":0,"price":"2860.0"},{"id":2624916,"property_type_id":1,"address":"206 Reina Ana","inscription_date":"2020-10-07","seller_type_id":2,"county_id":9,"cellar":0,"building_surface":"56.0","terrain_surface":"127.0","parking_lot":0,"price":"2860.0"},{"id":2624477,"property_type_id":2,"address":"6988 La Travesia","inscription_date":"2020-10-01","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"49.0","terrain_surface":"0.0","parking_lot":0,"price":"1219.0"},{"id":2624477,"property_type_id":2,"address":"6988 La Travesia","inscription_date":"2020-10-01","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"49.0","terrain_surface":"0.0","parking_lot":0,"price":"1219.0"},{"id":2624317,"property_type_id":1,"address":"343 Pasaje Antonio Machado","inscription_date":"2020-09-29","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"68.0","terrain_surface":"139.0","parking_lot":0,"price":"1186.0"},{"id":2623944,"property_type_id":1,"address":"6968 Pasaje Los Duques","inscription_date":"2020-09-23","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"56.0","terrain_surface":"205.0","parking_lot":0,"price":"3135.0"},{"id":2623944,"property_type_id":1,"address":"6968 Pasaje Los Duques","inscription_date":"2020-09-23","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"56.0","terrain_surface":"205.0","parking_lot":0,"price":"3135.0"},{"id":2623855,"property_type_id":1,"address":"221 Pasaje Relque","inscription_date":"2020-09-22","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"53.0","terrain_surface":"125.0","parking_lot":0,"price":"2750.0"},{"id":2623855,"property_type_id":1,"address":"221 Pasaje Relque","inscription_date":"2020-09-22","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"53.0","terrain_surface":"125.0","parking_lot":0,"price":"2750.0"},{"id":2623687,"property_type_id":1,"address":"7291 Pasaje Lago Nanco Sur","inscription_date":"2020-09-17","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1622.0"},{"id":2623687,"property_type_id":1,"address":"7291 Pasaje Lago Nanco Sur","inscription_date":"2020-09-17","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1622.0"},{"id":2623485,"property_type_id":1,"address":"7147 Los Halcones","inscription_date":"2020-09-15","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"54.0","terrain_surface":"80.0","parking_lot":0,"price":"2335.0"},{"id":2623485,"property_type_id":1,"address":"7147 Los Halcones","inscription_date":"2020-09-15","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"54.0","terrain_surface":"80.0","parking_lot":0,"price":"2335.0"},{"id":2622728,"property_type_id":2,"address":"564 Teniente Cruz","inscription_date":"2020-09-02","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"47.0","terrain_surface":"0.0","parking_lot":0,"price":"1836.0"},{"id":2622728,"property_type_id":2,"address":"564 Teniente Cruz","inscription_date":"2020-09-02","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"47.0","terrain_surface":"0.0","parking_lot":0,"price":"1836.0"},{"id":2622698,"property_type_id":2,"address":"6984 La Travesia","inscription_date":"2020-09-02","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"49.0","terrain_surface":"0.0","parking_lot":0,"price":"697.0"},{"id":2622698,"property_type_id":2,"address":"6984 La Travesia","inscription_date":"2020-09-02","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"49.0","terrain_surface":"0.0","parking_lot":0,"price":"697.0"},{"id":2622441,"property_type_id":1,"address":"527 Los Canarios","inscription_date":"2020-08-28","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"52.0","terrain_surface":"94.0","parking_lot":0,"price":"802.0"},{"id":2622441,"property_type_id":1,"address":"527 Los Canarios","inscription_date":"2020-08-28","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"52.0","terrain_surface":"94.0","parking_lot":0,"price":"802.0"},{"id":2622267,"property_type_id":3,"address":"154 Blanco Garces","inscription_date":"2020-08-27","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":1,"price":"300.0"},{"id":2622266,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-08-27","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1542.0"},{"id":2622265,"property_type_id":4,"address":"154 Blanco Garces","inscription_date":"2020-08-27","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"60.0"},{"id":2622264,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-08-27","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1920.0"},{"id":2622065,"property_type_id":2,"address":"38 Santa Petronila","inscription_date":"2020-08-26","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"28.0","terrain_surface":"0.0","parking_lot":0,"price":"1780.0"},{"id":2622010,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2020-08-26","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"28.0","terrain_surface":"0.0","parking_lot":0,"price":"1700.0"},{"id":2621918,"property_type_id":2,"address":"154 Blanco Garces","inscription_date":"2020-08-25","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"1119.0"},{"id":2621895,"property_type_id":2,"address":"6251 Laguna Sur","inscription_date":"2020-08-25","seller_type_id":1,"county_id":26,"cellar":1,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":0,"price":"13640.0"},{"id":2621786,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2020-08-24","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"20.0","terrain_surface":"0.0","parking_lot":0,"price":"1340.0"},{"id":2621785,"property_type_id":2,"address":"32 Santa Petronila","inscription_date":"2020-08-24","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"20.0","terrain_surface":"0.0","parking_lot":0,"price":"1240.0"},{"id":2621709,"property_type_id":2,"address":"51 Maria Rozas Velasquez","inscription_date":"2020-08-24","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"50.0","terrain_surface":"0.0","parking_lot":1,"price":"3219.0"},{"id":2621693,"property_type_id":4,"address":"285 Las Torres","inscription_date":"2020-08-24","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"50.0"},{"id":2621692,"property_type_id":2,"address":"285 Las Torres","inscription_date":"2020-08-24","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"54.0","terrain_surface":"0.0","parking_lot":0,"price":"2850.0"},{"id":2621572,"property_type_id":1,"address":"530 Pasaje Los Manutaras","inscription_date":"2020-08-21","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"54.0","terrain_surface":"86.0","parking_lot":0,"price":"3488.0"},{"id":2621572,"property_type_id":1,"address":"530 Pasaje Los Manutaras","inscription_date":"2020-08-21","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"54.0","terrain_surface":"86.0","parking_lot":0,"price":"3488.0"},{"id":2621565,"property_type_id":1,"address":"204 Reina Ana","inscription_date":"2020-08-21","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"56.0","terrain_surface":"127.0","parking_lot":0,"price":"2787.0"},{"id":2621565,"property_type_id":1,"address":"204 Reina Ana","inscription_date":"2020-08-21","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"56.0","terrain_surface":"127.0","parking_lot":0,"price":"2787.0"},{"id":2620882,"property_type_id":2,"address":"540 Teniente Cruz","inscription_date":"2020-08-07","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"47.0","terrain_surface":"0.0","parking_lot":0,"price":"1745.0"},{"id":2620530,"property_type_id":1,"address":"89 Alsino Sur","inscription_date":"2020-07-27","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"46.0","terrain_surface":"131.0","parking_lot":0,"price":"942.0"},{"id":2620530,"property_type_id":1,"address":"89 Alsino Sur","inscription_date":"2020-07-27","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"46.0","terrain_surface":"131.0","parking_lot":0,"price":"942.0"},{"id":2620504,"property_type_id":1,"address":"399 Pasaje Pascamayo","inscription_date":"2020-07-24","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"86.0","terrain_surface":"170.0","parking_lot":0,"price":"250.0"},{"id":2620168,"property_type_id":1,"address":"482 Pasaje Las Codornices","inscription_date":"2020-07-07","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"2604.0"},{"id":2620168,"property_type_id":1,"address":"482 Pasaje Las Codornices","inscription_date":"2020-07-07","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"2604.0"},{"id":2620120,"property_type_id":2,"address":"540 Teniente Cruz","inscription_date":"2020-07-03","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"47.0","terrain_surface":"0.0","parking_lot":0,"price":"1885.0"},{"id":2620056,"property_type_id":2,"address":"540 Teniente Cruz","inscription_date":"2020-06-30","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"47.0","terrain_surface":"0.0","parking_lot":0,"price":"1045.0"},{"id":2620023,"property_type_id":9,"address":"14155 Isla Decepcion","inscription_date":"2020-06-26","seller_type_id":3,"county_id":31,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"101522.0"},{"id":2620016,"property_type_id":1,"address":"151 Alsino Sur","inscription_date":"2020-06-26","seller_type_id":2,"county_id":9,"cellar":0,"building_surface":"46.0","terrain_surface":"135.0","parking_lot":0,"price":"2482.0"},{"id":2620016,"property_type_id":1,"address":"151 Alsino Sur","inscription_date":"2020-06-26","seller_type_id":2,"county_id":9,"cellar":0,"building_surface":"46.0","terrain_surface":"135.0","parking_lot":0,"price":"2482.0"},{"id":2620005,"property_type_id":2,"address":"7343 Mar Del Sur","inscription_date":"2020-06-25","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"48.0","terrain_surface":"0.0","parking_lot":0,"price":"697.0"},{"id":2620005,"property_type_id":2,"address":"7343 Mar Del Sur","inscription_date":"2020-06-25","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"48.0","terrain_surface":"0.0","parking_lot":0,"price":"697.0"},{"id":2619976,"property_type_id":1,"address":"482 Los Condores","inscription_date":"2020-06-24","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"105.0","terrain_surface":"118.0","parking_lot":0,"price":"348.0"},{"id":2619976,"property_type_id":1,"address":"482 Los Condores","inscription_date":"2020-06-24","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"105.0","terrain_surface":"118.0","parking_lot":0,"price":"348.0"},{"id":2619974,"property_type_id":2,"address":"175 Pasaje Charwa","inscription_date":"2020-06-24","seller_type_id":2,"county_id":9,"cellar":0,"building_surface":"67.0","terrain_surface":"0.0","parking_lot":0,"price":"1468.0"},{"id":2619974,"property_type_id":2,"address":"175 Pasaje Charwa","inscription_date":"2020-06-24","seller_type_id":2,"county_id":9,"cellar":0,"building_surface":"67.0","terrain_surface":"0.0","parking_lot":0,"price":"1468.0"},{"id":2619966,"property_type_id":1,"address":"494 Los Cisnes","inscription_date":"2020-06-24","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"52.0","terrain_surface":"81.0","parking_lot":0,"price":"1742.0"},{"id":2619966,"property_type_id":1,"address":"494 Los Cisnes","inscription_date":"2020-06-24","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"52.0","terrain_surface":"81.0","parking_lot":0,"price":"1742.0"},{"id":2619898,"property_type_id":2,"address":"327 Los Ruisenores","inscription_date":"2020-06-22","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"49.0","terrain_surface":"0.0","parking_lot":0,"price":"1579.0"},{"id":2619898,"property_type_id":2,"address":"327 Los Ruisenores","inscription_date":"2020-06-22","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"49.0","terrain_surface":"0.0","parking_lot":0,"price":"1579.0"},{"id":2619764,"property_type_id":2,"address":"7377 Pasaje Ailla","inscription_date":"2020-06-16","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"67.0","terrain_surface":"0.0","parking_lot":0,"price":"2246.0"},{"id":2619764,"property_type_id":2,"address":"7377 Pasaje Ailla","inscription_date":"2020-06-16","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"67.0","terrain_surface":"0.0","parking_lot":0,"price":"2246.0"},{"id":2619449,"property_type_id":2,"address":"6988 La Travesia","inscription_date":"2020-03-17","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"49.0","terrain_surface":"0.0","parking_lot":0,"price":"1226.0"},{"id":2619449,"property_type_id":2,"address":"6988 La Travesia","inscription_date":"2020-03-17","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"49.0","terrain_surface":"0.0","parking_lot":0,"price":"1226.0"},{"id":2619256,"property_type_id":1,"address":"220 Pasaje Flor De Quillen","inscription_date":"2020-01-14","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"48.0","terrain_surface":"132.0","parking_lot":0,"price":"989.0"},{"id":2619256,"property_type_id":1,"address":"220 Pasaje Flor De Quillen","inscription_date":"2020-01-14","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"48.0","terrain_surface":"132.0","parking_lot":0,"price":"989.0"},{"id":2619139,"property_type_id":1,"address":"5169 Catedral","inscription_date":"2019-06-07","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"150.0","terrain_surface":"400.0","parking_lot":0,"price":"250.0"},{"id":2618740,"property_type_id":9,"address":"Laguna Sur Con Puerto Arturo","inscription_date":"2019-12-09","seller_type_id":7,"county_id":9,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"250.0"},{"id":2618602,"property_type_id":2,"address":"6065 Camino De Loyola","inscription_date":"2019-11-25","seller_type_id":7,"county_id":46,"cellar":0,"building_surface":"55.0","terrain_surface":"0.0","parking_lot":0,"price":"250.0"},{"id":2618601,"property_type_id":1,"address":"6065 Camino De Loyola","inscription_date":"2019-11-25","seller_type_id":7,"county_id":46,"cellar":0,"building_surface":"55.0","terrain_surface":"0.0","parking_lot":0,"price":"250.0"},{"id":2618189,"property_type_id":2,"address":"864 Pedro Leon Ugalde","inscription_date":"2019-09-17","seller_type_id":3,"county_id":46,"cellar":0,"building_surface":"53.0","terrain_surface":"0.0","parking_lot":0,"price":"2399.0"},{"id":2618122,"property_type_id":2,"address":"864 Pedro Leon Ugalde","inscription_date":"2019-09-16","seller_type_id":3,"county_id":46,"cellar":0,"building_surface":"53.0","terrain_surface":"0.0","parking_lot":0,"price":"2384.0"},{"id":2618120,"property_type_id":2,"address":"864 Pedro Leon Ugalde","inscription_date":"2019-09-16","seller_type_id":3,"county_id":46,"cellar":0,"building_surface":"54.0","terrain_surface":"0.0","parking_lot":0,"price":"1954.0"},{"id":2618079,"property_type_id":2,"address":"564 Diagonal Teniente Cruz","inscription_date":"2019-09-16","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"47.0","terrain_surface":"0.0","parking_lot":0,"price":"2199.0"},{"id":2618079,"property_type_id":2,"address":"564 Diagonal Teniente Cruz","inscription_date":"2019-09-16","seller_type_id":1,"county_id":9,"cellar":0,"building_surface":"47.0","terrain_surface":"0.0","parking_lot":0,"price":"2199.0"},{"id":2617748,"property_type_id":9,"address":"211 Gaspar De Orense","inscription_date":"2019-06-26","seller_type_id":1,"county_id":26,"cellar":0,"building_surface":"70.0","terrain_surface":"231.0","parking_lot":0,"price":"250.0"},{"id":2617747,"property_type_id":9,"address":"431 Constantino","inscription_date":"2019-06-26","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"72.0","terrain_surface":"185.0","parking_lot":0,"price":"250.0"},{"id":2617747,"property_type_id":9,"address":"431 Constantino","inscription_date":"2019-06-26","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"72.0","terrain_surface":"185.0","parking_lot":0,"price":"250.0"},{"id":2617586,"property_type_id":2,"address":"864 Pedro Leon Ugalde","inscription_date":"2019-03-14","seller_type_id":2,"county_id":46,"cellar":0,"building_surface":"0.0","terrain_surface":"0.0","parking_lot":1,"price":"2723.0"},{"id":2617550,"property_type_id":1,"address":"6095 Joinville","inscription_date":"2019-03-11","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"18.0","terrain_surface":"162.0","parking_lot":0,"price":"363.0"},{"id":2617525,"property_type_id":2,"address":"6028 Ingeniero Giroz","inscription_date":"2019-03-07","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"44.0","terrain_surface":"0.0","parking_lot":0,"price":"250.0"},{"id":2617483,"property_type_id":2,"address":"5988 Territorio Antartico","inscription_date":"2019-03-04","seller_type_id":1,"county_id":31,"cellar":0,"building_surface":"44.0","terrain_surface":"0.0","parking_lot":0,"price":"250.0"},{"id":2617462,"property_type_id":1,"address":"609 Cruchaga Montt","inscription_date":"2019-02-27","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"460.0","terrain_surface":"424.0","parking_lot":0,"price":"1225.0"},{"id":2617462,"property_type_id":1,"address":"609 Cruchaga Montt","inscription_date":"2019-02-27","seller_type_id":1,"county_id":46,"cellar":0,"building_surface":"460.0","terrain_surface":"424.0","parking_lot":0,"price":"1225.0"},{"id":2617105,"property_type_id":4,"address":"285 Las Torres","inscription_date":"2020-08-03","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"50.0"},{"id":2617104,"property_type_id":2,"address":"285 Las Torres","inscription_date":"2020-08-03","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"56.0","terrain_surface":"0.0","parking_lot":0,"price":"2845.0"},{"id":2617103,"property_type_id":4,"address":"285 Las Torres","inscription_date":"2020-08-03","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"50.0"},{"id":2617102,"property_type_id":2,"address":"285 Las Torres","inscription_date":"2020-08-03","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"51.0","terrain_surface":"0.0","parking_lot":0,"price":"2454.0"},{"id":2617095,"property_type_id":4,"address":"285 Las Torres","inscription_date":"2020-07-27","seller_type_id":2,"county_id":26,"cellar":1,"building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"50.0"},{"id":2617094,"property_type_id":3,"address":"285 Las Torres","inscription_date":"2020-07-27","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":null,"terrain_surface":null,"parking_lot":1,"price":"250.0"},{"id":2617093,"property_type_id":2,"address":"285 Las Torres","inscription_date":"2020-07-27","seller_type_id":2,"county_id":26,"cellar":0,"building_surface":"56.0","terrain_surface":"0.0","parking_lot":0,"price":"2250.0"}]');

        },
        error: function (jqxhr, textstatus, errorthrown) {
            console.log("algo malo paso");
        }
    })
    update_table();
}

function update_filters() {
    $('tr.genTable').remove();
    $(".chartjs-render-monitor").removeAttr('class').removeAttr('style').removeAttr('width').removeAttr('height');

    $(parsed_data['property_types']).each(function () {
        $("#prop_type").append($('<option>').val($(this)[1]).text($(this)[0]));
    });
    $(parsed_data['seller_types']).each(function () {
        $("#seller_type").append($('<option>').val($(this)[1]).text($(this)[0]));
    });
    for (i = 0; i < $(parsed_data['land_use']).length; i++) {
        $("#land_use").append($('<option>').val($(parsed_data['land_use'])[i]).text($(parsed_data['land_use'])[i]));
    }
    $(parsed_data['inscription_dates']).each(function () {
        var lang = "es-ES";
        var yearBegin = parseInt($(parsed_data['inscription_dates'])[0]['from'].split("-")[0]);
        var yearTo = parseInt($(parsed_data['inscription_dates'])[0]['to'].split("-")[0]);

        //var year = 2018;

        function dateToTS(date) {
            return date.valueOf();
        }

        function tsToDate(ts) {
            var d = new Date(ts);

            return d.toLocaleDateString(lang, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        $("#insc_date").ionRangeSlider({
            skin: "flat",
            type: "double",
            grid: true,
            min: dateToTS(new Date($(this)[0]['from'])),
            max: dateToTS(new Date($(this)[0]['to'])),
            from: dateToTS(new Date($(this)[0]['from'])),
            to: dateToTS(new Date($(this)[0]['to'])),
            prettify: tsToDate,
            onFinish: function (data) {
                dataInsc_date = {"from: ": (data.from_pretty), "to: ": (data.to_pretty)}
            }
        });
    });
    $(parsed_data['max_height']).each(function () {
        var from = parseFloat($(this)[0]['from']);
        var to = parseFloat($(this)[0]['to']);
        $("#max_height").ionRangeSlider({
            type: "double",
            min: from,
            max: to,
            from: from,
            to: to,
            drag_interval: true,
            min_interval: null,
            max_interval: null,
            onFinish: function (data) {
                dataMaxHeight = {"from: ": (data.from), "to: ": (data.to)}
            }
        });
    });
    $(parsed_data['prices']).each(function () {
        var from = parseFloat($(this)[0]['from']);
        var to = parseFloat($(this)[0]['to']);
        $("#price").ionRangeSlider({
            type: "double",
            min: from,
            max: to,
            from: from,
            to: to,
            drag_interval: true,
            min_interval: null,
            max_interval: null,
            onFinish: function (data) {
                dataPrices = {"from: ": (data.from), "to: ": (data.to)}
            }
        });
    });
    $(parsed_data['unit_prices']).each(function () {
        var from = parseFloat($(this)[0]['from']);
        var to = parseFloat($(this)[0]['to']);
        $("#u_price").ionRangeSlider({
            type: "double",
            min: from,
            max: to,
            from: from,
            to: to,
            drag_interval: true,
            min_interval: null,
            max_interval: null,
            onFinish: function (data) {
                dataUnit_prices = {"from: ": (data.from), "to: ": (data.to)}
            }
        });
    });
    $(parsed_data['terrain_surfaces']).each(function () {
        var from = parseFloat($(this)[0]['from']);
        var to = parseFloat($(this)[0]['to']);
        $("#t_surface").ionRangeSlider({
            type: "double",
            min: from,
            max: to,
            from: from,
            to: to,
            drag_interval: true,
            min_interval: null,
            max_interval: null,
            onFinish: function (data) {
                dataTerrain_surfaces = {"from: ": (data.from), "to: ": (data.to)}
            }
        });
    });
    $(parsed_data['building_surfaces']).each(function () {
        var from = parseFloat($(this)[0]['from']);
        var to = parseFloat($(this)[0]['to']);
        $("#building_surfaces").ionRangeSlider({
            type: "double",
            min: from,
            max: to,
            from: from,
            to: to,
            drag_interval: true,
            min_interval: null,
            max_interval: null,
            onFinish: function (data) {
                dataBuilding_surfaces = {"from: ": (data.from), "to: ": (data.to)}
            }
        });
    });
    $(parsed_data['density']).each(function () {
        var from = parseFloat($(this)[0]['from']);
        var to = parseFloat($(this)[0]['to']);
        $("#density").ionRangeSlider({
            type: "double",
            min: from,
            max: to,
            from: from,
            to: to,
            drag_interval: true,
            min_interval: null,
            max_interval: null,
            onFinish: function (data) {
                dataDensity = {"from: ": (data.from), "to: ": (data.to)}
            }
        });
    });
    $(document).ready(function () {
        $('#prop_type').multiselect({
            includeSelectAllOption: true
        });
        $('#seller_type').multiselect({
            includeSelectAllOption: true
        });
        $('#land_use').multiselect({
            includeSelectAllOption: true
        });
    });
    $("#intro").remove();
    $("#select-box").removeClass("d-none");
    $("#map_flex").css('height', '100%');
}

////////////////////////////////////////////////////////

Congo.flex_dashboards.action_index = function () {
    let map_admin, marker, flexMap;

    let init = function () {
        let flexMap = create_map();
        let fgr = L.featureGroup().addTo(flexMap);

        add_control(flexMap, fgr);

        flexMap.on('draw:created', function (e) {
            let data = draw_geometry(e, fgr);

            Congo.flex_dashboards.config.geo_selection = data
            if ('error' in data) {
                $('#alerts').append(data['error']);

                setTimeout(() => {
                    $('#alerts').empty();
                }, 5000)
            } else {
                geoserver_data(data, flexMap, fgr);

                console.log('Parámetros filtros');
                console.log(data);

                $.ajax({
                    async: false,
                    type: 'get',
                    url: 'flex/dashboards/search_data_for_filters.json',
                    datatype: 'json',
                    data: data,
                    success: function (data) {

                        console.log('Datos filtros');
                        console.log(data);

                        // parsed_data = data;

                        // Ejemplo
                        parsed_data = JSON.parse('{\"property_types\":[[\"Casas\",1],[\"Departamentos\",2],[\"Oficinas\",3],[\"Local Comercial\",4],[\"Oficina y Local Comercial\",5]],\"inscription_dates\":{\"from\":\"2018-02-15\",\"to\":\"2020-12-30\"},\"seller_types\":[[\"PROPIETARIO\",1],[\"INMOBILIARIA\",2],[\"EMPRESA\",3],[\"BANCO\",4]],\"land_use\":[\"EA12\",\"EA12 pa\",\"EA7\",\"PzVec\",\"ZEP AE\",\"EC2+A8\",\"ZIM\"],\"max_height\":{\"from\":0,\"to\":99},\"density\":{\"from\":0,\"to\":1100},\"building_surfaces\":{\"from\":0,\"to\":520},\"terrain_surfaces\":{\"from\":0,\"to\":2147},\"prices\":{\"from\":64,\"to\":42900},\"unit_prices\":{\"from\":0,\"to\":2247}}');

                    },
                    error: function (jqxhr, textstatus, errorthrown) {
                        console.log("algo malo paso");
                    }
                });

            update_filters();
            }
        });
    }
    return {
        init: init,
    }
}();
