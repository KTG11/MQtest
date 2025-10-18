import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<auth />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
