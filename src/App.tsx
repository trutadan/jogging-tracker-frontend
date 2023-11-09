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
import ReportsPage from './components/entries/user/WeekSpeedDistanceReports';
import AddEntryPage from './components/entries/user/AddEntryPage';
import EditEntryDetailsPage from './components/entries/user/UpdateEntryDetailsPage';
import UsersPage from './components/users/AllUsersPage';
import UserDetailsPage from './components/users/UserDetailsPage';
import DeleteUserForm from './components/users/DeleteUserForm';
import AddUserPage from './components/users/AddUserPage';
import EditUserDetailsPage from './components/users/UpdateUserDetailsPage';
import AddEntryAdminPage from './components/entries/admin/AddEntryAdminPage';
import TimeEntriesAdminPage from './components/entries/admin/AllEntriesAdminPage';
import EntryDetailsAdminPage from './components/entries/admin/EntryDetailsAdminPage';
import EditEntryDetailsAdminPage from './components/entries/admin/UpdateEntryDetailsAdminPage';
import DeleteEntryAdminForm from './components/entries/admin/DeleteEntryAdminForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<EncapsulatedComponent component={HomePage} />} />
        <Route path="/register" element={<EncapsulatedComponent component={RegisterPage} />} />
        <Route path="/login" element={<EncapsulatedComponent component={LoginPage} />} />    
        <Route path="/unauthorized" element={<EncapsulatedComponent includeNavbar={false} component={UnauthorizedPage} />} />

        {/* any user */}
        <Route path="/entries" element={<EncapsulatedComponent component={TimeEntriesPage} />} />
        <Route path="/entries/report" element={<EncapsulatedComponent component={ReportsPage} />} />
        <Route path="/entries/add" element={<EncapsulatedComponent component={AddEntryPage} />} />
        <Route path="/entries/:entryId" element={<EncapsulatedComponent component={EntryDetailsPage} />} />
        <Route path="/entries/:entryId/edit" element={<EncapsulatedComponent component={EditEntryDetailsPage} />} />
        <Route path="/entries/:entryId/delete" element={<EncapsulatedComponent component={DeleteEntryForm} />} />

        {/* admin/user manager */}
        <Route path="/users" element={<EncapsulatedComponent allowedRoles={['user_manager', 'admin']} component={UsersPage} />} />
        <Route path="/users/add" element={<EncapsulatedComponent allowedRoles={['user_manager', 'admin']} component={AddUserPage} />} />
        <Route path="/users/:userId" element={<EncapsulatedComponent allowedRoles={['user_manager', 'admin']} component={UserDetailsPage} />} />
        <Route path="/users/:userId/edit" element={<EncapsulatedComponent allowedRoles={['user_manager', 'admin']} component={EditUserDetailsPage} />} />
        <Route path="/users/:userId/delete" element={<EncapsulatedComponent allowedRoles={['user_manager', 'admin']} component={DeleteUserForm} />} />

        {/* admin */}
        <Route path="/admin/entries" element={<EncapsulatedComponent allowedRoles={['admin']} component={TimeEntriesAdminPage} />} />
        <Route path="/admin/entries/add" element={<EncapsulatedComponent allowedRoles={['admin']} component={AddEntryAdminPage} />} />
        <Route path="/admin/entries/:entryId" element={<EncapsulatedComponent allowedRoles={['admin']} component={EntryDetailsAdminPage} />} />
        <Route path="/admin/entries/:entryId/edit" element={<EncapsulatedComponent allowedRoles={['admin']} component={EditEntryDetailsAdminPage} />} />
        <Route path="/admin/entries/:entryId/delete" element={<EncapsulatedComponent allowedRoles={['admin']} component={DeleteEntryAdminForm} />} />

        {/* catch all */}
        <Route path="/*" element={<EncapsulatedComponent includeNavbar={false} component={MissingPage} />} />
      </Routes>
    </Router>
  );
}

export default App
