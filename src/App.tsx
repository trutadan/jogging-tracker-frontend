import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/application/HomePage';
import UnauthorizedPage from './components/application/UnauthorizedPage';
import MissingPage from './components/application/MissingPage';
import RegisterPage from './components/authentication/RegisterPage';
import LoginPage from './components/authentication/LoginPage';
import EncapsulatedComponent from './components/navigation/EncapsulatedComponent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EncapsulatedComponent component={HomePage} />} />
        <Route path="/register" element={<EncapsulatedComponent component={RegisterPage} />} />
        <Route path="/login" element={<EncapsulatedComponent component={LoginPage} />} />    
        <Route path="/unauthorized" element={<EncapsulatedComponent component={UnauthorizedPage} />} />
        <Route path="/*" element={<EncapsulatedComponent component={MissingPage} />} />
      </Routes>
    </Router>
  );
}

export default App
