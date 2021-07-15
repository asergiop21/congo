function getFilteredData() {

    propertyTypes = $("#prop_type").val();
    sellerTypes = $("#seller_type").val();
    land_useType = $("#land_use").val();

    geom = Congo.flex_flex_reports.config.geo_selection

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
        url: 'search_data_for_table.json',
        datatype: 'json',
        data: data,
        success: function (data) {

            console.log('Datos tabla');
            console.log(data);

            table_data = data

            // Ejemplo:
            // table_data = JSON.parse('[{"id":2558054,"address":"1509 Conferencia","inscription_date":"2019-12-10","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"107.0","terrain_surface":"110.0","parking_lot":0,"price":"1273.0"},{"id":2558054,"address":"1509 Conferencia","inscription_date":"2019-12-10","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"107.0","terrain_surface":"110.0","parking_lot":0,"price":"1273.0"},{"id":3930229,"address":"1587 Oriente","inscription_date":"2020-12-17","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"70.0","terrain_surface":"71.0","parking_lot":0,"price":"1060.0"},{"id":3930229,"address":"1587 Oriente","inscription_date":"2020-12-17","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"70.0","terrain_surface":"71.0","parking_lot":0,"price":"1060.0"},{"id":2554314,"address":"2990 Antofagasta","inscription_date":"2019-10-16","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"EMPRESA","building_surface":"116.0","terrain_surface":"0.0","parking_lot":0,"price":"1355.0"},{"id":2554314,"address":"2990 Antofagasta","inscription_date":"2019-10-16","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"EMPRESA","building_surface":"116.0","terrain_surface":"0.0","parking_lot":0,"price":"1355.0"},{"id":2193095,"address":"1534 Conferencia","inscription_date":"2018-08-09","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"104.0","terrain_surface":"104.0","parking_lot":0,"price":"1397.0"},{"id":2193095,"address":"1534 Conferencia","inscription_date":"2018-08-09","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"104.0","terrain_surface":"104.0","parking_lot":0,"price":"1397.0"},{"id":2202023,"address":"1598 Oriente","inscription_date":"2019-03-18","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"97.0","terrain_surface":"71.0","parking_lot":0,"price":"1814.0"},{"id":2438121,"address":"2910 Antofagasta","inscription_date":"2019-07-08","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"EMPRESA","building_surface":"61.0","terrain_surface":"0.0","parking_lot":0,"price":"1220.0"},{"id":2438121,"address":"2910 Antofagasta","inscription_date":"2019-07-08","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"EMPRESA","building_surface":"61.0","terrain_surface":"0.0","parking_lot":0,"price":"1220.0"},{"id":2202023,"address":"1598 Oriente","inscription_date":"2019-03-18","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"97.0","terrain_surface":"71.0","parking_lot":0,"price":"1814.0"},{"id":2441205,"address":"1507 Los Canelos","inscription_date":"2019-08-13","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"193.0","terrain_surface":"383.0","parking_lot":0,"price":"3576.0"},{"id":2007156,"address":"2912 Antofagasta","inscription_date":"2018-06-28","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"64.0","terrain_surface":"0.0","parking_lot":0,"price":"1399.0"},{"id":2007156,"address":"2912 Antofagasta","inscription_date":"2018-06-28","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"64.0","terrain_surface":"0.0","parking_lot":0,"price":"1399.0"},{"id":2441205,"address":"1507 Los Canelos","inscription_date":"2019-08-13","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"193.0","terrain_surface":"383.0","parking_lot":0,"price":"3576.0"},{"id":2008283,"address":"2990 Antofagasta","inscription_date":"2018-07-12","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"111.0","terrain_surface":"0.0","parking_lot":0,"price":"2759.0"},{"id":2045819,"address":"3035 Manuel De Amat","inscription_date":"2018-11-23","cellar":0,"property_typee":"SITIO","c_name":"Santiago","seller":"EMPRESA","building_surface":"416.0","terrain_surface":"437.0","parking_lot":0,"price":"5323.0"},{"id":2045819,"address":"3035 Manuel De Amat","inscription_date":"2018-11-23","cellar":0,"property_typee":"SITIO","c_name":"Santiago","seller":"EMPRESA","building_surface":"416.0","terrain_surface":"437.0","parking_lot":0,"price":"5323.0"},{"id":2008283,"address":"2990 Antofagasta","inscription_date":"2018-07-12","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"111.0","terrain_surface":"0.0","parking_lot":0,"price":"2759.0"},{"id":23750,"address":"898 Nueva San Martin","inscription_date":"2020-04-16","cellar":1,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"INMOBILIARIA","building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"2372.0"},{"id":17555,"address":"898 Nueva San Martin","inscription_date":"2020-03-04","cellar":1,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"INMOBILIARIA","building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"2694.0"},{"id":5075,"address":"3056 Manuel De Amat","inscription_date":"2020-02-10","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"62.0","terrain_surface":"0.0","parking_lot":0,"price":"2446.0"},{"id":23750,"address":"898 Nueva San Martin","inscription_date":"2020-04-16","cellar":1,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"INMOBILIARIA","building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"2372.0"},{"id":17555,"address":"898 Nueva San Martin","inscription_date":"2020-03-04","cellar":1,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"INMOBILIARIA","building_surface":null,"terrain_surface":null,"parking_lot":0,"price":"2694.0"},{"id":23776,"address":"2990 Antofagasta","inscription_date":"2020-05-05","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"112.0","terrain_surface":"0.0","parking_lot":0,"price":"3105.0"},{"id":2260195,"address":"2910 Antofagasta","inscription_date":"2019-04-29","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"61.0","terrain_surface":"0.0","parking_lot":0,"price":"1220.0"},{"id":23776,"address":"2990 Antofagasta","inscription_date":"2020-05-05","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"112.0","terrain_surface":"0.0","parking_lot":0,"price":"3105.0"},{"id":2260195,"address":"2910 Antofagasta","inscription_date":"2019-04-29","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"61.0","terrain_surface":"0.0","parking_lot":0,"price":"1220.0"},{"id":2093017,"address":"1663 Conferencia","inscription_date":"2018-11-06","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"133.0","terrain_surface":"270.0","parking_lot":0,"price":"1656.0"},{"id":5075,"address":"3056 Manuel De Amat","inscription_date":"2020-02-10","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"62.0","terrain_surface":"0.0","parking_lot":0,"price":"2446.0"},{"id":2107991,"address":"1592 Longavi","inscription_date":"2019-01-21","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"70.0","terrain_surface":"71.0","parking_lot":0,"price":"508.0"},{"id":2289332,"address":"3020 Manuel De Amat","inscription_date":"2019-07-23","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"108.0","terrain_surface":"420.0","parking_lot":0,"price":"5187.0"},{"id":2289332,"address":"3020 Manuel De Amat","inscription_date":"2019-07-23","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"108.0","terrain_surface":"420.0","parking_lot":0,"price":"5187.0"},{"id":2107991,"address":"1592 Longavi","inscription_date":"2019-01-21","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"70.0","terrain_surface":"71.0","parking_lot":0,"price":"508.0"},{"id":2128478,"address":"1545 Longavi","inscription_date":"2018-11-21","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"70.0","terrain_surface":"70.0","parking_lot":0,"price":"1028.0"},{"id":2093017,"address":"1663 Conferencia","inscription_date":"2018-11-06","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"133.0","terrain_surface":"270.0","parking_lot":0,"price":"1656.0"},{"id":2124649,"address":"1533 Longavi","inscription_date":"2018-08-08","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"70.0","terrain_surface":"70.0","parking_lot":0,"price":"368.0"},{"id":1972058,"address":"2990 Antofagasta","inscription_date":"2018-08-06","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"BANCO","building_surface":"116.0","terrain_surface":"0.0","parking_lot":0,"price":"250.0"},{"id":2124649,"address":"1533 Longavi","inscription_date":"2018-08-08","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"70.0","terrain_surface":"70.0","parking_lot":0,"price":"368.0"},{"id":2553827,"address":"1482 Oriente","inscription_date":"2019-08-01","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"BANCO","building_surface":"58.0","terrain_surface":"0.0","parking_lot":0,"price":"668.0"},{"id":2553827,"address":"1482 Oriente","inscription_date":"2019-08-01","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"BANCO","building_surface":"58.0","terrain_surface":"0.0","parking_lot":0,"price":"668.0"},{"id":2632299,"address":"1577 Los Canelos","inscription_date":"2020-10-28","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"INMOBILIARIA","building_surface":"73.0","terrain_surface":"0.0","parking_lot":0,"price":"600.0"},{"id":2128478,"address":"1545 Longavi","inscription_date":"2018-11-21","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"70.0","terrain_surface":"70.0","parking_lot":0,"price":"1028.0"},{"id":2558042,"address":"2956 Antofagasta","inscription_date":"2019-12-10","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"111.0","terrain_surface":"0.0","parking_lot":0,"price":"1237.0"},{"id":2558042,"address":"2956 Antofagasta","inscription_date":"2019-12-10","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"111.0","terrain_surface":"0.0","parking_lot":0,"price":"1237.0"},{"id":1972058,"address":"2990 Antofagasta","inscription_date":"2018-08-06","cellar":0,"property_typee":"DEPARTAMENTO","c_name":"Santiago","seller":"BANCO","building_surface":"116.0","terrain_surface":"0.0","parking_lot":0,"price":"250.0"},{"id":2632299,"address":"1577 Los Canelos","inscription_date":"2020-10-28","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"INMOBILIARIA","building_surface":"73.0","terrain_surface":"0.0","parking_lot":0,"price":"600.0"},{"id":2594664,"address":"3030 Manuel De Amat","inscription_date":"2020-03-13","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"142.0","terrain_surface":"300.0","parking_lot":0,"price":"250.0"},{"id":2594664,"address":"3030 Manuel De Amat","inscription_date":"2020-03-13","cellar":0,"property_typee":"CASA","c_name":"Santiago","seller":"PROPIETARIO","building_surface":"142.0","terrain_surface":"300.0","parking_lot":0,"price":"250.0"}]');

        },
        error: function (jqxhr, textstatus, errorthrown) {
            console.log("algo malo paso");
        }
    })
    update_table();
}