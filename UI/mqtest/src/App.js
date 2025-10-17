import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
