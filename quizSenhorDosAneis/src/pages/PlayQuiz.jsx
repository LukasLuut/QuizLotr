import "./PlayQuiz.css";
import exampleImg from "../assets/images/rivendell.webp";
import Map from '../components/Map'
import BoxMap from '../assets/images/map-box.png'
import MapBox from "../components/MapBox";
import bgShire from "../assets/videos/Hobbington.mp4";
import QuizContainer from "../components/layout/QuizContainer";

function Quiz() {
  return (
    <div className="quiz-page">
     <QuizContainer></QuizContainer> 
      
        {/* <MapBox ></MapBox> */}
          
      
          <video  className="bg-video2" autoPlay muted loop playsInline>
            <source src={bgShire} type="video/mp4" />
          </video>
    </div>
      
  );
}

export default Quiz;