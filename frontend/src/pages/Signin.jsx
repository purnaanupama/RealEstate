import { useState } from 'react'
import '../css/signup.css'
import {Link, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure} from '../redux/userSlice'
import OAuth from '../components/OAuth'

const Signin = () => {
  //Initailize state and othe utilities
  const [formData,setFormData] = useState({})
  const {loading,error} = useSelector((state)=>state.user)
  const [error1,setError1] = useState(null);
  const [loading1,setLoading1] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //handle form data entering
  const handleChange = (e)=>{
   setFormData({
    ...formData,
    [e.target.id]:e.target.value,
   }) }

  //handle user signup
  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(!formData.email || !formData.password){
      return 
    }
    try {
      dispatch(signInStart())
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
        dispatch(signInSuccess(data));
        navigate('/')
        return
      }
      dispatch(signInFailure(data.message));
    } catch (error) {
      dispatch(signInFailure(error.message));
      console.log(error.message);
    }
  
  }

  const handleReset=async()=>{
    try {
      setLoading1(true)
      const res = await fetch('/api/auth/reset-password',{
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
      })
      const data = await res.json();
      console.log(data);
      if(data.status==='fail'){
        setLoading1(false)
        return setError1(data.message)
      }
      if(data.status==='success'){
        localStorage.setItem('Email',formData.email)
        navigate('/otp-reset-password')
        setLoading1(false)
      }
      setLoading1(false)
    } catch (error) {
      dispatch(signInFailure(error.message));
      setLoading1(false)
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
      <OAuth/>
         
      <div className="account">
        <p>Dont have an account ?  <Link to={'/sign-up'} className='link'>Sign-up</Link></p>
        {error==='Wrong credentials !'?<button disabled={loading1} className='link' onClick={handleReset}>{loading1?'Sending OTP code...':'Forgot password ? Reset-password'}</button>:""}
      </div>
        {error && <p className='error'>{error}</p>}
        {error1 && <p className='error'>{error1}</p>}
      </form>
    
    </div>
  )
}

export default Signin