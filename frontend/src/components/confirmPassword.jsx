import '../css/confirmPassword.css';
import { useSelector } from 'react-redux'

const CP = ({handleConfirmBox, handleDelete,handlePassChange}) => {

  const {currentUser} = useSelector((state) => state.user)
 const handleClick=()=>{
    handleConfirmBox(false)
 }
 const handleDeleteAccount=()=>{
    handleDelete();
 }
 const handlePasswordChange=(e)=>{
   handlePassChange(e);
 }
  return (
    <div className='confirmBox'>
       <div className="box">
        <img onClick={handleClick} src="assets/cross.png" alt="close"/>
{currentUser.type !== 'google'?
<>
<p>Confirm your Estate-Ease account password to delete account</p>
          <form className='deleteConfirmForm'>
            <input type="password" placeholder='Enter password' id='confirmPass' onChange={handlePasswordChange}/>
            <div className="btnSet12">
            <button onClick={handleDeleteAccount} className='conf' type='button'>Confirm</button>
            <button onClick={handleClick} className='canc' type='button'>Cancel</button>
            </div>
          </form>
</> : 
<>
<p>Are you sure you want to delete this account ?</p>
<div className="btnSet13">
<button onClick={handleDeleteAccount} className='conf' type='button'>Confirm</button>
<button onClick={handleClick} className='canc' type='button'>Cancel</button>
</div>
</>
}
       </div>
    </div>
  )
}

export default CP;