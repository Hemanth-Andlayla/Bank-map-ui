import {
  MapContainer,
   LayersControl,
    TileLayer ,
  Marker,
  Popup,
  GeoJSON,
  useMap,
  ZoomControl,
} from "react-leaflet";

import L from "leaflet";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import banks from "../Data/banks.js";
import BankPopup from "./Bankpopup.jsx";

import "leaflet/dist/leaflet.css";

// ================= MARKER ICON =================
const getIcon = (
  type,
  highlighted = false
) => {

  const colors = {
    RRB: "#22c55e",
    STCB: "#d63dd9",
    DCCB: "#ef4444",
  };

  return new L.DivIcon({
    className: "custom-marker",

    html: `
      <div
        style="
          width:${highlighted ? "30px" : "18px"};
          height:${highlighted ? "30px" : "18px"};

          border-radius:9999px;

          background:${colors[type]};

          border:3px solid white;

          box-shadow:${
            highlighted
              ? "0 0 25px rgba(255,215,0,1)"
              : "0 0 10px rgba(0,0,0,0.5)"
          };

          transform:${
            highlighted
              ? "scale(1.2)"
              : "scale(1)"
          };

          transition:all 0.2s ease;
        "
      ></div>
    `,

    iconSize: highlighted
      ? [30, 30]
      : [18, 18],

    iconAnchor: highlighted
      ? [15, 15]
      : [9, 9],
  });
};

// ================= FIT BOUNDS =================
function FitBounds({ geoData }) {

  const map = useMap();

  useEffect(() => {

    if (
      !geoData ||
      !geoData.features ||
      geoData.features.length === 0
    )
      return;

    const layer = L.geoJSON(geoData);

    if (layer.getBounds().isValid()) {

      map.fitBounds(
        layer.getBounds(),
        {
          padding: [40, 40],
          maxZoom: 9,
        }
      );
    }

  }, [geoData, map]);

  return null;
}

// ================= RESET INDIA VIEW =================
function ResetMapView({
  trigger,
}) {

  const map = useMap();

  useEffect(() => {

    if (trigger === "") {

      map.setView(
        [22.5937, 78.9629],
        5
      );
    }

  }, [trigger, map]);

  return null;
}

