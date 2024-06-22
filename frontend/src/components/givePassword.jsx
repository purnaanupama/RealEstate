import {useState,useEffect} from 'react'
import '../css/give-password.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure} from '../redux/userSlice.jsx';


const GPW = () => {
  //states
  const [formData, setFormData] = useState({});
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user)

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
      dispatch(updateUserStart());
      setLoading(true)
      const res = await fetch('/api/auth/give-password',{
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify({
          data:formData,
          email: currentUserEmail,
          currentEmail : currentUser.email
        }),
      });
      const data = await res.json();
      console.log(data);
      if(data.status==="success")
          {
            setError(null)
            setLoading(false)
            dispatch(updateUserSuccess(data.data))
            navigate('/profile')
            return;
          }
        setError(data.message);
        setLoading(false)
        dispatch(updateUserFailure(data.message));
      
    } catch (error) {
      setError(error.message)
      setLoading(false)
      console.log(error.message);
    }
  }
  return (
    <div className='gpw'>
        
        <form className='form-password'>
        <h3>
          <span style={{ color: 'rgb(25, 11, 134)', fontSize: 25 }}>Estate</span>
          <span style={{ color: 'rgb(106, 107, 109)', fontSize: 25 }}>Ease</span>
        </h3>
        <p>You should provide a new password when changing the account email.</p>
        <input type='password' placeholder='Enter Password' className='enterPW' id='enter_password' onChange={handleChange}/>
        <input type='password' placeholder='Confirm Password' className='confirmPW' id='confirm_password' onChange={handleChange}/>
        <button disabled={loading} type='submit' onClick={handleSubmit}>{loading?'loading...':'Confirm'}</button>
        {error?<p style={{fontSize:'14px',color:'#C20C06'}}>{error}</p>:""}
        </form>
     
    </div>
  )
}

export default GPW;