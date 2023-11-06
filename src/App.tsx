import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/application/HomePage';
import UnauthorizedPage from './components/application/UnauthorizedPage';
import MissingPage from './components/application/MissingPage';
import RegisterPage from './components/authentication/RegisterPage';
import LoginPage from './components/authentication/LoginPage';
import EncapsulatedComponent from './components/navigation/EncapsulatedComponent';
import TimeEntriesPage from './components/entries/user/AllEntriesPage';
import DeleteEntryForm from './components/entries/user/DeleteEntryForm';
import EntryDetailsPage from './components/entries/user/EntryDetailsPage';
import ReportsPage from './components/entries/user/WeekSpeedDistanceReport';
import AddEntryPage from './components/entries/user/AddEntryPage';
import EditEntryDetailsPage from './components/entries/user/UpdateEntryDetailsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EncapsulatedComponent component={HomePage} />} />
        <Route path="/register" element={<EncapsulatedComponent component={RegisterPage} />} />
        <Route path="/login" element={<EncapsulatedComponent component={LoginPage} />} />    
        <Route path="/entries" element={<EncapsulatedComponent component={TimeEntriesPage} />} />
        <Route path="/entries/report" element={<EncapsulatedComponent component={ReportsPage} />} />
        <Route path="/entries/add" element={<EncapsulatedComponent component={AddEntryPage} />} />
        <Route path="/entries/:entryId" element={<EncapsulatedComponent component={EntryDetailsPage} />} />
        <Route path="/entries/:entryId/edit" element={<EncapsulatedComponent component={EditEntryDetailsPage} />} />
        <Route path="/entries/:entryId/delete" element={<EncapsulatedComponent component={DeleteEntryForm} />} />
        <Route path="/unauthorized" element={<EncapsulatedComponent component={UnauthorizedPage} />} />
        <Route path="/*" element={<EncapsulatedComponent component={MissingPage} />} />
      </Routes>
    </Router>
  );
}

export default App
