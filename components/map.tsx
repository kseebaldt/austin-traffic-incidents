import { createRef } from "react";
import Map, { NavigationControl, Source, Layer } from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { FeatureCollection } from "geojson";

import type { FillLayer, MapRef } from "react-map-gl";

export const dataLayer: FillLayer = {
  id: "data",
  type: "fill",
  paint: {
    "fill-color": {
      property: "total",
      stops: [
        [5, "#3288bd"],
        [10, "#66c2a5"],
        [15, "#abdda4"],
        [20, "#e6f598"],
        [30, "#ffffbf"],
        [40, "#fee08b"],
        [50, "#fdae61"],
        [100, "#f46d43"],
        [200, "#d53e4f"],
      ],
    },
    "fill-opacity": 0.8,
  },
};

export default function TrafficMap({ data }: { data: FeatureCollection }) {
  const mapRef = createRef<MapRef>();

  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const styleUrl = `https://api.maptiler.com/maps/streets/style.json?key=${key}`;

  const onload = () => {
    console.log("LOADED");
    console.log(mapRef?.current?.getBounds());
  };

  return (
    <Map
      mapLib={maplibregl}
      ref={mapRef}
      initialViewState={{
        longitude: -97.73333,
        latitude: 30.266666,
        zoom: 14,
      }}
      style={{ width: "100%", height: " calc(100vh - 77px)" }}
      mapStyle={styleUrl}
      onLoad={() => onload()}
    >
      <Source type="geojson" data={data}>
        <Layer {...dataLayer} />
      </Source>
      <NavigationControl position="top-left" />
    </Map>
  );
}
