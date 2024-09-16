import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useState } from 'react';//use navigate to route user to sigin page or any other page


export default function Signup() {
  //create state 
  const [formData,setFormData] = useState({});
  const [errorMessage,setErrorMessage] = useState(null);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  




  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value.trim()});
    console.log(e.target.id);
  };
  

  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!formData.username||
       !formData.email || 
       !formData.password)
    {
      return setErrorMessage('Please fill out all fields.');
    }
    try{
      setLoading(true);
      setErrorMessage(null);
      //inorder to avpid writing localhost 300 use proxy in 
      //in vit.config.js
      //
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        setLoading(false);
        return setErrorMessage("User already exists!")
      }
      setLoading(false);
      if(res.ok){
        navigate('/sign-in');
      }
      
    }catch(err){
      setErrorMessage(err.message);
      setLoading(false);
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
          <p className='text-sm mt-5'>You can sign up using email and 
            password or using your google account
          </p>

        </div>

        {/*right side*/}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your username'></Label>
              <TextInput
              type='text'
              placeholder='Username'
              id='username' onChange={handleChange}></TextInput>
            </div>
            
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
              placeholder='Your password'
              id='password' onChange={handleChange}></TextInput>
            </div>

            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {
                loading ? (
                  <>{/* inside bracket because of more than one http elements */}
                    <Spinner size='sm'/>
                    <span>Loading...</span>
                  </>
                ): 'Sign Up'
              }  
            </Button>
            
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>
              Sign In
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
