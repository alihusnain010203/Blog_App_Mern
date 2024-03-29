import React, { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, DropdownHeader, DropdownItem, Navbar, NavbarCollapse, NavbarLink, NavbarToggle, TextInput } from 'flowbite-react'
import { useSelector,useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon} from 'react-icons/fa';
import {toogleTheme} from '../redux/themeSlice/themeSlice';

import { useLocation,useNavigate } from 'react-router-dom';
const Header = () => {
  const [searchTerm,setSearchTerm]=useState('');

  const navigate=useNavigate();  
  const dispatch=useDispatch();
   
    const {user}=useSelector(state=>state.user);
    const path=useLocation().pathname;
    const search=useLocation().search;

    const signOut=async ()=>{
     
      const response = await fetch('http://localhost:300/api/auth/signout',{
         method:'GET',
         headers:{
           "Content-Type":"application/json",
           "access_token":localStorage.getItem("access_token")
         }
       });
       
       const result = await response.json();
       if(result.message === 'Signout Successful'){
         localStorage.clear();
         window.location.href = '/sign-in';
       }
     }
     const handleSubmit=(e)=>{
      e.preventDefault();
      const urlParams = new URLSearchParams(search);  
      urlParams.set('searchTerm',searchTerm);
      const searchQuery = urlParams.toString();
      navigate(`/search?searchTerm=${searchTerm}`);
     }
     useEffect(() => {
     const urlParams = new URLSearchParams(search);
      const searchTerm = urlParams.get('searchTerm');
      if(searchTerm){
        setSearchTerm(searchTerm);
      };
     },[search])
   
  return (
    <Navbar className='border-b-2'>
       <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Tech's Overflow</span>
            Blog
       </Link>
       <form onSubmit={handleSubmit}>
        <TextInput 
        type='text'
        placeholder='Search'
        rightIcon={AiOutlineSearch}
        value={searchTerm}
        onChange={(e)=>setSearchTerm(e.target.value)}
       className='lg:inline w-[150px] md:w-[300px]'
        />
       </form>
       
       <div className='flex gap-2 md:order-2 justify-between w-full'>
   <Button className='w-12 h-10 ' color='gray' pill onClick={()=>{
    dispatch(toogleTheme()); 
   }} >
<FaMoon/>
   </Button>
   <Link  to={user ? '/dashboard?tab=profile' : 'sign-in'}>
    {
        user ? (<>
        <Dropdown
        arrowIcon={false}
        inline
        label={<Avatar
        alt='user'
        img={user.user.DPurl || 'https://via.placeholder.com/150'}
        rounded
        />}
        >

<DropdownHeader>
  <span className='text-sm block'>@{user.user.username}</span>
  <span className='font-medium block truncate'>@{user.user.email}</span>


</DropdownHeader>
<Link to='/dashboard?tab=profile'>
<DropdownItem>Profile</DropdownItem></Link>
<DropdownItem onClick={signOut}>Sign Out</DropdownItem>
        </Dropdown>
        </>) :<Button className='' gradientDuoTone={'purpleToBlue'} outline>
        Sign In
    </Button>
    }
   </Link>
    <NavbarToggle/>
       </div>
       <NavbarCollapse>
    <NavbarLink active={path==="/"} as={'div'}>
        <Link to="/">Home</Link> </NavbarLink>
        <NavbarLink active={path==="/about"} as={'div'}><Link to="/about">About</Link></NavbarLink>
        <NavbarLink active={path==="/projects"} as={'div'}><Link to="/projects">Projects</Link></NavbarLink>
        
   
   </NavbarCollapse> 
    </Navbar>
  )
}

export default Header