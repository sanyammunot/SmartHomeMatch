import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import MatchingResults from './pages/MatchingResults';
import CustomerDashboard from './components/Dashboard/CustomerDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/matches" element={<MatchingResults />} />
      </Routes>
    </Router>
  );
}

export default App;