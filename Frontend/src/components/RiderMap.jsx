import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

// Rider SVG icon (blue pin)
const riderIcon = new L.DivIcon({
  className: "transparent-marker",
  html: "🧍",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const driverIcon = new L.DivIcon({
  className: "transparent-marker",
  html: "🚗",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const shopIconOpen = new L.DivIcon({
  className: "transparent-marker",
  html: "🏪<span style='color:green;font-weight:bold;font-size:16px;'>●</span>",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const shopIconClosed = new L.DivIcon({
  className: "transparent-marker",
  html: "🏪<span style='color:red;font-weight:bold;font-size:16px;'>●</span>",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const FitMapToRoute = ({ routeCoords }) => {
  const map = useMap();
  useEffect(() => {
    if (routeCoords && routeCoords.length > 0) {
      map.fitBounds(routeCoords, { paddingBottomRight: [0, 500] });
    }
  }, [routeCoords, map]);
  return null;
};

const RiderMap = ({
  selfLocation,
  otherMarkers = [],
  routeCoords = [],
  shopMarkers = [],
  onShopMarkerClick,
}) => {
  if (!selfLocation)
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
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full h-full flex-1">
        <MapContainer center={selfLocation} zoom={15} className="w-full h-full">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          <Marker position={selfLocation} icon={riderIcon} />
          {otherMarkers.map((pos, idx) => (
            <Marker key={idx} position={pos} icon={driverIcon} />
          ))}
          {/* Shop markers with open/close status */}
          {Array.isArray(shopMarkers) &&
            shopMarkers.map((shopMarker, idx) =>
              shopMarker.location ? (
                <Marker
                  key={shopMarker.shop._id || idx}
                  position={shopMarker.location}
                  icon={shopMarker.isOpen ? shopIconOpen : shopIconClosed}
                  eventHandlers={{
                    click: () => {
                      if (onShopMarkerClick) {
                        onShopMarkerClick(shopMarker);
                      }
                    },
                  }}
                />
              ) : null
            )}
          {routeCoords.length > 0 && (
            <>
              <Polyline positions={routeCoords} color="black" />
              <FitMapToRoute routeCoords={routeCoords} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default RiderMap;
