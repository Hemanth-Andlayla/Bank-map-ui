import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MapView from './components/MapView'

function App() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBankType, setSelectedBankType] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
   const [searchValue, setSearchValue] = useState("");


  return (
    <div className='h-screen w-full flex flex-col'>
     <Header/>
    <div className='flex flex-1 overflow-hidden'>
     <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedBankType={selectedBankType}
        setSelectedBankType={setSelectedBankType}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
    <div className='flex-1 h-full'>
    <MapView
  selectedState={selectedState}
  selectedDistrict={selectedDistrict}
  selectedBankType={selectedBankType}

  setSelectedState={setSelectedState}
  setSelectedDistrict={setSelectedDistrict}
   searchValue={searchValue}
/>

  </div>
  </div>
  </div>
  )
}

export default App
