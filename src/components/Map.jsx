import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import omnivore from "@mapbox/leaflet-omnivore";

const Map = () => {
  useEffect(() => {
    // Inicjalizacja mapy
    const map = L.map("map", {
      closePopupOnClick: false,
      dragging: false,
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      maxZoom: 10,
      minZoom: 3,
    }).setView([47.80332, 13.03921], 4);

    // Warstwa bazowa
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      
  
    ).addTo(map);

    // Funkcja pomocnicza do ładowania GPX
    const addGPXLayer = (gpxFile, color) => {
      return omnivore
        .gpx(gpxFile, null, L.geoJson(null, {
          style: {
            color: color,
            weight: 6,
            opacity: 0.9,
          },
        }))
        .on("ready", function () {
          this.eachLayer(function (layer) {
            layer.on("click", function () {
              map.fitBounds(layer.getBounds());
            });
          });
        })
        .addTo(map);
    };

    // Warstwy GPX
    const gpxLayers = {
      "2025": addGPXLayer("https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/data/2025/2025full.gpx", "#0E6360"),
      "2024": addGPXLayer("https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/data/2024/2024full.gpx", "#7ED7D1"),
      "2023": addGPXLayer("https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/data/2023/2023full.gpx", "#FF4F3F"),
      "2022": addGPXLayer("https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/data/2022/2022full.gpx", "#F4CB2E"),
    };

    // Legenda
    const legend = L.control({ position: "topleft" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      div.style.color = "#061a1e";
      div.style.fontWeight = "bold";
      div.style.fontFamily = "Arial, sans-serif";
      div.style.background = "#f6f4f0";
      div.style.borderRadius = "16px";
      div.style.padding = "12px 16px";

      for (const year in gpxLayers) {
        const color = gpxLayers[year].options.style.color;
        div.innerHTML += `
          <i style="background:${color}; width:24px; height:10px; display:inline-block; margin-right:5px;"></i>
          ${year}<br>
        `;
      }
      return div;
    };
    legend.addTo(map);

    // Sprzątanie przy odmontowaniu
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      id="map"
      style={{
        height: "520px",
        width: "100%",
        overflow: "hidden",
      }}
    />
  );
};

export default Map;