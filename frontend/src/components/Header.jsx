import {useEffect, useState} from 'react'
import {FaSearch} from 'react-icons/fa'
import '../css/header.css';
import {Link, useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'

const Header = () => {
//useSelector is used to access the current state of redux store 
//state=>state.user recieves the entire redux store state and we can acess the currently logged in user
  const {currentUser} = useSelector(state=>state.user)
  const [searchTerm,setSearchTerm] = useState('')
  const navigate = useNavigate();
  const handleSubmit = (e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchItem',searchTerm)
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)
  }
  useEffect(()=>{
      const urlParams = new URLSearchParams(location.search)
      const searchItemFromUrl = urlParams.get('searchItem');
      if(searchItemFromUrl){
        setSearchTerm(searchItemFromUrl)
      }
  },[location.search])
  return (
    <header>
        <div className="Header-container">
        <Link className='link' to='/'>
        <h1 className="logo">
        <span className='first'>Estate</span>
        <span className='second'>Ease</span>
        </h1>
        </Link>
      
        <form onSubmit={handleSubmit}>
          <button type='submit' style={{border:'none',background:'none',display:'flex',cursor:'pointer'}}>
              <FaSearch className='searchIcon'/>
          </button>
            <input type="text" 
                   placeholder='Search...'
                   value={searchTerm}
                   onChange={(e)=>setSearchTerm(e.target.value)}
                   />
        </form>
        <ul className='menu'>
        <Link className='link' to='/'>
            <li>Home</li>
        </Link>
        <Link className='link' to='/about'>
            <li>About</li>
        </Link>
        
        <Link className='link' to='/profile'>
        {currentUser?(
          <li className='avatarContainer'><img className='avatar' src={currentUser.avatar} alt="profile" /></li>
        ):(
            <li>Sign in</li>
        )}

        </Link>
        </ul>
        </div>
       
       
    </header>
  )
}

export default Header;