import './App.css';
import EnergyCard from './components/energy_card/EnergyCard';
import EnergyTypeIndex from './components/energy_type_index/EnergyTypeIndex';
import Footer from './components/footer/Footer';

function App() {
  return (
    <>
      <div className="studio-energy" aria-hidden="true">
        <span className="energy-current energy-current-left" />
        <span className="energy-current energy-current-centre" />
        <span className="energy-current energy-current-right" />
      </div>
      <main className="app-content">
        <EnergyCard />
        <EnergyTypeIndex />
      </main>
      <Footer />
    </>
  );
}

export default App;
