import {useState,useEffect} from 'react'
import '../css/give-password.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { SignInClear} from '../redux/userSlice'


const RPW = () => {
  //states
  const [formData, setFormData] = useState({});
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  useEffect(() => {
    const currentUserEmail = () => {
      const storedValue = localStorage.getItem('Email');
      setCurrentUserEmail(storedValue);
    };
    currentUserEmail();
  }, []);

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      setLoading(true)
      const res = await fetch('/api/auth/give-password',{
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify({
          data:formData,
          email: currentUserEmail,
          currentEmail : 'reset'
        }),
      });
      const data = await res.json();
      console.log(data);
      if(data.status==="success")
          {
            setError(null)
            setLoading(false)
            dispatch(SignInClear())
            navigate('/sign-in')
            return;
          }
        setError(data.message);
        setLoading(false)
        dispatch(SignInClear())
      
    } catch (error) {
      setError(error.message)
      setLoading(false)
      console.log(error.message);
      dispatch(SignInClear())
    }
  }
  return (
    <div className='gpw'>
        
        <form className='form-password'>
        <h3>
          <span style={{ color: 'rgb(25, 11, 134)', fontSize: 25 }}>Estate</span>
          <span style={{ color: 'rgb(106, 107, 109)', fontSize: 25 }}>Ease</span>
        </h3>
        <p>Enter your new password</p>
        <input type='password' placeholder='Enter Password' className='enterPW' id='enter_password' onChange={handleChange}/>
        <input type='password' placeholder='Confirm Password' className='confirmPW' id='confirm_password' onChange={handleChange}/>
        <button disabled={loading} type='submit' onClick={handleSubmit}>{loading?'loading...':'Reset'}</button>
        {error?<p style={{fontSize:'14px',color:'#C20C06'}}>{error}</p>:""}
        </form>
     
    </div>
  )
}

export default RPW;