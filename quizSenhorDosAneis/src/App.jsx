import { Profiler, useState } from 'react'

import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Start from './pages/Start'
import Quiz from './pages/PlayQuiz'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Map from './components/Map'
import BtnQuestion from './components/buttons/btnQuestion'
import MapBox from './components/MapBox'
import QuizContainer from './components/layout/QuizContainer'
import Menu from './components/layout/Menu'
import Archivement from './components/Archivement'
import PopUpDTO from './components/PopUpDTO'
import MusicaArgonath from "./assets/audio/the-argonath-song.mp3";
import MusicaTheShire from "./assets/audio/the-shire-song.mp3";
import PlayerMusica from "./components/playerMusica/PlayerMusica";
import OptionProfile from './components/layout/OptionProfile';
import Final from './components/layout/Final';


function App() {
  const [musicaAtual, setMusicaAtual] = useState(null);

  return (
    <>  {/* Player sempre montado */}
      <PlayerMusica musica={musicaAtual}></PlayerMusica>

    <Router>
      <Routes>
        <Route path="/" element={<Start setMusicaAtual={setMusicaAtual}/>} />
        <Route path="/final" element={<Final setMusicaAtual={setMusicaAtual}/>} />
        <Route path="/option" element={<OptionProfile></OptionProfile>} />
        <Route path="/login" element={<Login setMusicaAtual={setMusicaAtual}/>} />
        <Route path="/profile" element={<Profile  setMusicaAtual={setMusicaAtual}/>} />
        <Route path="/quiz" element={<Quiz setMusicaAtual={setMusicaAtual}/>} />
      </Routes>
    </Router>
    </>
  )
}

export default App
