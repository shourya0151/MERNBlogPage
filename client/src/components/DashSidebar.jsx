import { Sidebar } from "flowbite-react";
import {HiUser, HiArrowSmRight} from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import {useEffect, useState } from 'react'


export default function DashSidebar() {


    const location = useLocation();
    const [tab, setTab] = useState('');
  
    useEffect(()=>{
      const urlParams = new URLSearchParams(location.search)
      const tabFromUrl = urlParams.get('tab')
      if(tabFromUrl){
        setTab(tabFromUrl)
      }
  
    },[location.search])

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
          
           
          
          <Sidebar.Item icon={HiArrowSmRight} labelColor='dark' className='cursor-pointer'>
            SignOut
          </Sidebar.Item>
          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
