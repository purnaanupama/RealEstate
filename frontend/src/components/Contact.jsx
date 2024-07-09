import {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'


const Contact = ({listing}) => {
  const [landowner,setLandowner] = useState(null)
  const [message,setMessage] = useState('')
  const onChange=(e)=>{
    setMessage(e.target.value)
  }
  useEffect(()=>{
   const fetchLandLord = async()=>{
    try{
       const res = await fetch(`/api/user/${listing.userRef}`)
       const data = await res.json();
       setLandowner(data)
    }catch(error){
       console.log(error);
    }
   }
   fetchLandLord();
  },[listing.userRef])
  return (
    <div>{landowner && (
      <div className="emailContent">
        <p>Contact <span  style={{fontWeight:'600',color:'navy'}}>{landowner.username}</span> for 
        <span style={{fontWeight:'600'}}> {listing.name.toLowerCase()}</span></p>
        <textarea  style={{ resize: 'none',width:'700px',height:'200px',padding:'10px 20px',marginTop:'20px'}} name="message" id="message" rows="2" value={message} onChange={onChange} placeholder='Enter your message here...'></textarea>
        <Link className='sendEmailButton' to={`mailto:${landowner.email}?subject=Regarding ${listing.name} &body=${message}`}>Send Message</Link>
      </div>  
    )}</div>
  )
}

export default Contact;