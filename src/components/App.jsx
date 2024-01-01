import { useEffect, useReducer } from "react"
import Header from "./Header"
import Mainc from "./Mainc"
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen"
import Question from "./Question";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";

let time_per_ques = 20; 
const initialState = {
  questions: [],  //  Fetching all the questions array
  status: 'loading',  //loading, error, ready, active, finished
  index: 0,  // current Question Index, 0 means First Question 
  answer: null,  // Checks the current Question's corrct Answer Index
  points: 0,  // Overall Added Points if the Answer in correct
  highscore: 0,  // Store the Highscore of each Round
  timeRemaining: null // Each quetion 30 seconds time to solve;
};
const reducer = (state, action) =>{
  switch(action.type){
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready'
      }
    case 'dataFailed':
      return{
        ...state,
        status: 'error'
      }
    case 'start':
      return{
        ...state,
        status: 'active',
        timeRemaining: state.questions.length * time_per_ques
      }
    case 'newAnswer':
      let currQuestion = state.questions[state.index];
      return{
        ...state, 
        answer: action.payload,
        points: action.payload===currQuestion.correctOption ? state.points + currQuestion.points : state.points
      }
    case 'nextQuestion':
      return{
        ...state,
        index: state.index + 1,
        answer: null
      }
    case 'finished':
      return{
        ...state,
        status: 'finished',
        highscore: state.points > state.highscore ? state.points : state.highscore
      }
    case 'restart':
      return{
        ...state,
        status: 'active',
        answer: null,
        index: 0,
        points: 0,
        timeRemaining: state.questions.length * time_per_ques
      }
    case 'timer':
      return{
        ...state, timeRemaining: state.timeRemaining > 0 ? state.timeRemaining - 1 : state.timeRemaining
      }
    default:
      throw new Error("Action Unknown");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {questions, status, index, answer, points, highscore, timeRemaining} = state;
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, curr) => prev+curr.points ,0)

  useEffect(function(){
    async function fetchQuestions(){
      try {
        const res = await fetch('http://localhost:8000/questions');
        const data = await res.json();
        dispatch({ type: 'dataReceived', payload: data });
      } catch (error) {
        dispatch({type: 'dataFailed'})
      }
    }
    fetchQuestions()
  }, [])

  function startQuiz(){
    dispatch({type: 'start'});
  }

  function setAnswer(index){
    dispatch({type: 'newAnswer', payload: index});
  }

  function nextQuestion(){
    dispatch({type: 'nextQuestion'});
  }

  function finishQuiz(){
    dispatch({type: 'finished'});
  }

  function handleRestart(){
    dispatch({type: 'restart'});
  }

  function updateTimer(){
    if(timeRemaining == 0){
      dispatch({type: 'finished'});
    }else{
      dispatch({type: 'timer'});
    }
  }

  return (
    <div className="app">
      <Header />

      <Mainc>
        {status==='loading' && <Loader/>}
        {status==='error' && <Error/>}
        {status=='ready' && <StartScreen numQuestions={numQuestions} startQuiz={startQuiz}/>}
        {status=='active'&& 
          <>
            <Progress numQuestions={numQuestions} qIndex={index} totalPoints={points} maxPoint={maxPossiblePoints} answer={answer}/>
            <Question question={questions[index]} answer={answer} dispatch={setAnswer}/>

            <footer>
              <Timer timeRemaining={timeRemaining} updateTimer={updateTimer}/>
              {(index < numQuestions-1 && answer != null) && <button className='btn btn-ui' onClick={nextQuestion}>Next</button>}
              {(index === numQuestions-1 && answer != null) && <button onClick={finishQuiz} className='btn btn-ui'>Finish</button>}
            </footer>
          </>
        }
        {status==='finished' && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highscore={highscore} handleRestart={handleRestart}/>}
      </Mainc>
    </div>
  )
}

export default App
