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
      <div className="bg-gray-600 min-h-screen text-gray-50">
        <Router>
          <div className="bg-gray-700 flex">
            <Link to="/" className="m-2">Home</Link>
            <Link to="/lobby" className="m-2">Lobby</Link>
          </div>
          <Switch>
            <Route path="/lobby">
              <Lobbies socket={socket}/>
            </Route>
            <Route path="/">
              <Home socket={socket}/>
            </Route>
          </Switch>
            </Router>
      </div>
  );
}

export default App;
