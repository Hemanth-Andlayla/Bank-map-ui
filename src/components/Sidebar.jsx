import React,{useMemo} from 'react'
import geoData from "../Data/states.js";

function Sidebar({
  selectedState,
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict,
  selectedBankType,
  setSelectedBankType,
}) {
       const stateList=useMemo(()=>{
          return [...new Set(geoData.map(item=>item.StateName))];
       },[]);
       const districtList =useMemo(()=>{
          if(!selectedState) return [];

          return [... new Set(geoData.filter(item=>item.StateName?.toLowerCase().trim()===selectedState?.toLowerCase().trim()).map(item=>item["DistrictName(InEnglish)"]))];
       },[selectedState]);
  return (
    <div className="w-75 h-screen bg-slate-100 border-r p-5 shadow-md">
      
      <h2 className="text-2xl font-bold text-indigo-900 mb-6">
        Filters
      </h2>

      {/* State Dropdown */}
      <div className="mb-5">
        
        <label className="block mb-2 font-medium text-gray-700">
          Select State
        </label>

        <select
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedState}
          onChange={(e) =>{
            setSelectedState(e.target.value)
            setSelectedDistrict("");
          }}
        >
          <option value="">All States</option>
          
          {stateList.map((state)=>(
            <option
             key={state}
             value={state}
            >
             {state}
            </option>
          ))}
        </select>
      </div>

      {/* District Dropdown */}
      <div className="mb-5">
        
        <label className="block mb-2 font-medium text-gray-700">
          Select District
        </label>

        <select
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedDistrict}
          onChange={(e) =>
            setSelectedDistrict(e.target.value)
          }
        >
          <option value="">All Districts</option>
      
         {districtList.map((district)=>(
                 <option 
                    key={district}
                    value={district}
                 >
                  {district}
                 </option>
         ))}
         
        </select>
      </div>

      {/* Bank Type Dropdown */}
      <div className="mb-5">
        
        <label className="block mb-2 font-medium text-gray-700">
          Select Bank Type
        </label>

        <select
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedBankType}
          onChange={(e) =>
            setSelectedBankType(e.target.value)
          }
        >
          <option value="">All Types</option>

          <option value="RRB">
            RRB
          </option>

          <option value="STCB">
           STCB
          </option>
          <option value="DCCB">DCCB</option>
        </select>
      </div>
      {/* ================= LEGEND ================= */}
<div className="mt-6 border-t pt-4">

  <h3 className="mb-3 text-sm font-semibold text-slate-700">
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
      <div className="h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow"></div>

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
  );
}

export default Sidebar;