import openSocket from 'socket.io-client';
import Home from './components/Home';
import Lobbies from './components/Lobbies';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

const socket = openSocket('/');
function App() {
  return (
      <Router>
        <Link to="/">Home</Link>
        <Link to="/lobby">Lobby</Link>
        <Switch>
          <Route path="/lobby">
            <Lobbies socket={socket}/>
          </Route>
          <Route path="/">
            <Home socket={socket}/>
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
