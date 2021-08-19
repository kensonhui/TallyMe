import openSocket from 'socket.io-client';
import Home from './components/Home';
import Lobbies from './components/Lobbies';
import Feedback from './components/Feedback';
import About from './components/About'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

const socket = openSocket('/');
function App() {
  return (
      <div className="bg-gray-900 min-h-screen text-gray-50">
        <Router>
          <div className="bg-gray-900 flex items-baseline">
            <Link to="/" className="m-2 text-2xl">TallyMe</Link>
            <Link to="/lobby" className="m-2">Lobby</Link>
            <Link to="/about" className="m-2">About</Link>
            <Link to="/feedback" className="m-2">Feedback</Link>
          </div>
          <Switch>
            <Route path="/lobby">
              <Lobbies socket={socket}/>
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/feedback">
              <Feedback />
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
