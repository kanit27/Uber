import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Maps = ({ routeCoords }) => {
  const [position, setPosition] = React.useState(null);

  console.log("Route Coords in Maps.jsx:", routeCoords);

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

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  if (!position) {
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
          <MapContainer
    className="w-full h-full"
      center={position}
      zoom={16}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} />

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
