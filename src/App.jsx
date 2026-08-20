import './App.css';
import EnergyCard from './components/energy_card/EnergyCard';
import EnergyTypeIndex from './components/energy_type_index/EnergyTypeIndex';
import Footer from './components/footer/Footer';

function App() {
  return (
    <>
      <main className="app-content">
        <EnergyCard />
        <EnergyTypeIndex />
      </main>
      <Footer />
    </>
  );
}

export default App;
