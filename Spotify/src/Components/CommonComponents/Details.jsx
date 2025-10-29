import React from 'react'

function Details({headline, imgSrc, onClick}) {
  return (
    <div>
        <img src={imgSrc} onClick={onClick}></img>
        <h3>{headline}</h3><br/>
    </div>
  )
}

export default Details