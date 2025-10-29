import React from 'react'
import Details from './Details'

function DetailsList({ lst, type, getImage}) {
  return (
    <div>
      <h1 >{type}</h1>
      <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '10px'
    }}>
        {lst.map(item =>
          <Details
            key={item.id}
            headline={item.name}
            imgSrc={getImage(item)}
            onClick={item.onClick} 
            />)}
      </div>
    </div>
  )
}

export default DetailsList