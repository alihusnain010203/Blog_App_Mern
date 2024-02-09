import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

const SignUp = () => {
  return (
    <div className='min-h-screen mt-20 p-5'>
      <div className='flex w-full justify-evenly flex-col md:flex-row gap-5'>
            {/* left */}
            <div className='flex-1 flex justify-center items-center flex-col'>
            <Link to="/" className='text-xl md:text-4xl font-bold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Tech's Overflow</span>
            Blog
       </Link>
       <p className='text-sm mt-5'>This is a demo project you can SignUp with email password or with Google</p>
            </div>
            {/* right */}
            <div className='flex-1'>
                 <form className='flex flex-col gap-2'>
                  <div>
                    <Label value='username'></Label>
                    <TextInput type='text' placeholder='username'
                    id='username' />

                  </div>
                  <div>
                    <Label value='email'></Label>
                    <TextInput type='text' placeholder='e.g example@gmail.com'
                    id='email' />

                  </div>
                  <div>
                    <Label value='password'></Label>
                    <TextInput type='text' placeholder='password'
                    id='password' />

                  </div>
                  <Button gradientDuoTone='purpleToPink' type='submit'>Sign Up</Button>
                 </form>
                 <div className='flex gap-2 mt-5 text-sm'>
                      <span>Have an account?</span>
                      <Link to="/sign-in" className='text-blue-600'>Sign In</Link>
                 </div>
            </div>
        </div>
    </div>
  )
}

export default SignUp