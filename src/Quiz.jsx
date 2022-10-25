import { useState } from 'react'

import './Quiz.css'

export default function Quiz(props) {

    const displayAnswer = props.answer.map(object => {
        const styles ={
            backgroundColor: object.isHeld ? "#D6DBF5" : "#1a1a1a"
        }
        return (<div style={styles} onClick={()=>props.handleClick(object.id)} className="answer-button" key={object.answer} >{object.answer}</div>)
     })
   return(
       <section>
           <h4>{props.question}</h4>
           {displayAnswer}
       </section>
   )
}