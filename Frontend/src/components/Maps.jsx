import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Rider Icon 🧍
const riderIcon = new L.DivIcon({
  className: "",
  html: "🧍",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

// Driver Icon 🚗
const driverIcon = new L.DivIcon({
  className: "",
  html: "🚗",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

const FitMapToRoute = ({ routeCoords }) => {
  const map = useMap();
  useEffect(() => {
    if (routeCoords && routeCoords.length > 0) {
      map.fitBounds(routeCoords, {
        paddingBottomRight: [0, 500],
      });
    }
  }, [routeCoords, map]);
  return null;
};

const Maps = ({ selfLocation, otherMarkers = [], routeCoords = [], isRider = false }) => {
  if (!selfLocation) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="loader"
          style={{
            width: "50px",
            height: "50px",
            border: "5px solid #f3f3f3",
            borderTop: "5px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <MapContainer center={selfLocation} zoom={15} className="w-full h-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Self marker with rider/driver icon */}
        <Marker
          position={selfLocation}
          icon={isRider ? riderIcon : driverIcon}
        />

        {/* Other markers always as drivers (🚗) */}
        {otherMarkers.map((pos, idx) => (
          <Marker key={idx} position={pos} icon={driverIcon} />
        ))}

        {routeCoords.length > 0 && (
          <>
            <Polyline positions={routeCoords} color="black" />
            <FitMapToRoute routeCoords={routeCoords} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default Maps;
