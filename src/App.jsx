import { useState, useEffect } from 'react'
import { nanoid } from "nanoid"
import Quiz from './Quiz'
import Confetti from 'react-confetti'


import './App.css'

function App() {
  const [exam, setExam] = useState(0)
  const [startTest, setStartTest] = useState(false)
  const [question, setQuestion] = useState([])
  const [inquiry, setInquiry] = useState(generateAnswerArray())
  const [pass, setPass] = useState(false)
  const [answerCount, setAnswerCount]= useState([])

  useEffect(function(){
    fetch('https://opentdb.com/api.php?amount=3&type=multiple')
    .then(res => res.json())
    .then(data => setExam(data.results))
  }, [])

  function quizStart(){
    setStartTest(prevState => !prevState)
    const newArray = exam.map((object) => {
        return {
            question: object.question,
            answer: [object.correct_answer, ...object.incorrect_answers],
        }                        
    })
    setQuestion(newArray)
    setInquiry(generateAnswerArray())
  }

  function generateAnswerArray(){
    const testAnswer = question.map(object => {
      const answers = object.answer.map(object => {
        return {answer: object, isHeld:false, id:nanoid()}
      })
      return { question:object.question, answers}
    })
    return testAnswer
  }

  function holdAnswer(id) {
    console.log(id)
    console.log("before ", inquiry)
    
    setInquiry(oldInquiry => oldInquiry.map(object => {
      const allHeld = object.answers.every(object => !object.isHeld)
        const answers = object.answers.map(object => {
            return allHeld && object.id === id ? {...object, isHeld: !object.isHeld} : object
        })
        return {...object, answers}
      }))
  }

  function commonCount(array1, array2) {
    let count = 0
    for (let i = 0; i < array1.length; i++){
      for (let x = 0; x < array2.length; x++){
        if (array1[i] == array2[i]) {
          count++
          break
        }
      } 
    }
    return count
}
  
  function checkAnswers() {
    let totalAnswers = 0
    
    const correct_answers = []
    exam.map((object) => {
      correct_answers.push(object.correct_answer) 
      totalAnswers++
    })

    const selected_answers = []
    inquiry.map((object) => { object.answers.map(object => {
        if (object.isHeld === true) {
        selected_answers.push(object.answer) 
        }
    })
    })
    const amountCorrect = commonCount(correct_answers, selected_answers)

    if (amountCorrect === totalAnswers) {
      setPass(true)
      setAnswerCount([amountCorrect,totalAnswers])
    }
    console.log(answerCount)
  }
  
  const testElement = inquiry.map(quest => (
    <Quiz 
    key={quest.question}
    question={quest.question}
      answer={quest.answers}
    handleClick={holdAnswer}
    />
  ))

  
  return (
    <div className="App">
      {pass && <Confetti />}
      <h3>Quizical</h3>
      {!startTest && <p>My first run through creating a quiz. The goal will be to implement this in this TDG Esport's game features.</p>}
      {startTest && testElement}
      <button className="start-quiz" onClick={quizStart}>Start quiz</button>
      {startTest && <button className='start-quiz' onClick={checkAnswers}>Check answers</button>}
      {pass && <p>you have scored {answerCount[0] } / {answerCount[1]} correct answers </p>}

    </div>
  )
}

export default App
