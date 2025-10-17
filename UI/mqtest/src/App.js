import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './login';
import Login from './signup';
import Login from './AuthPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<signup />} />
        {/* Add other linked pages here (when you add the links it can be redirected) here */}
      </Routes>
    </Router>
  );
}

export default App;
