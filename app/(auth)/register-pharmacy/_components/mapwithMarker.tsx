/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useCallback, useEffect } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapWithMarkerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const MapWithMarker: React.FC<MapWithMarkerProps> = ({ onLocationSelect }) => {
  const defaultMarker = { lat: 9.0192, lng: 38.7525 }; // Default marker at Addis Ababa
  const [marker, setMarker] = useState(defaultMarker);
  const [viewState, setViewState] = useState({
    latitude: defaultMarker.lat, // Default latitude for Addis Ababa
    longitude: defaultMarker.lng, // Default longitude for Addis Ababa
    zoom: 12, // Adjust the zoom level as needed
  });

  // Define bounds for Addis Ababa as [minLng, minLat, maxLng, maxLat]
  const addisBounds: [number, number, number, number] = [
    38.65, 8.85, 38.9, 9.2,
  ];

  // Check if the location is within bounds
  const isWithinBounds = (lat: number, lng: number) => {
    return (
      lng >= addisBounds[0] &&
      lng <= addisBounds[2] &&
      lat >= addisBounds[1] &&
      lat <= addisBounds[3]
    );
  };

  useEffect(() => {
    // Use Geolocation API to get the user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          if (isWithinBounds(userLat, userLng)) {
            setMarker({ lat: userLat, lng: userLng });
            setViewState((prev) => ({
              ...prev,
              latitude: userLat,
              longitude: userLng,
            }));
          }
        },
        (error) => {
          console.error("Error fetching user location:", error);
        }
      );
    }
  }, []);

  const handleMapClick = useCallback(
    (event: any) => {
      const { lat, lng } = event.lngLat;
      setMarker({ lat, lng });
      onLocationSelect(lat, lng);
    },
    [onLocationSelect]
  );

  return (
    <div className="h-[300px] w-full relative">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={viewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onClick={handleMapClick}
        maxBounds={addisBounds} // Restrict panning and zooming to Addis Ababa
      >
        <Marker
          longitude={marker.lng}
          latitude={marker.lat}
          draggable
          onDragEnd={(event) => {
            const { lat, lng } = event.lngLat;
            setMarker({ lat, lng });
            onLocationSelect(lat, lng);
          }}
        />
      </Map>
      <div className="absolute bottom-2 left-2 bg-white p-2 rounded-md text-sm">
        <p>Latitude: {marker.lat.toFixed(4)}</p>
        <p>Longitude: {marker.lng.toFixed(4)}</p>
      </div>
    </div>
  );
};

export default MapWithMarker;
