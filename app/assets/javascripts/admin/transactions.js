Congo.namespace('admin_transactions.action_index');
Congo.namespace('admin_transactions.action_new');
Congo.namespace('admin_transactions.action_edit');
Congo.namespace('admin_transactions.action_update');
Congo.namespace('admin_transactions.action_export_data_sii');

Congo.admin_transactions.config = {
'latitude': [],
'longitude': []

}

Congo.admin_transactions.action_export_data_sii = function(){

  init = function(){
    $('.search_county_id').attr('hidden', true)
    $('.search_polygon_id').attr('hidden', true)

    $('#search_kpi_type').on('change', function(){
      var type = $(this).val();
      $('.search_county_id').attr('hidden', true)
      $('.search_polygon_id').attr('hidden', true)

      if (type == '1'){
        $('.search_polygon_id').removeAttr('hidden')
      }
      if (type =='2'){
        $('.search_county_id').removeAttr('hidden')
      }
    })
  }
  return {
    init: init,
  }
}();

Congo.admin_transactions.action_index = function(){

  init = function(){
  }
  return {
    init: init,
  }
}();

Congo.admin_transactions.action_new = function(){
  init = function(){
    Congo.admin_transactions.action_edit.init();
    $('#search_address').on('click', function(){
    county= $("#transaction_county_id").children("option:selected").text();
    address = $('#transaction_address').val();
    complete_address = address + " " + county +" Chile";
    Congo.admin_map_utils.geocoding(complete_address);

    })
  }
  return {
    init: init,
  }
}();

Congo.admin_transactions.action_edit = function(){
  init = function(){

    $('#calculate_uf').on('click', function(){
      var idate = $('#transaction_inscription_date').val();
        data = {
          date: idate,
          real_value: $('#transaction_real_value').val()
        };
      $.ajax({
        url: '/es/admin/uf_conversions/calculate_uf.json',
        type: 'GET',
        data: data,
        dataType: 'json',
        success: function(data){
          $('#transaction_calculated_value').val(data.data);
          $('#transaction_calculated_value').focus();
        }
      });
    });

    $("#transaction_county_id").on('change', function(){
      var id= $(this).val();
      $.ajax({
        url: '/es/admin/counties/search.json',
        type: 'GET',
        data: {id: id},
        dataType: 'json',
        success: function(data) {
          $("#transaction_code_sii").val(data.code_sii);
        },
      });
    });

    Congo.admin_map_utils.init();
    latitude= Congo.admin_transactions.config.latitude[0];
    longitude= Congo.admin_transactions.config.longitude[0];
    Congo.admin_map_utils.addMarker(latitude, longitude, 'transaction');
  }
  return {
    init: init,
  }
}();

Congo.admin_transactions.action_update = function(){
  init = function(){
    Congo.admin_transactions.action_edit.init();
  }
  return {
    init: init,
  }
}();
