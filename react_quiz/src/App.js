import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Quiz from "./components/quiz";

function App() {
  return (
    <div className="App">
      <h3>MOLA Lab Task</h3>
      <BrowserRouter>
        <Routes>
          <Route path="/" element = {<Quiz/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
