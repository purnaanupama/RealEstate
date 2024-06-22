import { useEffect, useState } from 'react';
import '../css/OTP_form.css';
import { useNavigate } from 'react-router-dom';

const ResetPW = () => {
  // State initialization
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [loading2, setLoading2] = useState(false);
  const [otpTimer, setOtpTimer] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if(otpTimer){
        const timer = setTimeout(() => {
          setOtpTimer(false);
        }, 120000);
        // Cleanup the timer on component unmount or if loading2 changes
     return () => clearTimeout(timer);
    }
    
  }, [otpTimer]);

  useEffect(() => {
    const currentUserEmail = () => {
      const storedValue = localStorage.getItem('Email');
      setCurrentUserEmail(storedValue);
    };
    currentUserEmail();
  }, []);



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      setError('All fields are required');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/auth/account-verify', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.status === 'success') {
        setLoading(false);
        setError(null);
        navigate('/reset-password');
        return;
      }
      setLoading(false);
      setError(data.message);
    } catch (error) {
      setLoading(false);
      setError(error.message);
      console.log(error.message);
    }
  };

  const resendOTP = async () => {
    try {
      setLoading2(true);
      setOtpTimer(true);
      const res = await fetch('/api/auth/signup',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'user', password: '1234', email: currentUserEmail }),
      });
      const response = await res.json();
      console.log(response);
      if (response.status === 'success') {
        setLoading2(false);
        return;
      }
      setLoading2(false);
      setError(response.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="otp_form_page">
      <form className="otp_form">
        <h3>
          <span style={{ color: 'rgb(25, 11, 134)', fontSize: 25 }}>Estate</span>
          <span style={{ color: 'rgb(106, 107, 109)', fontSize: 25 }}>Ease</span>
        </h3>
        <div className="wrapper">
          <h3>Verify email address to reset Password</h3>
          <p style={{ fontSize: 14 }}>
            To reset your password please enter the OTP code sent to :{' '}
            <span style={{ color: 'purple', fontWeight: 600 }}>{currentUserEmail}</span>{' '}
          </p>
          <div className="wrapper2">
            <input id="otp" type="text" placeholder="Enter OTP Code..." maxLength={6} pattern="[0-9]" onChange={handleChange} />
            <button type="submit" disabled={loading} onClick={handleSubmit}>
              {loading ? 'Verifying User...' : 'Verify Account'}
            </button>
            {error && <p className="error1">{error}</p>}
          </div>
        </div>
        <button className="resend" disabled={loading2 || otpTimer} onClick={resendOTP}>
          {loading2 ? 'Sending OTP...' : 'Resend OTP'}{otpTimer?<span style={{color:'black'}}> -- Wait 120 seconds to request for another OTP code</span>:""}
        </button>
      </form>
    </div>
  );
};

export default ResetPW;