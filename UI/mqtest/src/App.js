import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/auth" component={AuthPage} />
      </Switch>
    </Router>
  );
}

export default App;
