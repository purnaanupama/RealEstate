import '../css/profile.css'
import { useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../../firebase.js'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess} from '../redux/userSlice.jsx';
import { useDispatch } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import Delete from '../components/deleteSuccess.jsx';

const Profile = () => {
  const { currentUser,loading,error } = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [filePerc, setFilePerc] = useState(0)
  const [file, setFile] = useState(undefined)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [showDeleteSuccess,setShowDeleteSuccess]=useState(false);
  const [formData, setFormData] = useState({
    email: currentUser.email,
    username : currentUser.username,
    avatar: currentUser.avatar
  })
  const [isVisible, setIsVisible] = useState(false)
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();




 useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

 
  useEffect(() => {
    if (filePerc === 100) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setFilePerc(0) // Reset filePerc after the message disappears
        setFile(undefined) // Reset file state to allow re-upload
       // window.location.reload() // Refresh the page
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [filePerc])

  useEffect(()=>{
    if(updateSuccess){
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
      }, 1500)

      return () => clearTimeout(timer)
    }
  })

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePerc(Math.round(progress))
      },
      (error) => {
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL })
        })
      }
    )
  }

  const handleFileChange = (e) => {
    setFileUploadError(false)
    setFilePerc(0) // Reset filePerc when a new file is selected
    setFile(e.target.files[0])
  }

  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
     });
  }
  const handleSubmit=async(e)=>{
   e.preventDefault();
    try {
     dispatch(updateUserStart());
     const res = await fetch(`/api/user/update/${currentUser._id}`,{
      method:'POST',
      headers : {
       'Content-Type':'application/json'
     },
      body:JSON.stringify(formData)
     })
    
     const data = await res.json();
     console.log(data);
     if(data.status==='email-change'){
      localStorage.setItem('Email',formData.email);
      console.log(formData.email);
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true);
      navigate('/otp-email-update')
      return
     }
     if(data.status === 'fail'){
       dispatch(updateUserFailure(data.message));
       return;
     }
     dispatch(updateUserSuccess(data))
     setUpdateSuccess(true);
    } catch (error) {
     dispatch(updateUserFailure(error.message));
     console.log(error);
    }
   }
   const handleDeleteAccount = async () => {
    try {
        // Show delete success message
        setShowDeleteSuccess(true);

        // Start the delete process (dispatch action)
        dispatch(deleteUserStart());

        // Wait for the timer to finish (4 seconds)
        await new Promise(resolve => setTimeout(resolve, 4000));

        // Proceed with the fetch request to delete the user
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
            method: 'DELETE'
        });

        const data = await res.json();

        if (data.success === false) {
            // Handle failure
            dispatch(deleteUserFailure(data.message));
            return;
        }

        // Handle success
        dispatch(deleteUserSuccess(data));
    } catch (error) {
        // Handle error
        dispatch(deleteUserFailure(error.message));
    } finally {
        // Hide delete success message after the operation
        setShowDeleteSuccess(false);
    }
};

  return (
    <div className='profile'>
      <h1>User Profile</h1>

      <form onSubmit={handleSubmit} className='form1'>
        <input
          onChange={handleFileChange}
          type='file'
          ref={fileRef}
          style={{ display: 'none' }}
          accept='image/*'
        />
        <img
          onClick={() => {
            fileRef.current.click()
          }}
          className='avatar1'
          src={currentUser.avatar}
          alt='profile_image'
        />
        <p>
          {fileUploadError ? (
            <span style={{ color: 'red' }}>Error Uploading Image</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span style={{ color: 'green',textAlign:'center'}}>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 && isVisible ? (
            <span style={{ color: 'green' }}>Upload Complete</span>
          ) : (
            ''
          )}
        </p>
        <h3>{currentUser?currentUser.role.toUpperCase():''}</h3>
        <input type='text' placeholder='username' defaultValue={currentUser.username} className='text2' id='username' onChange={handleChange}/>
        <input type='email' placeholder='email' className='text3' id='email' defaultValue={currentUser.email} onChange={handleChange}/>
        <input type='password' placeholder='password' className='text4' id='password' onChange={handleChange}/>
        <button type='submit' className='update'>
         {loading?'Loading...':'Update'}
        </button>
      </form>
      <div className='options'>
        <p onClick={handleDeleteAccount}>Delete Account</p>
        <p>Sign Out</p>
      </div>
      <p style={{color:'r#C70039',marginTop:'20px'}}>{error ? error: '' }</p>
      <p className='successMsg' style={{color:'rgb(15, 132, 87)',marginTop:'20px'}}>{updateSuccess ? 'Updated Successfully': '' }</p>
      {showDeleteSuccess?<Delete/>:''}
    </div>
  )
}

export default Profile