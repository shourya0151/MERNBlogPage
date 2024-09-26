import { Avatar, Button, Dropdown, Navbar, NavbarToggle } from 'flowbite-react'
import { Link,useLocation } from 'react-router-dom';
import { TextInput } from 'flowbite-react';
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon,FaSun } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';




export default function Header() {
    const dispatch = useDispatch();
    const path = useLocation().pathname;
    const { currentUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    

   
    

  return (
    <Navbar className='border-b-2'>
        <Link to="/" className="self-center whitespace-nowrap text-sm
        sm:text-xl font-semibold dark:text:white">
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 
            via-purple-500 to-pink-500 rounded-lg text-white'>Shourya's</span>
            Blog
        </Link>

        <form>
            <TextInput
                type='text'
                placeholder='Search'
                rightIcon={AiOutlineSearch}
                className='hidden lg:inline'
            />
        </form>
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
            <AiOutlineSearch/>
        </Button>
        <div className='flex gap-2 md:order-2'>
            <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={()=>dispatch(toggleTheme())}>
                {theme === 'light' ? <FaMoon/> : <FaSun/>}
            </Button>
            {currentUser ? (
                <Dropdown
                    arrowIcon = {false}
                    inline
                    label={
                        
                        <Avatar
                            alt = 'user'
                            img = {currentUser.profilePicture}
                            rounded
                        />
                    }
                >
                    <Dropdown.Header>
                        <span className='block text-sm'>@{currentUser.username}</span>
                        <span className='block text-sm font-medium truncate'>
                            @{currentUser.email}</span>
                    </Dropdown.Header>
                    <Link to={'/dashboard?tab=profile'}>
                        <Dropdown.Item>Profile</Dropdown.Item>
                    </Link>
                    <Dropdown.Divider></Dropdown.Divider>
                    <Dropdown.Item>SignOut</Dropdown.Item>

                </Dropdown>
            ):
                <Link to='/sign-in'>
                <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-400 via-purple-500 to-pink-400 group-hover:from-purple-400 group-hover:via-purple-500 group-hover:to-pink-400 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Sign In
                    </span>
                </button>
                </Link>
            }
            
            <NavbarToggle/>
        </div>
        <Navbar.Collapse>
            <Navbar.Link active={path === '/'} as={'div'}>
                <Link to='/'>
                Home</Link>
            </Navbar.Link>
            <Navbar.Link active={path === '/about'} as={'div'}>
                <Link to='/about'>
                About</Link>
            </Navbar.Link>
            <Navbar.Link active={path === '/projects'} as={'div'}>
                <Link to='/projects'>
                Projects</Link>
            </Navbar.Link>
        </Navbar.Collapse>

    </Navbar>
  )
}
