import React from 'react'
import { useNavigate } from 'react-router-dom'
import CircularButton from '../GeneralComponents/CircularButton/CircularButton'

function Navigation() {
  const navigate = useNavigate()
  const homeOnClick = () => {
    navigate('/')
  }
  return (
    <div>
      <CircularButton
        onClick={homeOnClick}
        label={'Home'}
        backgroundColor={'Black'}
        color={'White'}
      />
    </div>
  )
}

export default Navigation