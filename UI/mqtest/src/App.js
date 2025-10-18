import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<Login />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
