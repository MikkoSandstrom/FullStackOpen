import { useState } from 'react'

const StatisticsLine = ({text, value}) => {
  return <tr><td>{text}</td><td>{value}</td></tr>
}

const Button = ({handleClick,text}) => (
  <button onClick={handleClick}>{text}</button>
)

const Statistics = ({good, bad, neutral}) => {
  const all = good+bad+neutral 
  if (all==0) {
    return(  
      <div>
        <h1>statistics</h1> 
        <p>No feedback given</p>
      </div>
    )
  }
  const average = (good-bad)/all
  const positive = good/all*100+" %"
  return(  <div>
    <h1>statistics</h1> 
    <table>
      <tbody>
        <StatisticsLine text="good" value={good}/>
        <StatisticsLine text="neutral" value={neutral}/>
        <StatisticsLine text="bad" value={bad}/>
        <StatisticsLine text="all" value={all}/>
        <StatisticsLine text="average" value={average}/>
        <StatisticsLine text="positive" value={positive}/>
      </tbody>
    </table>
  </div>) 
}

  const App = () => {
    // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGood} text='good'/> 
      <Button handleClick={handleNeutral} text='neutral'/> 
      <Button handleClick={handleBad} text='bad'/> 
      <Statistics good={good} bad={bad} neutral={neutral}/>
    </div>
  )
}

export default App    