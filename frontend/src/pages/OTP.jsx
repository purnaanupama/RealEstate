import {React,useState} from 'react';
import '../css/OTP_form.css';
import {Link, useNavigate} from 'react-router-dom'

const OTP=()=>{
//State initialize
const [formData,setFormData] = useState({});
const [error,setError] = useState(null);
const [loading,setLoading] = useState(false);
const navigate = useNavigate();
    const handleChange = (e)=>{
        setFormData({
         ...formData,
         [e.target.id]:e.target.value,
        })
       
       }

  const handleSubmit = async(e)=>{
   e.preventDefault();
   if (!formData.otp){
    setError('All fields are required');
    return;
   }
   try {
    setLoading(true);
    const res = await fetch('/api/auth/account-verify',
    {
      method:'PATCH',
      headers : {
        'Content-Type':'application/json'
      },
      body:JSON.stringify(formData)

    },
    console.log(formData)
  );
  const data = await res.json();
  console.log(data);
  if(data.status === 'success'){
    setLoading(false);
    setError(null);
    navigate('/sign-in');
    return;
   } 
   setLoading(false);
   setError(data.message);
  }catch (error) {
    setLoading(false);
    setError(error.message);
    console.log(error.message);
   }
}
    return(
        <div className='otp_form_page'>
            <form className='otp_form'>
                <h3>Enter OTP Here</h3>
                <input id='otp' type="text" placeholder='Enter OTP Code...' maxLength={4}  pattern="[0-9]" onChange={handleChange}/>
                <button type='submit'disabled={loading} onClick={handleSubmit} >{loading?'Send OTP':'SUBMIT'}</button>
                {error && <p className='error'>{error}</p>}
            </form>

        </div>
    )
}

export default OTP;