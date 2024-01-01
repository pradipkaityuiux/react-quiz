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
import Counter from "./Counter";
import { db } from "../firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

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

  const questionsAll = [
    {
      question: "In what situation do we use a callback to update state?",
      options: [
        "When updating the state will be slow",
        "When the updated state is very data-intensive",
        "When the state update should happen faster",
        "When the new state depends on the previous state"
      ],
      correctOption: 3,
      points: 30
    },
    {
      question: "If we pass a function to useState, when will that function be called?",
      options: [
        "On each re-render",
        "Each time we update the state",
        "Only on the initial render",
        "The first time we update the state"
      ],
      correctOption: 2,
      points: 30
    },
    {
      question: "Which hook to use for an API request on the component's initial render?",
      options: ["useState", "useEffect", "useRef", "useReducer"],
      correctOption: 1,
      points: 10
    },
    {
      question: "Which variables should go into the useEffect dependency array?",
      options: [
        "Usually none",
        "All our state variables",
        "All state and props referenced in the effect",
        "All variables needed for clean up"
      ],
      correctOption: 2,
      points: 30
    },
    {
      question: "An effect will always run on the initial render.",
      options: [
        "True",
        "It depends on the dependency array",
        "False",
        "In depends on the code in the effect"
      ],
      correctOption: 0,
      points: 30
    },
    {
      question: "When will an effect run if it doesn't have a dependency array?",
      options: [
        "Only when the component mounts",
        "Only when the component unmounts",
        "The first time the component re-renders",
        "Each time the component is re-rendered"
      ],
      correctOption: 3,
      points: 20
    }
  ]

  useEffect(function(){
    async function fetchQuestions(){
      try {
        const questionArr = [];
        const querySnapshot = await getDocs(collection(db, 'questions'));
        querySnapshot.forEach((doc) => {
          const eachQu = JSON.parse(JSON.stringify(doc.data()));
          questionArr.push(eachQu);
        });
        dispatch({ type: 'dataReceived', payload: questionArr });


        // for(let i=0; i<questionsAll.length; i++){
        //   await setDoc(doc(db, "questions", `question${i+10}`), {
        //     correctOption: questionsAll[i].correctOption,
        //     options: questionsAll[i].options,
        //     points: questionsAll[i].points,
        //     question: questionsAll[i].question,
        //   });
        // }


        // const res = await fetch('http://localhost:8000/questions');
        // const data = await res.json();
        // dispatch({ type: 'dataReceived', payload: data });
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
      {/* <Counter /> */}

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
