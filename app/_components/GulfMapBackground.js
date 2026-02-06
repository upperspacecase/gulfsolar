"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

const MAP_STYLE = {
  version: 8,
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    },
  },
  layers: [
    {
      id: "carto-base",
      type: "raster",
      source: "carto",
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

const ISLANDS = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Waiheke" },
      geometry: { type: "Point", coordinates: [175.041, -36.801] },
    },
    {
      type: "Feature",
      properties: { name: "Great Barrier" },
      geometry: { type: "Point", coordinates: [175.407, -36.247] },
    },
    {
      type: "Feature",
      properties: { name: "Rakino" },
      geometry: { type: "Point", coordinates: [174.935, -36.709] },
    },
    {
      type: "Feature",
      properties: { name: "Rotoroa" },
      geometry: { type: "Point", coordinates: [175.174, -36.818] },
    },
    {
      type: "Feature",
      properties: { name: "Kawau" },
      geometry: { type: "Point", coordinates: [174.858, -36.43] },
    },
  ],
};

export default function GulfMapBackground() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [175.03, -36.66],
      zoom: 8.2,
      pitch: 36,
      bearing: -18,
      antialias: true,
      interactive: false,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.addSource("island-points", {
        type: "geojson",
        data: ISLANDS,
      });

      map.addLayer({
        id: "island-halo",
        type: "circle",
        source: "island-points",
        paint: {
          "circle-radius": 10,
          "circle-color": "rgba(255,195,67,0.24)",
          "circle-blur": 0.4,
        },
      });

      map.addLayer({
        id: "island-core",
        type: "circle",
        source: "island-points",
        paint: {
          "circle-radius": 4,
          "circle-color": "#FFC343",
          "circle-stroke-color": "#1D2653",
          "circle-stroke-width": 1,
        },
      });

      map.addLayer({
        id: "island-label",
        type: "symbol",
        source: "island-points",
        layout: {
          "text-field": ["get", "name"],
          "text-size": 11,
          "text-offset": [0, 1.2],
          "text-anchor": "top",
          "text-font": ["Open Sans Semibold"],
        },
        paint: {
          "text-color": "#F4F4F6",
          "text-halo-color": "rgba(29,38,83,0.9)",
          "text-halo-width": 1,
        },
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute bottom-2 right-3 text-[10px] text-white/50">
        OpenStreetMap + CARTO
      </div>
    </div>
  );
}
