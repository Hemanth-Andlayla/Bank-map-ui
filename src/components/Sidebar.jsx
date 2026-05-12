import React, { useMemo, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  selectedState,
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict,
  selectedBankType,
  setSelectedBankType,
  searchValue,
  setSearchValue,
}) {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch("/India_LGD_districts.json")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) =>
        console.error(
          "Error loading GeoJSON in Sidebar:",
          err
        )
      );
  }, []);

  const stateList = useMemo(() => {
    if (!geoData) return [];

    const states = geoData.features.map(
      (f) => f.properties.state_name
    );

    return [...new Set(states)].sort();
  }, [geoData]);

  const districtList = useMemo(() => {
    if (!geoData || !selectedState)
      return [];

    const districts = geoData.features
      .filter(
        (f) =>
          f.properties.state_name ===
          selectedState
      )
      .map(
        (f) => f.properties.district_name
      );

    return [...new Set(districts)].sort();
  }, [geoData, selectedState]);

  return (
    <>
      {/* TOGGLE BUTTON */}
      <button
        onClick={() =>
          setSidebarOpen(!sidebarOpen)
        }
        className="fixed top-24 left-4 z-[1000] bg-indigo-900 text-white p-3 rounded-lg shadow-lg"
      >
        {sidebarOpen ? (
          <X size={22} />
        ) : (
          <Menu size={22} />
        )}
      </button>

      {/* SIDEBAR */}
      <div
        className={`
          fixed top-20 left-0 z-[999]
          h-[75vh]
          sm:h-[82vh]
           lg:h-[90vh]
          2xl:h-[92vh]
          w-[50vw] sm:w-80
          bg-gradient-to-b from-[#f8fbff] via-[#e8f1ff] to-[#dbeafe]
          border-r
          rounded-r-xl
          pt-20 px-5 pb-5
          shadow-2xl
          overflow-y-auto
          transition-transform
          duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* SEARCH */}
        <input
          type="text"
          className="
  w-full
  p-3
  border
  border-blue-200
  bg-white/90
  rounded-xl
  text-slate-700
  placeholder:text-slate-400
  shadow-sm
  transition-all
  duration-200
  hover:border-blue-400
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500
  focus:border-blue-500
"
          placeholder="search by bank details ..."
          value={searchValue}
          onChange={(e) =>
            setSearchValue(
              e.target.value
            )
          }
        />

        <h2 className="text-2xl font-bold text-blue-950 mb-6">
          Filters
        </h2>

        {/* STATE DROPDOWN */}
        <div className="mb-5">
          <label className="block mb-2 font-medium text-slate-700">
            Select State
          </label>

          <select
            className="
  w-full
  p-3
  border
  border-blue-200
  bg-white/90
  rounded-xl
  text-slate-700
  shadow-sm
  transition-all
  duration-200
  hover:border-blue-400
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500
  focus:border-blue-500
    cursor-pointer
"
            value={selectedState}
            onChange={(e) => {
              setSelectedState(
                e.target.value
              );

              setSelectedDistrict("");
            }}
          >
            <option value="">
              All States
            </option>

            {stateList.map((state) => (
              <option
                key={state}
                value={state}
              >
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* DISTRICT DROPDOWN */}
        <div className="mb-5">
          <label className="block mb-2 font-medium text-slate-700">
            Select District
          </label>

          <select
            className="
  w-full
  p-3
  border
  border-blue-200
  bg-white/90
  rounded-xl
  text-slate-700
  shadow-sm
  transition-all
  duration-200
  hover:border-blue-400
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500
  focus:border-blue-500
    cursor-pointer
"
            value={selectedDistrict}
            onChange={(e) =>
              setSelectedDistrict(
                e.target.value
              )
            }
          >
            <option value="">
              All Districts
            </option>

            {districtList.map(
              (district) => (
                <option
                  key={district}
                  value={district}
                >
                  {district}
                </option>
              )
            )}
          </select>
        </div>

        {/* BANK TYPE */}
        <div className="mb-5">
          <label className="block mb-2 font-medium text-slate-700">
            Select Bank Type
          </label>

          <select
            className="
  w-full
  p-3
  border
  border-blue-200
  bg-white/90
  rounded-xl
  text-slate-700
  shadow-sm
  transition-all
  duration-200
  hover:border-blue-400
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500
  focus:border-blue-500
    cursor-pointer
"
            value={selectedBankType}
            onChange={(e) =>
              setSelectedBankType(
                e.target.value
              )
            }
          >
            <option value="">
              All Types
            </option>

            <option value="RRB">
              RRB
            </option>

            <option value="STCB">
              STCB
            </option>

            <option value="DCCB">
              DCCB
            </option>
          </select>
        </div>

        {/* LEGEND */}
        <div className="mt-6 border-t pt-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            Bank Types
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full bg-green-500 border-2 border-white shadow"></div>

              <span className="text-sm text-slate-700">
                RRB
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full bg-[#d63dd9] border-2 border-white shadow"></div>

              <span className="text-sm text-slate-700">
                STCB
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full bg-red-500 border-2 border-white shadow"></div>

              <span className="text-sm text-slate-700">
                DCCB
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;