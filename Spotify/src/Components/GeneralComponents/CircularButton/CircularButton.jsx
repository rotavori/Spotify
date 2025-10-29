import React from 'react'

function CircularButton({onClick, label, backgroundColor, color}) {
  return (
    <div>
      <button onClick={onClick} style={{backgroundColor: backgroundColor, color: color}}>{label}</button>
    </div>
  )
}

export default CircularButton