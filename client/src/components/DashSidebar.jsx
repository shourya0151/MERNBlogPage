import { Sidebar } from "flowbite-react";
import {HiUser, HiArrowSmRight} from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import {useEffect, useState } from 'react'
import { signoutUserSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebar() {


    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch()
  
    useEffect(()=>{
      const urlParams = new URLSearchParams(location.search)
      const tabFromUrl = urlParams.get('tab')
      if(tabFromUrl){
        setTab(tabFromUrl)
      }
  
    },[location.search])


    const handleSignOut = async () => {
      try{
          const res = await fetch("/api/user/signout",{
              method: 'POST',
          });

          if(!res.ok){
              console.log(data.message);
          }
          else{
              dispatch(signoutUserSuccess());
          }

      }catch(err){
          console.log(err.message);
      }
  }

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          
            <Sidebar.Item href="/dashboard?tab=profile"active={tab === 'profile'} 
            icon={HiUser} 
            label={'User'} 
            labelColor='dark'>
            Profile
          </Sidebar.Item>
          
           
          
          <Sidebar.Item onClick={handleSignOut} icon={HiArrowSmRight} labelColor='dark' className='cursor-pointer'>
            SignOut
          </Sidebar.Item>
          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
