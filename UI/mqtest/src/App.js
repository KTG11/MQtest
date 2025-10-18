import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
