import logo from './logo.svg';
import './App.css';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import Header from './components/Header';
import './assets/css/App.css'
import Router from "./Router";

function App() {
  return (
    <div className="App">

      {/* <HomePage/> */}
      <Header/>
      <Router/>
    </div>
  );
}

export default App;
