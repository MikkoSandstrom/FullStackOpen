
const Course = ({course}) => {
  return( <div>
    <Header name={course.name}/>
    <Content parts={course.parts}/>
  </div>)
}

const Part = ({part}) => (
  <p>{part.name} {part.exercises}</p>
)

const Header = (props) => {
  return <h2>{props.name}</h2>
}

const Content = ({parts}) => {
  return(
  <div>
    {parts.map(part =>
      <Part key={part.id} part={part}/>)}
    <Total parts={parts}/>
  </div>
  )
}

const Total = ({parts}) => (
  <b>total of {parts.reduce((s,p)=> s+p.exercises,0)} exercises</b>
)

export default Course