function MapView({

  selectedState,
  selectedDistrict,
  selectedBankType,

  setSelectedState,
  setSelectedDistrict,

  searchValue,

}) {

  // ================= STATES GEOJSON =================
  const [statesGeoJson, setStatesGeoJson] =
    useState(null);

  // ================= DISTRICT GEOJSON =================
  const [districtGeoJson, setDistrictGeoJson] =
    useState(null);

  // ================= LOAD STATES =================
  useEffect(() => {

    fetch("/India_LGD_states.json")
      .then((res) => {

        if (!res.ok) {

          throw new Error(
            "Failed to load states geojson"
          );
        }

        return res.json();
      })

      .then((data) => {
        setStatesGeoJson(data);
      })

      .catch((err) => {
        console.error(
          "States GeoJSON Error:",
          err
        );
      });

  }, []);

  // ================= LOAD DISTRICTS =================
  useEffect(() => {

    fetch("/India_LGD_districts.json")
      .then((res) => {

        if (!res.ok) {

          throw new Error(
            "Failed to load districts geojson"
          );
        }

        return res.json();
      })

      .then((data) => {
        setDistrictGeoJson(data);
      })

      .catch((err) => {
        console.error(
          "District GeoJSON Error:",
          err
        );
      });

  }, []);

  // ================= FILTER BANKS =================
  const filteredBanks = useMemo(() => {

    return banks.filter((b) => {

      const matchesState =
        selectedState === "" ||
        b.state === selectedState;

      const matchesDistrict =
        selectedDistrict === "" ||
        b.district === selectedDistrict;

      const matchesBankType =
        selectedBankType === "" ||
        b.bankType === selectedBankType;

      const search =
        searchValue?.toLowerCase() || "";

      const matchesSearch =
        search === "" ||

        b.bankName
          ?.toLowerCase()
          .includes(search) ||

        b.ifsc
          ?.toLowerCase()
          .includes(search) ||

        b.branch
          ?.toLowerCase()
          .includes(search) ||

        b.address
          ?.toLowerCase()
          .includes(search);

      return (
        matchesState &&
        matchesDistrict &&
        matchesBankType &&
        matchesSearch
      );
    });

  }, [
    selectedState,
    selectedDistrict,
    selectedBankType,
    searchValue,
  ]);

  // ================= SELECTED STATE GEO =================
  const selectedStateGeo = useMemo(() => {

    if (
      !districtGeoJson ||
      !selectedState ||
      selectedState === ""
    )
      return null;

    const features =
      districtGeoJson.features.filter(
        (f) =>
          f.properties?.state_name
            ?.toLowerCase()
            .trim() ===
          selectedState
            .toLowerCase()
            .trim()
      );

    if (features.length === 0)
      return null;

    return {
      type: "FeatureCollection",
      features,
    };

  }, [
    districtGeoJson,
    selectedState,
  ]);

  // ================= SELECTED DISTRICT GEO =================
  const selectedDistrictGeo = useMemo(() => {

    if (
      !districtGeoJson ||
      !selectedState ||
      !selectedDistrict ||
      selectedDistrict === ""
    )
      return null;

    const features =
      districtGeoJson.features.filter(
        (f) =>
          f.properties?.state_name
            ?.toLowerCase()
            .trim() ===
            selectedState
              .toLowerCase()
              .trim() &&

          f.properties?.district_name
            ?.toLowerCase()
            .trim() ===
            selectedDistrict
              .toLowerCase()
              .trim()
      );

    if (features.length === 0)
      return null;

    return {
      type: "FeatureCollection",
      features,
    };

  }, [
    districtGeoJson,
    selectedState,
    selectedDistrict,
  ]);

  return (

    <div className="h-[calc(100vh-64px)] sm:h-screen w-full bg-slate-100">

      <div className="h-full w-full overflow-hidden rounded-xl shadow-xl">

        <MapContainer
          center={[22.5937, 78.9629]}
          zoom={5}
          minZoom={4}
          zoomControl={false}
          className="h-full w-full z-0"
        >
<LayersControl position="topright">

  {/* STREET MAP */}
  <LayersControl.BaseLayer checked name="Street Map">
    <TileLayer
      attribution='&copy; OpenStreetMap contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  </LayersControl.BaseLayer>

  {/* DARK MAP */}
  <LayersControl.BaseLayer name="Dark Map">
    <TileLayer
      attribution='&copy; CARTO'
      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    />
  </LayersControl.BaseLayer>

  {/* SATELLITE */}
  <LayersControl.BaseLayer name="Satellite">
    <TileLayer
      attribution='Tiles © Esri'
      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    />
  </LayersControl.BaseLayer>

  {/* TERRAIN */}
  <LayersControl.BaseLayer name="Terrain">
    <TileLayer
      attribution='&copy; OpenTopoMap'
      url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
    />
  </LayersControl.BaseLayer>

</LayersControl>
          {/* ZOOM */}
          <ZoomControl position="topright" />

          {/* RESET INDIA */}
          <ResetMapView
            trigger={selectedState}
          />

          {/* INDIA STATES */}
          {statesGeoJson && (

            <GeoJSON
              data={statesGeoJson}

              style={() => ({
                color: "#2563eb",
                weight: 2,
                opacity: 0.8,
                fillColor: "#bfdbfe",
                fillOpacity: 0.03,
              })}

              onEachFeature={(
                feature,
                layer
              ) => {

                layer.on({

                  click: () => {

                    const stateName =
                      feature.properties
                        ?.state_name ||

                      feature.properties
                        ?.STATE_NAME ||

                      feature.properties
                        ?.STNAME;

                    if (stateName) {

                      setSelectedState(
                        stateName
                      );

                      setSelectedDistrict("");
                    }
                  },

                  mouseover: (e) => {

                    e.target.setStyle({
                      weight: 3,
                      opacity: 1,
                      fillOpacity: 0.08,
                    });
                  },

                  mouseout: (e) => {

                    e.target.setStyle({
                      weight: 2,
                      opacity: 0.8,
                      fillOpacity: 0.03,
                    });
                  },
                });
              }}
            />
          )}

          {/* STATE HIGHLIGHT */}
          {selectedStateGeo &&
            selectedDistrict === "" && (

            <>
              <GeoJSON
                key={`state-${selectedState}`}
                data={selectedStateGeo}

                style={() => ({
                  color: "#2563eb",
                  weight: 2.5,
                  opacity: 1,
                  fillColor: "#60a5fa",
                  fillOpacity: 0.08,
                })}

                onEachFeature={(
                  feature,
                  layer
                ) => {

                  layer.on({

                    click: () => {

                      const districtName =
                        feature.properties
                          ?.district_name;

                      if (districtName) {

                        setSelectedDistrict(
                          districtName
                        );
                      }
                    },

                    mouseover: (e) => {

                      e.target.setStyle({
                        weight: 3,
                        fillOpacity: 0.15,
                      });
                    },

                    mouseout: (e) => {

                      e.target.setStyle({
                        weight: 2.5,
                        fillOpacity: 0.08,
                      });
                    },
                  });
                }}
              />

              <FitBounds
                geoData={selectedStateGeo}
              />
            </>
          )}

          {/* DISTRICT HIGHLIGHT */}
          {selectedDistrictGeo && (

            <>
              {/* STATE OUTLINE */}
              {selectedStateGeo && (

                <GeoJSON
                  key={`state-outline-${selectedState}`}
                  data={selectedStateGeo}
                  interactive={false}

                  style={() => ({
                    color: "#60a5fa",
                    weight: 1.5,
                    opacity: 0.7,
                    fillOpacity: 0,
                  })}
                />
              )}

              {/* DISTRICT */}
              <GeoJSON
                key={`district-${selectedDistrict}`}
                data={selectedDistrictGeo}
                interactive={false}

                style={() => ({
                  color: "#1d4ed8",
                  weight: 4,
                  opacity: 1,
                  fillColor: "#3b82f6",
                  fillOpacity: 0.12,
                })}
              />

              <FitBounds
                geoData={
                  selectedDistrictGeo
                }
              />
            </>
          )}

          {/* ================= BANK MARKER CLUSTERS =================

<MarkerClusterGroup
  chunkedLoading
>

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

</MarkerClusterGroup> */}
        
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

export default MapView;