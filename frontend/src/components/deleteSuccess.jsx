import React from 'react'
import '../css/deleteSuccess.css'

const Delete = ({word}) => {
  return (
    <div className='cover'>
        <img src="assets/check.gif" alt="check_animation" />
        {
           word?<p className='message1'>{word}</p>:<p className='message1'>Successfully Registered</p>
        }
       </div>
  )
}

export default Delete;