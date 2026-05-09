import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import { useEffect, useMemo, useState } from "react";

import banks from "../Data/banks.js";
import BankPopup from "./Bankpopup.jsx";

import "leaflet/dist/leaflet.css";

// ================= MARKER ICON =================
const getIcon = (type) => {
  const colors = {
    RRB: "#22c55e",
    STCB: "#3b82f6",
    DCCB: "#ef4444",
  };

  return new L.DivIcon({
    className: "custom-marker",
    html: `
      <div
        style="
          width:18px;
          height:18px;
          border-radius:9999px;
          background:${colors[type]};
          border:3px solid white;
          box-shadow:0 0 10px rgba(0,0,0,0.5);
        "
      ></div>
    `,
  });
};

// ================= FIT BOUNDS =================
function FitBounds({ geoData }) {
  const map = useMap();

  useEffect(() => {
    if (!geoData) return;

    const layer = L.geoJSON(geoData);

    if (layer.getBounds().isValid()) {
      map.fitBounds(layer.getBounds(), {
        padding: [20, 20],
      });
    }
  }, [geoData, map]);

  return null;
}

function Mapview({
  selectedState,
  selectedDistrict,
  selectedBankType,
}) {

  // ================= STATES GEOJSON =================
  const [statesGeoJson, setStatesGeoJson] = useState(null);

  // ================= DISTRICTS GEOJSON =================
  const [districtGeoJson, setDistrictGeoJson] = useState(null);

  // ================= LOAD STATES =================
  useEffect(() => {

    fetch("/INDIA_STATES.geojson")
      .then((res) => res.json())
      .then((data) => {
        setStatesGeoJson(data);
      })
      .catch((err) => {
        console.error("States GeoJSON Error:", err);
      });

  }, []);

  // ================= LOAD DISTRICT FILE =================
  useEffect(() => {

    if (!selectedState) {
      setDistrictGeoJson(null);
      return;
    }

    const fileName = selectedState
      .toLowerCase()
      .replace(/\s+/g, "");

    fetch(`/districts/${fileName}.geojson`)
      .then((res) => res.json())
      .then((data) => {
        setDistrictGeoJson(data);
      })
      .catch((err) => {
        console.error("District GeoJSON Error:", err);
        setDistrictGeoJson(null);
      });

  }, [selectedState]);

  // ================= FILTER BANKS =================
  const filteredBanks = banks.filter(
    (b) =>
      (selectedState === "" || b.state === selectedState) &&
      (selectedDistrict === "" || b.district === selectedDistrict) &&
      (selectedBankType === "" || b.bankType === selectedBankType)
  );

  // ================= SELECTED STATE GEO =================
  const selectedStateGeo = useMemo(() => {

    if (!statesGeoJson || !selectedState) return null;

    const filteredFeatures = statesGeoJson.features.filter((f) => {

      return (
        f.properties.STNAME?.toLowerCase().trim() ===
        selectedState.toLowerCase().trim()
      );
    });

    return {
      type: "FeatureCollection",
      features: filteredFeatures,
    };

  }, [statesGeoJson, selectedState]);

  // ================= SELECTED DISTRICT GEO =================
  const selectedDistrictGeo = useMemo(() => {

    if (!districtGeoJson || !selectedDistrict) return null;

    const filteredFeatures = districtGeoJson.features.filter((f) => {

      return (
        f.properties.district?.toLowerCase().trim() ===
        selectedDistrict.toLowerCase().trim()
      );
    });

    return {
      type: "FeatureCollection",
      features: filteredFeatures,
    };

  }, [districtGeoJson, selectedDistrict]);

  return (
    <div className="h-screen w-full bg-slate-100">

      <div className="h-full w-full overflow-hidden rounded-xl shadow-xl">

        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          className="h-full w-full z-0"
        >

          {/* ================= TILE ================= */}
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* ================= STATE HIGHLIGHT ================= */}
          {selectedStateGeo &&
            selectedStateGeo.features.length > 0 &&
            !selectedDistrict && (
              <>
                <GeoJSON
                  key={selectedState}
                  data={selectedStateGeo}
                  style={{
                    color: "#2563eb",
                    weight: 8,
                    opacity: 1,
                    fillColor: "#60a5fa",
                    fillOpacity: 0.25,
                  }}
                />

                <FitBounds geoData={selectedStateGeo} />
              </>
            )}

          {/* ================= DISTRICT HIGHLIGHT ================= */}
          {selectedDistrictGeo &&
            selectedDistrictGeo.features.length > 0 && (
              <>
                <GeoJSON
                  key={selectedDistrict}
                  data={selectedDistrictGeo}
                  style={{
                    color: "#2563eb",
                    weight: 8,
                    opacity: 1,
                    fillColor: "#93c5fd",
                    fillOpacity: 0.35,
                  }}
                />

                <FitBounds geoData={selectedDistrictGeo} />
              </>
            )}

          {/* ================= BANK MARKERS ================= */}
          {filteredBanks.map((b) => (
            <Marker
              key={b.id}
              position={[b.lat, b.lng]}
              icon={getIcon(b.bankType)}
            >
              <Popup>
                <BankPopup bank={b} />
              </Popup>
            </Marker>
          ))}

        </MapContainer>

      </div>

    </div>
  );
}

export default Mapview;