import React from 'react'
import '../css/profile.css'
import { useSelector } from 'react-redux'

const Profile = () => {
  const {currentUser} = useSelector((state)=>state.user)
  return (
   <div className='profile'>
    <h1>Profile</h1>
    <form className='form1' action="">
      <img className='avatar1' src={currentUser.avatar} alt="profile_image" />
      <h3>{currentUser.role.toUpperCase()}</h3>
      <input type="text" placeholder='username'
      className='text2' id='username' />
      <input type="email" placeholder='email'
      className='text3' id='email'/>
      <input type="password" placeholder='password'
      className='text4' id='password'/>
      <button type='button' className='update'>Update</button>
    </form>
    <div className="options">
    <p>Delete Account</p>
    <p>Sign Out</p>
    </div>

   </div>
  )
}

export default Profile