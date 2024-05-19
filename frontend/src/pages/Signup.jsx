import React from 'react'
import '../css/signup.css'
import {Link} from 'react-router-dom'

const Signup = () => {
  return (
    <div className='signup'>
      <h1>Sign up</h1>
      <form className='form'>
      <input type="text" placeholder='username'
      className='text1' id='username'/>
      <input type="email" placeholder='email'
      className='text2' id='email'/>
      <input type="password" placeholder='password'
      className='text3' id='password'/>
      <button className='sign-up-btn'>Sign up</button>
     
      <div className="account">
        <p>Have an account ?  <Link to={'/sign-in'} className='link'>Sign-in</Link></p>
      </div>
     
      </form>
    
    </div>
  )
}

export default Signup