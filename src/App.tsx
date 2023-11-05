import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/application/HomePage';
import UnauthorizedPage from './components/application/UnauthorizedPage';
import MissingPage from './components/application/MissingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/missing" element={<MissingPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </Router>
  );
}

export default App
