import logo from './logo.svg';
import './App.css';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';

import './assets/css/App.css'
import Router from "./Router";

function App() {
  return (
    <div className="App">

      {/* <HomePage/> */}
      <Router/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    </div>
  );
}

export default App;
