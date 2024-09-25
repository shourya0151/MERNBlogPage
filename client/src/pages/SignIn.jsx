import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useState } from 'react';//use navigate to route user to sigin page or any other page
//using redux tool kit  instead of react state

import { useDispatch,useSelector } from 'react-redux';
import { SignInStart, SignInFailure, SignInSuccess } from '../redux/user/userSlice';
import OAuth  from '../components/oAuth'


export default function Signin() {
  //initialize dispatch
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector(state => state.user);
  //create state 
  const [formData,setFormData] = useState({});
  // const [errorMessage,setErrorMessage] = useState(null);
  // const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  




  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value.trim()});
    
  };
  console.log(formData);
  

  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!formData.email || 
       !formData.password)
    {
      return dispatch(SignInFailure("Please fill out all the fields."));
    }
    try{
      dispatch(SignInStart());
      // setLoading(true);
      // setErrorMessage(null);//insead of use react redux
      //inorder to avpid writing localhost 300 use proxy in 
      //in vit.config.js
      //
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(SignInFailure(data.message));
        // setLoading(false);
        // return setErrorMessage("Email or password entered is wrong!")
      }
      //setLoading(false);
      if(res.ok){
        dispatch(SignInSuccess(data));
        navigate('/');
      }
      
    }catch(err){
      dispatch(SignInFailure(err.message));
      // setErrorMessage(err.message);
      // setLoading(false);
    }
  }

  return (
    <div className='min-h-screen mt-36'>
      <div className='flex gap-5 p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
        {/*left side*/}
        <div className='flex-1'>
          <Link to="/" className="font-bold dark:text:white text-4xl">
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 
              via-purple-500 to-pink-500 rounded-lg text-white'>Shourya's</span>
              Blog
          </Link>
          <p className='text-sm mt-5'>You can sign in using email and 
            password or using your google account
          </p>

        </div>

        {/*right side*/}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            
            
            <div>
              <Label value='Your email'></Label>
              <TextInput
              type='email'
              placeholder='name@company.com'
              id='email' onChange={handleChange}></TextInput>
            </div>
            
            
            <div>
              <Label value='Your password'></Label>
              <TextInput
              type='password'
              placeholder='***********'
              id='password' onChange={handleChange}></TextInput>
            </div>

            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {
                loading ? (
                  <>{/* inside bracket because of more than one http elements */}
                    <Spinner size='sm'/>
                    <span>Loading...</span>
                  </>
                ): 'Sign In'
              }
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Dont't have an account?</span>
            <Link to='/sign-up' className='text-blue-500'>
              Sign Up
            </Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color="failure">
                {errorMessage}
              </Alert>
            ) 
          }
        </div>
      </div>
    </div>

  )
}
