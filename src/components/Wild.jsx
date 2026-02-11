import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Wild = () => {
  useEffect(() => {
    // --- Inicjalizacja mapy ---
    const leafletMap = L.map("wildmap", {
      closePopupOnClick: false,
      dragging: false,
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
    }).setView([47.609401746377145, 13.783270663071217], 5);
    

    // --- Warstwy bazowe ---
    const baseLayers = {
      "OSM": L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        maxZoom: 19,
        minZoom: 3,
      }),
      "Base": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 9,
        minZoom: 3,
      }),
      "Carto Light": L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 20,
        minZoom: 3,
      }).addTo(leafletMap), // aktywna domyślnie
      "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 20,
        minZoom: 3,
      }),
      "Satellite": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        minZoom: 3,
      }),
      "GoogleSatellite": L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        minZoom: 3,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }),
      "Bike paths": L.tileLayer("https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png", {
        maxZoom: 20,
        minZoom: 3,
      }),
      "Carto Lighter": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 20,
        minZoom: 3,
      }),
    };

    // --- Ikony dla markerów ---
    const hotIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/icons/Camp.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const sleepIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/icons/Tent.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const greenIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/icons/Pink.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // --- Lista lokalizacji ---
    const locations = [
      { coords: [50.34353, 14.870005], icon: sleepIcon, title: "WILD", description: "1st Brodce<br/>50.34353, 14.870005" },
      { coords: [50.033846, 14.404621], icon: sleepIcon, title: "WILD", description: "Prague<br/>50.033846, 14.404621" },
      { coords: [49.410181, 15.076606], icon: hotIcon, title: "CAMP", description: "Moravec<br/>49.410181, 15.076606" },
      { coords: [48.564758, 16.047581], icon: sleepIcon, title: "WILD", description: "Hollabrunn<br/>48.564758, 16.047581" },
      { coords: [48.21144, 16.447545], icon: hotIcon, title: "CAMP", description: "Vienna<br/>48.21144, 16.447545" },
      { coords: [48.209367, 16.468869], icon: sleepIcon, title: "WILD", description: "Vienna<br/>48.209367, 16.468869" },
      { coords: [47.699867, 17.62112], icon: sleepIcon, title: "WILD", description: "Gyor<br/>47.699867, 17.62112" },
      { coords: [46.764867, 17.289952], icon: hotIcon, title: "CAMP", description: "Keszthely<br/>46.764867, 17.289952" },
      { coords: [46.803734, 17.518897], icon: hotIcon, title: "CAMP", description: "Badacsonytomaj<br/>46.803734, 17.518897" },
      { coords: [46.938394, 18.127529], icon: sleepIcon, title: "WILD", description: "Siofok<br/>46.938394, 18.127529" },
      { coords: [47.41718, 18.907596], icon: sleepIcon, title: "WILD", description: "Budapest<br/>47.41718, 18.907596" },
      { coords: [47.476161, 19.083333], icon: hotIcon, title: "CAMP", description: "Budapest<br/>47.476161, 19.083333" },
      { coords: [47.831521, 18.698297], icon: sleepIcon, title: "WILD", description: "Esztergom<br/>47.831521, 18.698297" },
      { coords: [48.595192, 18.455335], icon: sleepIcon, title: "WILD", description: "26/27.08.2022<br/>48.595192, 18.455335" },
      { coords: [49.446265, 18.771056], icon: sleepIcon, title: "WILD", description: "Cadca<br/>49.446265, 18.771056" },
      { coords: [47.256844, 11.329313], icon: sleepIcon, title: "WILD", description: "Innsbruck<br/>47.256844, 11.329313" },
      { coords: [46.507881, 11.350628], icon: sleepIcon, title: "WILD", description: "Bolzano<br/>46.507881, 11.350628" },
      { coords: [45.788343, 10.82479], icon: hotIcon, title: "CAMP", description: "Garda<br/>45.788343, 10.82479" },
      { coords: [45.373651, 11.427969], icon: sleepIcon, title: "WILD", description: "Lonigo<br/>45.373651, 11.427969" },
      { coords: [45.645984, 12.654267], icon: sleepIcon, title: "WILD", description: "Venice<br/>45.645984, 12.654267" },
      { coords: [45.59832, 13.783057], icon: sleepIcon, title: "WILD", description: "Muggia<br/>45.59832, 13.783057" },
      { coords: [45.309447, 14.284681], icon: hotIcon, title: "CAMP", description: "Icici<br/>45.309447, 14.284681" },
      { coords: [45.879229, 15.999641], icon: sleepIcon, title: "WILD", description: "Zagreb<br/>45.879229, 15.999641" },
      { coords: [46.539944, 15.924602], icon: sleepIcon, title: "WILD", description: "Ptuj<br/>46.539944, 15.924602" },
      { coords: [47.585979, 16.102185], icon: sleepIcon, title: "WILD", description: "Holl<br/>47.585979, 16.102185" },
      { coords: [48.621341, 16.518346], icon: sleepIcon, title: "WILD", description: "Horesdorf<br/>48.621341, 16.518346" },
      { coords: [49.683346, 16.620236], icon: sleepIcon, title: "WILD", description: "Krenov<br/>49.683346, 16.620236" },
      { coords: [46.850573, 9.494796], icon: greenIcon, title: "WILD", description: "Military Base Chur<br/>46.850573, 9.494796" },
      { coords: [46.132881, 9.288373], icon: hotIcon, title: "CAMP", description: "Dongo<br/>46.132881, 9.288373" },
      { coords: [45.571896, 8.540631], icon: sleepIcon, title: "WILD", description: "Momo<br/>45.571896, 8.540631" },
      { coords: [44.934488, 7.65149], icon: sleepIcon, title: "WILD", description: "Brassi<br/>44.934488, 7.65149" },
      { coords: [44.290399, 8.451802], icon: hotIcon, title: "CAMP", description: "Savona<br/>44.290399, 8.451802" },
      { coords: [44.738556, 8.821508], icon: sleepIcon, title: "WILD", description: "Novi Ligure<br/>44.738556, 8.821508" },
      { coords: [45.408341, 9.141478], icon: sleepIcon, title: "WILD", description: "Milan<br/>45.408341, 9.141478" },
      { coords: [45.821937, 9.414672], icon: hotIcon, title: "CAMP", description: "Lecco<br/>45.821937, 9.414672" },
      { coords: [46.310269, 9.393851], icon: sleepIcon, title: "WILD", description: "Chiavenna<br/>46.310269, 9.393851" },
      { coords: [46.704796, 9.445332], icon: sleepIcon, title: "WILD", description: "Thusis<br/>46.704796, 9.445332" },
      { coords: [43.684086, 10.627067], icon: sleepIcon, title: "WILD", description: "Calcinaia<br/>43.684086, 10.627067" },
      { coords: [43.062632, 10.567381], icon: sleepIcon, title: "WILD", description: "Calcinaia<br/>43.062632, 10.567381" },
      { coords: [42.633493, 11.415853], icon: sleepIcon, title: "WILD", description: "Calcinaia<br/>42.633493, 11.415853" },
      { coords: [42.107071, 12.27905], icon: sleepIcon, title: "WILD", description: "Calcinaia<br/>42.107071, 12.27905" },
      { coords: [41.564366, 12.532244], icon: hotIcon, title: "CAMP", description: "Calcinaia<br/>41.564366, 12.532244" },
      { coords: [41.23115, 13.513304], icon: sleepIcon, title: "WILD", description: "Calcinaia<br/>41.23115, 13.513304" },
      { coords: [41.020212, 14.297757], icon: sleepIcon, title: "WILD", description: "Calcinaia<br/>41.020212, 14.297757" },
      { coords: [42.5791, 14.094754], icon: hotIcon, title: "CAMP", description: "Calcinaia<br/>42.5791, 14.094754" },
      { coords: [42.657077, 14.03303], icon: hotIcon, title: "CAMP", description: "Calcinaia<br/>42.657077, 14.03303" },
      { coords: [43.63362, 13.362455], icon: sleepIcon, title: "WILD", description: "Calcinaia<br/>43.63362, 13.362455" },
      { coords: [44.061975, 12.437592], icon: sleepIcon, title: "WILD", description: "Calcinaia<br/>44.061975, 12.437592" },
      { coords: [43.765337, 11.317237], icon: hotIcon, title: "CAMP", description: "Calcinaia<br/>43.765337, 11.317237" },
    ];

    // --- Markery ---
    const markerGroup = L.featureGroup();

    locations.forEach((loc) => {
      const marker = L.marker(loc.coords, { icon: loc.icon })
        .bindPopup(`<b>${loc.title}</b><br>${loc.description}`)
        .addTo(markerGroup);

      // 🔍 zoom po kliknięciu
      marker.on("click", () => {
        leafletMap.setView(loc.coords, 12, { animate: true });
      });
    });

    markerGroup.addTo(leafletMap);

    // ✅ WYBÓR PODKŁADÓW (ZOSTAWIONY)
    L.control.layers(baseLayers, { Markery: markerGroup }).addTo(leafletMap);

    // --- Widok startowy ---
    leafletMap.fitBounds(markerGroup.getBounds(), { padding: [25, 25] });
    const initialBounds = markerGroup.getBounds();

    // --- Reset view ---
    const ResetViewControl = L.Control.extend({
      options: { position: "topright" },

      onAdd() {
        const c = L.DomUtil.create("div", "leaflet-bar leaflet-control");
        const b = L.DomUtil.create("a", "", c);

        b.innerHTML = "⟳";
        b.href = "#";
        b.title = "Reset view";
        b.style.width = "30px";
        b.style.height = "30px";
        b.style.lineHeight = "26px";
        b.style.textAlign = "center";
        b.style.fontSize = "18px";

        L.DomEvent.on(b, "click", (e) => {
          L.DomEvent.stop(e);
          leafletMap.fitBounds(initialBounds, {
            padding: [25, 25],
            animate: true,
          });
        });

        return c;
      },
    });

    leafletMap.addControl(new ResetViewControl());

    // --- Cleanup ---
    return () => leafletMap.remove();
  }, []);

  return (
    <div
      id="wildmap"
      style={{
        height: "400px",
        width: "100%",
        overflow: "hidden",
      }}
    />
  );
};

export default Wild;