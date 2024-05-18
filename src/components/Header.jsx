import React from 'react'
import {FaSearch} from 'react-icons/fa'
import '../css/header.css';
import {Link} from 'react-router-dom'

const Header = () => {
  return (
    <header>
        <div className="Header-container">
        <Link className='link' to='/'>
        <h1 className="logo">
        <span className='first'>Estate</span>
        <span className='second'>Ease</span>
        </h1>
        </Link>
      
        <form>
            <FaSearch className='searchIcon'/>
            <input type="text" placeholder='Search...'/>
        </form>
        <ul className='menu'>
        <Link className='link' to='/'>
            <li>Home</li>
        </Link>
        <Link className='link' to='/about'>
            <li>About</li>
        </Link>
        <Link className='link' to='/sign-in'>
            <li>Sign in</li>
        </Link>
        </ul>
        </div>
       
       
    </header>
  )
}

export default Header;