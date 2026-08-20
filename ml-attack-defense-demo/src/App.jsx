import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import Dataset from './pages/Dataset';
import Models from './pages/Models';
import EvasionAttack from './pages/EvasionAttack';
import EvasionDefense from './pages/EvasionDefense';
import DataPoisoning from './pages/DataPoisoning';
import PoisoningDefense from './pages/PoisoningDefense';
import AttackVsDefense from './pages/AttackVsDefense';
import DefenseStrategies from './pages/DefenseStrategies';
import Conclusion from './pages/Conclusion';

const PAGES = {
  overview: Overview,
  dataset: Dataset,
  models: Models,
  evasion: EvasionAttack,
  evasion_defense: EvasionDefense,
  poisoning: DataPoisoning,
  poisoning_defense: PoisoningDefense,
  results: AttackVsDefense,
  defenses: DefenseStrategies,
  conclusion: Conclusion,
};

export default function App() {
  const [activePage, setActivePage] = useState('overview');

  const PageComponent = PAGES[activePage] || Overview;

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNav={setActivePage} />
      <main className="main-content">
        <PageComponent onNav={setActivePage} />
      </main>
    </div>
  );
}
