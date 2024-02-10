require([
      "esri/config",
      "esri/Map",
      "esri/views/MapView",
      "esri/widgets/Search",
      "esri/widgets/Legend",
      "esri/layers/TileLayer",
      "esri/layers/FeatureLayer"
    ], function(esriConfig, Map, MapView, Search, Legend, TileLayer, FeatureLayer) {

      esriConfig.apiKey = "AAPK230fb8e3325b49d69c7764e99ec9d241PBgrbHgjI_3q3Pa15HfHN1DdlhBfDJ8gGV1n4ewgcsXGKILuPEaO_S1XZULFLlzK";


      const topographicLayer = new TileLayer({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
      });

      const satelliteLayer = new TileLayer({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
      });

      const osmLayer = new TileLayer({
        url: "https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer"
      });

      const terrainLayer = new TileLayer({
        url: "https://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer"
      });

      const darkLayer = new TileLayer({
        url: "https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer"
      });

      const map = new Map({
        layers: [topographicLayer]
      });
      
      const view = new MapView({
        map: map,
        center: [78.9629, 20.5937], // Longitude, latitude (India)
        zoom: 5, 
        container: "viewDiv" 
      });

      let searchWidget; 


      function addSearchWidget() {
        searchWidget = new Search({
          view: view
        });
        view.ui.add(searchWidget, {
          position: "top-left"
        });
      }


      addSearchWidget();


      document.getElementById("layerSelect").addEventListener("change", function(event) {
        const selectedLayer = event.target.value;
        switch(selectedLayer) {
          case "topographic":
            map.layers.removeAll();
            map.layers.add(topographicLayer);
            break;
          case "satellite":
            map.layers.removeAll();
            map.layers.add(satelliteLayer);
            break;
          case "osm":
            map.layers.removeAll();
            map.layers.add(osmLayer);
            break;
          case "terrain":
            map.layers.removeAll();
            map.layers.add(terrainLayer);
            break;
          case "dark":
            map.layers.removeAll();
            map.layers.add(darkLayer);
            break;
        }
      });

      // file upload
      document.getElementById("fileInput").addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            const data = JSON.parse(e.target.result);
            const featureLayer = new FeatureLayer({
              source: data,
              fields: [],
              objectIdField: "ObjectID",
              geometryType: "point", 
              spatialReference: view.spatialReference,
              renderer: {
                type: "simple",  
                symbol: {
                  type: "simple-marker",  
                  color: "blue",
                  size: "8px",
                  outline: {
                    color: [255, 255, 255, 0.5],
                    width: 1
                  }
                }
              }
            });
            map.add(featureLayer);
            const legend = new Legend({
              view: view,
              layerInfos: [{
                layer: featureLayer,
                title: "Uploaded Layer"
              }]
            });
            view.ui.add(legend, "bottom-right");
          };
          reader.readAsText(file);
        }
      });

      // event listener for current location button
      document.getElementById("currentLocationButton").addEventListener("click", function() {
        if (searchWidget) {
          view.ui.remove(searchWidget); 
        }
        
        searchWidget = new Search({
          view: view,
          includeDefaultSources: false
        });
        view.ui.add(searchWidget, {
          position: "top-left"
        });
        searchWidget.search("Current Location"); 
      });

    });