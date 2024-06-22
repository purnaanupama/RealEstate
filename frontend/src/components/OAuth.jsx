import {GoogleAuthProvider,getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/userSlice';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react'
import Delete from '../components/deleteSuccess';
import '../css/profile.css'

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showRegisterSuccess,setShowRegisterSuccess]=useState(false);
    const [loading,setLoading] = useState(false)
    const handleGoodleClick = async () => {
      try {
          setLoading(true); // Start loading when the popup is expected to open
          
          const provider = new GoogleAuthProvider();
          const auth = getAuth(app);
  
          // Attempt to sign in with popup
          const result = await signInWithPopup(auth, provider);
  
          console.log(result);
  
          const res = await fetch('/api/auth/google', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  name: result.user.displayName,
                  email: result.user.email,
                  photo: result.user.photoURL
              })
          });
  
          const data = await res.json();
          dispatch(signInSuccess(data));
  
          if (!data.method) {
              setShowRegisterSuccess(true);
              await new Promise(resolve => setTimeout(resolve, 4000));
              setShowRegisterSuccess(false);
              navigate('/');
          } else {
              navigate('/');
          }
      } catch (error) {
          // Handle specific error when the popup is closed by the user
          if (error.code === 'auth/popup-closed-by-user') {
              console.log("The popup was closed by the user.");
              // Optionally show a message or update UI to indicate the action
          } else {
              console.log('Could not sign in with Google', error);
              // Handle other errors
          }
      } finally {
          // Ensure loading is set to false regardless of success or failure
          setLoading(false);
      }
  }
  return (
   <>
    <button onClick={handleGoodleClick} 
    onMouseEnter={(e) => e.target.style.background = 'rgb(176, 7, 37)'}
    onMouseLeave={(e) => e.target.style.background = 'rgb(154, 9, 9)'}
    disabled={loading}
    type='button' style={{
    background:'rgb(154, 9, 9)',
    color:'white',
    width:'400px',
    border:'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor:'pointer',
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
    }}>Continue With Google  &nbsp;&nbsp;&nbsp;&nbsp;{loading?<img style={{width:'20px',borderRadius:'50%'}}  src="/assets/loading.gif" alt=""/>:<img style={{width:'20px',borderRadius:'50%'}} src="/assets/google.png" alt=""/>}</button>
   {showRegisterSuccess?<Delete/>:""}
   </>
  )
}

export default OAuth;