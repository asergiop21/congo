Congo.namespace('transactions.action_dashboards');

Congo.transactions.config= {
  county_name: '',
  county_id: '',
  layer_type: 'transactions_info'
}

Congo.transactions.action_dashboards = function(){

  init=function(){

    Congo.map_utils.init();

  }

  indicator_transactions = function(){

    $.ajax({
      type: 'GET',
      url: '/transactions/transactions_summary.json',
      datatype: 'json',
      data: {to_year:"2018", locale:"es", periods_quantity: "5", to_period: "6", county_id:"52" },
      success: function(data){

        // Creamos y adjuntamos el overlay
        var overlay = document.createElement('div');
        overlay.className = 'overlay';
        $('#map').append(overlay);

        // Separamos la información
        for (var i = 0; i < data.length; i++) {

          var reg = data[i];
          var title = reg['title'];
          var series = reg['series'];

          // Creamos el div contenedor
          var chart_container = document.createElement('div');
          chart_container.className = 'chart-container'+i+' card';

          // Creamos el card-header
          var card_header = document.createElement('div');
          card_header.className = 'card-header';
          card_header.id = 'header'+i;

          // Creamos el card-body
          var card_body = document.createElement('div');
          card_body.className = 'card-body';
          card_body.id = 'body'+i;

          // TODO: Crear título y boton cerrar dinámicos

          // Creamos título y boton cerrar
          var card_header_button = '<button type="button btn-sm" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
          var card_header_title = '<b>'+title+'</b>'

          // Adjuntamos los elementos
          $('.overlay').append(chart_container);
          $('.chart-container'+i).append(card_header, card_body);
          $('#header'+i).append(card_header_button, card_header_title);

          // Información General
          if (title == "Información General") {

            var info = reg['data'];

            // Extraemos y adjuntamos los datos al card-body
            $.each(info, function(y, z){
              name = z['name'];
              label = z['count']
              item = name+': '+label+'<br>';
              $('#body'+i).append(item);
            })

          // Gráficos
          } else {

            var datasets = [];

            // Extraemos las series
            $.each(series, function(a, b){

              var label = b['label']
              var data = b['data']

              var name = [];
              var count = [];

              // Extraemos los datos de las series
              $.each(data, function(c, d){
                name.push(d['name'])
                count.push(d['count'])
              })

              // Guardamos "datasets" y "chart_type"
              if (title == 'Tipo de Propiedad') {
                chart_type = 'pie';
                cantidad = count.length;
                rancolor = randomColor({
                  count: cantidad,
                  hue: 'monochrome',
                  format: 'rgb',
                  seed: 1,
                })
                datasets.push({
                  label: label,
                  data: count,
                  backgroundColor: rancolor,
                })
              }

              if (title == 'Tipo de Vendedor') {
                chart_type = 'pie';
                cantidad = count.length;
                rancolor = randomColor({
                  count: cantidad,
                  hue: 'monochrome',
                  format: 'rgb',
                  seed: 1,
                })
                datasets.push({
                  label: label,
                  data: count,
                  backgroundColor: rancolor,
                })
              }

              // TODO: Falta agregar el chart de Transacciones / Bimestre (line)

              if (title == 'UF / Bimestre') {
                chart_type = 'line';
                datasets.push({
                  label: label,
                  data: count,
                  borderColor: '#f08939',
                  lineTension: 0,
                  pointRadius: 0,
                  borderWidth: 3,
                  fill: false,
                })
              }

              if (title == 'Precio Promedio en UF / Bimestre') {
                chart_type = 'line';
                datasets.push({
                  label: label,
                  data: count,
                  borderColor: '#f08939',
                  lineTension: 0,
                  pointRadius: 0,
                  borderWidth: 3,
                  fill: false,
                })
              }

              if (title == 'Transacciones / UF') {
                chart_type = 'bar';
                datasets.push({
                  label: label,
                  data: count,
                  backgroundColor: '#dddb58'
                })
              }

              chart_data = {
                labels: name,
                datasets: datasets
              }

            })

            // Guardamos "options"
            if (title == 'Transacciones / UF' || title == 'Precio Promedio en UF / Bimestre') {
              var chart_options = {
                responsive: true,
                title: {
                  display: false,
                },
                legend: {
                  display: false,
                },
                plugins: {
                  datalabels: {
                    display: false,
                  },
                },
                scales: {
                  xAxes: [{
                    ticks: {
                      autoSkip: false,
                    },
                  }],
                  yAxes: [{
                    ticks: {
                      beginAtZero: true,
                    },
                  }]
                }
              }
            } else {
              var chart_options = {
                responsive: true,
                title: {
                  display: false,
                },
                legend: {
                  display: false,
                },
                plugins: {
                  datalabels: {
                    display: false,
                  }
                }
              }
            }

            var chart_settings = {
              type: chart_type,
              data: chart_data,
              options: chart_options
            }

            // Creamos y adjuntamos el canvas
            var canvas = document.createElement('canvas');
            canvas.id = 'canvas'+i;
            $('#body'+i).append(canvas);

            var chart_canvas = document.getElementById('canvas'+i).getContext('2d');
            var final_chart = new Chart(chart_canvas, chart_settings);

          } // Cierra if
        } // Cierra for
      } // Cierra success
    }) // Cierra ajax
  } // Cierra indicator_transactions

  return {
    init: init,
    indicator_transactions: indicator_transactions
  }
}();
