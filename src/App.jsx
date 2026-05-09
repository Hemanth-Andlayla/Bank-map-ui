import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Mapview from './components/Mapview'

function App() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBankType, setSelectedBankType] = useState("");

  return (
    <div className='h-screen w-full flex flex-col'>
     <Header/>
    <div className='flex flex-1 overflow-hidden'>
     <Sidebar
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedBankType={selectedBankType}
        setSelectedBankType={setSelectedBankType}
      />
    <div className='flex-1 h-full'>
     <Mapview
           selectedState={selectedState}
           selectedDistrict={selectedDistrict}
            selectedBankType={selectedBankType}
     
     />

  </div>
  </div>
  </div>
  )
}

export default App
