import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './login';
import Login from './signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/AuthPage" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<signup />} />
        {/* Add other linked pages here (when you add the links it can be redirected) here */}
      </Routes>
    </Router>
  );
}

export default App;
