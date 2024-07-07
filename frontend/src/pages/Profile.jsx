import '../css/profile.css'
import { useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../../firebase.js'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, SignOutUserStart, SignOutUserFailure, SignOutUserSuccess} from '../redux/userSlice.jsx';
import { useDispatch } from 'react-redux';
import { Link,useNavigate} from 'react-router-dom';
import Delete from '../components/deleteSuccess.jsx';
import CP from '../components/confirmPassword.jsx'

const Profile = () => {
  const { currentUser,loading,error } = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const[error1,setError1] = useState(false)
  const [filePerc, setFilePerc] = useState(0)
  const [file, setFile] = useState(undefined)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [showDeleteSuccess,setShowDeleteSuccess]=useState(false);
  const [showConfirmBox,setShowConfirmBox]=useState(false);
  const [formData, setFormData] = useState({
    email: currentUser.email,
    username : currentUser.username,
    avatar: currentUser.avatar
  })
  const [confirmPass, setConfirmPass] = useState({});
  const [isVisible, setIsVisible] = useState(false)
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const [showDelete,setShowDelete] = useState("");
  const [listings,setListings]=useState([]);
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
  const handlePasswordChange=(e)=>{
    setConfirmPass({
      ...confirmPass,
      [e.target.id]:e.target.value
    })
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
    
        // Start the delete process (dispatch action)
        dispatch(deleteUserStart());

        // Proceed with the fetch request to delete the user
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
            method: 'DELETE'
            ,headers : {
              'Content-Type':'application/json'
            },
             body: JSON.stringify({email:currentUser.email,pass:confirmPass})
        });
        console.log(confirmPass);
        const data = await res.json();
       if(data.status==='success'){
                setShowConfirmBox(false)
                //set to true
                setShowDelete("Account Deleted");
                 // Show delete success message
                setShowDeleteSuccess(true);
                 // Wait for the timer to finish (4 seconds)
                 await new Promise(resolve => setTimeout(resolve, 4000));
                 //set false
                setShowDelete("");
       }

        else if (data.success === false) {
            // Handle failure
            dispatch(deleteUserFailure(data.message));
            setShowConfirmBox(false)
            return;
        }
        else if(data.status === 'fail'){
            // Handle failure
            dispatch(deleteUserFailure(data.message));
            setShowConfirmBox(false)
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
 const handleSignOut=async()=>{
    try {
     dispatch(SignOutUserStart());
     const response = await fetch('/api/auth/signout');
     const data = await response.json();
     if(data.success === false){
      dispatch(SignOutUserFailure(data.message))
      return;
     }
     dispatch(SignOutUserSuccess(data))
    } catch (error) {
      dispatch(SignOutUserFailure(error.message))
    }
 }

 const handleConfirmBox =(state)=>{
    setShowConfirmBox(state);
 }
 const handleShowListings=async()=>{
  try {
    setError1(false)
    const res = await fetch(`/api/user/listings/${currentUser._id}`);
    const data = await res.json();
    if(data.status==='fail'){
      setError1(true);
      console.log("collecteda");
      return
    }
    setListings(data);
  } catch (error) {
    setError1(true)
  }
 }
 const handleListingDelete=async(listingId)=>{
     try {
      const response =await fetch(`/api/listing/delete/${listingId}`,{
        method:'DELETE',
     })
     const data = await response.json();
     if(data.success === false){
      console.log(data.message);
      return;
     }
     setListings(prev=>prev.filter(item=>item._id !== listingId))
     } catch (error) {
      console.log(error.message);
     }
 }

  return (
    <div className='profile'>
      <h1 className='superTitle'>User Profile</h1>

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
        {currentUser.type === 'google'?"":
          <input type='password' placeholder='password' className='text4' id='password' onChange={handleChange}/>
        }
        <button disabled={loading} type='submit' className='update'>
         {loading?'Loading...':'Update'}
        </button>
        <Link to={"/create-listing"}>
          <button className='createListing'>Create Listing</button>
        </Link>
      </form>
      {updateSuccess ?<p className='successMsg' style={{color:'rgb(15, 132, 87)',border:'1px solid green',padding:'15px 30px', marginTop:'20px',borderRadius:'5px', background:'#D2F9D6',maxWidth: '400px'}}>Updated Successfully</p>:"" }
      {error?<p style={{color:'#C20C06',border:'1px solid #C20C06',padding:'15px 30px',marginTop:'20px',borderRadius:'5px', background:'#FAD9D8',maxWidth: '400px'}}>{error}</p>:""}
      <div className='options'>
        <p onClick={()=>{setShowConfirmBox(true)}}>Delete Account</p>
        <p onClick={handleSignOut}>Sign Out</p>
      </div>
       {showDeleteSuccess?<Delete word={showDelete}/>:''}
       {showConfirmBox?<CP handleConfirmBox={handleConfirmBox} handleDelete={handleDeleteAccount} handlePassChange={handlePasswordChange}/>:''}
       <button onClick={handleShowListings} type='button' className='showListings'>Show My Listings</button>
       {error1?<p style={{color:'#C20C06',border:'1px solid #C20C06',padding:'15px 30px',marginTop:'20px',borderRadius:'5px', background:'#FAD9D8',maxWidth: '400px'}}>{error1?'Error showing listings':''}</p>:""}
       <div className='listCartWrapper'>
       {listings.length > 0 && <h3 style={{color:'#5f6188',paddingBottom:'20px',fontWeight:'500'}}>Your Listings</h3>}
       {listings && listings.length > 0 && 
        listings.map((listing)=>{
          return(
            <div className='listingCard' key={listing._id}>
              <Link className='listingLink' to={`/listing/${listing._id}`}>
              <div className="listingWrapper">
              <img src={listing.imageUrls[0]} alt="image"/>
              <p>{listing.name}</p>
              </div>
              </Link>
              <div className="listingButtons">
              <Link to={`/update-listing/${listing._id}`}>
              <button>Edit</button>
              </Link>
              <button onClick={()=>handleListingDelete(listing._id)}>Delete</button>
              </div>
            </div>
          )
        })
       }
       </div>
      
    </div>
  )
}

export default Profile