import { useState } from 'react'
import '../css/signup.css'
import {Link, useNavigate} from 'react-router-dom'
import OAuth from '../components/OAuth'


const Signup = () => {
  //Initializing state and other utilities
  const [formData,setFormData] = useState({})
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  //handle form values entered
  const handleChange = (e)=>{
   setFormData({
    ...formData,
    [e.target.id]:e.target.value,
   })
  }
   
  //handle signup process with the backend
  const handleSubmit = async(e) =>{
  e.preventDefault();
  // Check if any field is empty
    if (!formData.username || !formData.email || !formData.password || !formData.password_confirm) {
        setError('All fields are required');
        return;}
  // Check if paswwords match
    if (formData.password !== formData.password_confirm) {
        setError('Passwords do not match');
        return;}
  // Check if username has 4 or more characters
    if ((formData.username).length < 4) {
        setError('username should be atleast 4 characters long');
        return;}
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup',
        {
          method:'POST',
          headers : {
            'Content-Type':'application/json'
          },
          body:JSON.stringify(formData)
        }
      )
      const data = await res.json();
      console.log(data);
      if(data.status === 'success'){
        setLoading(false);
        setError(null);
        console.log('Email:', data.data.email);
        localStorage.setItem('Email',data.data.email);
        navigate('/otp');
        return}

      setLoading(false);
      setError(data.message);} 
     catch (error) {
      setLoading(false);
      setError(error.message)
      console.log(error.message);
    }
  
  }

  return (
    <div className='signup'>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit} className='form'>
      <input type="text" placeholder='username'
      className='text1' id='username' onChange={handleChange}/>
      <input type="email" placeholder='email'
      className='text2' id='email' onChange={handleChange}/>
      <input type="password" placeholder='password'
      className='text3' id='password' onChange={handleChange}/>
      <input type="password" placeholder='confirm password'
      className='text3' id='password_confirm' onChange={handleChange}/>
      <button disabled={loading} className='sign-up-btn'>
             {loading?'Loading...':'Sign Up'}
      </button>
      <OAuth className='OAuth'/>
      <div className="account">
        <p>Have an account ?  <Link to={'/sign-in'} className='link'>Sign-in</Link></p>
      </div>
        {error && <p className='error'>{error}</p>}
      </form>
    
    </div>
  )
}


export default Signup