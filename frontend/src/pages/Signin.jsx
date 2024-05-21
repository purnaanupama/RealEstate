import React, { useState } from 'react'
import '../css/signup.css'
import {Link, useNavigate} from 'react-router-dom'


const Signin = () => {
  //get the form inserted values into formData variable
  const [formData,setFormData] = useState({})
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e)=>{
   setFormData({
    ...formData,
    [e.target.id]:e.target.value,
   })
  }
  const handleSubmit = async(e) =>{
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signin',
        {
          method:'POST',
          headers : {
            'Content-Type':'application/json'
          },
          body:JSON.stringify(formData)
        }
      );
      const data = await res.json();
      console.log(data);
      if(data.email){
        setLoading(false);
        setError(null);
        navigate('/')
        return
      }
      setLoading(false);
      setError(data.message);
    } catch (error) {
      setLoading(false);
      setError(error.message)
      console.log(error.message);
    }
  
  }
  
  return (
    <div className='signup'>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit} className='form'>
      <input type="email" placeholder='email'
      className='text2' id='email' onChange={handleChange}/>
      <input type="password" placeholder='password'
      className='text3' id='password' onChange={handleChange}/>
      <button disabled={loading} className='sign-up-btn'>
             {loading?'Loading...':'Sign In'}
      </button>
         
      <div className="account">
        <p>Dont have an account ?  <Link to={'/sign-up'} className='link'>Sign-up</Link></p>
      </div>
        {error && <p className='error'>{error}</p>}
      </form>
    
    </div>
  )
}

export default Signin