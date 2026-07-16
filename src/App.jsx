import { useState } from 'react';
import './App.css';
import GreenResultCard from './components/green_result_card/GreenResultCard';
import NotGreenResultCard from './components/not_green_result_card/NotGreenResultCard';
import Footer from './components/footer/Footer';
import fetchEnergyData from './hook/apiCall';
import { filterByBaselineSettlementPeriod, calculateEnergyTotals, compareEnergyTotals,calculateGreenPercentage } from './utils/data_context';

function App() {
    const [energyStatus, setEnergyStatus] = useState("green");

    // function to fetch data and update energy status
    const handleFetchData = async () => {
      return fetchEnergyData().then((data) => {  
          const filteredData = filterByBaselineSettlementPeriod(data);
          const yesterdayEnergyTotals = calculateEnergyTotals(filteredData[0]);
          const todayEnergyTotals = calculateEnergyTotals(filteredData[filteredData.length - 1]);
          const greenPercentage = calculateGreenPercentage(todayEnergyTotals);
          const fetchedInsights = compareEnergyTotals(yesterdayEnergyTotals, todayEnergyTotals);

          console.log(todayEnergyTotals)
         
  
          return {fetchedInsights, greenPercentage, todayEnergyTotals};
      });
  };
  

    return (
        <>
            {energyStatus === "green" ? (
                <GreenResultCard 
                   
                    onRefresh={handleFetchData} 
                    handleFetchData={handleFetchData} 
                    energyStatus={energyStatus}
                    setEnergyStatus={setEnergyStatus}

                />
            ) : (
                <NotGreenResultCard 
                
                    onRefresh={handleFetchData}
                    handleFetchData={handleFetchData}
                    energyStatus={energyStatus}
                    setEnergyStatus={setEnergyStatus} 
                />
            )}
            <Footer />
        </>
    );

   


}

export default App;
