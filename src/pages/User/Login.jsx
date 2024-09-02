import React, { useEffect, useState } from 'react'

import image from '../../assets/Screenshot 2024-07-03 134235.png'
import { useForm } from 'react-hook-form'
import { signIn } from '../../api/user'
import { useNavigate } from 'react-router-dom'
import { unVerified, verified } from '../../redux/slices/otpSlice'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../redux/slices/home'
import { toast } from 'react-toastify'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2'
import showBlockedAlert from '../../popups/alert'
import Spinner from '../../Components/User/Spinner'
import { Add } from '../../redux/slices/forgotEmailSlice'

const Login = () => {
  const [loading, setLoading] = useState()
  const [userError, setUserError] = useState()
  const [count, setCount] = useState()
  const [message, setMessage] = useState()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.authSlice.userInfo);
  useEffect(() => {
    console.log("setmessage")
    if (userInfo) {
      navigate('/home')

    }
  }, [navigate, count])
  const purpose="register"
  const submitForm = async (data) => {
    try {
      const { email, password } = data
      setLoading(true)

      const response = await signIn(email, password)
      console.log(response.data.data, "vishnu pr");
      if (response.data.data === "user is Blocked") {
        showBlockedAlert()
        return
      }
      if (response.data.data === "user is not verified") {
        Swal.fire({
          title: 'You are not verified',
          text: 'Sending OTP to your email.',
          icon: 'info',
          confirmButtonText: 'Send'
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch(verified("otpPageVerification"));
            navigate('/otp', { state: { email,purpose  } });
          }
        });
        return
      }
      if (response.data.status === "success") {
        dispatch(unVerified())
        navigate('/home')
      }

    } catch (error) {
      if (error.response.data.message === "PASSWORD_INCORRECT") {
        console.log(error);
        toast.error("password is incorrect")
      }
      if (error.response.data.message === "User not found")
        setUserError("User Not found")
    }
    finally {
      setLoading(false)
    }



  }

  const handleForgotPassword = () => {
    dispatch(Add())
    navigate('/forgotPassword');
  };

  return (
    <div className="p-4 md:p-6 prose dark:prose-invert min-h-screen flex flex-col md:flex-row">
      <div className="flex flex-1 justify-center items-center relative bg-gray-200 p-4 hidden md:flex">
        <img src={image} alt="Screenshot" className="w-3/4 max-w-xs h-auto rounded-2xl" />
      </div>
      <div className="flex flex-1 justify-center items-center bg-zinc-100 p-4 md:p-6">
        <div className="max-w-xs w-full">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center font-stardos">WE TALKS</h1>
          {userError && <p className='text-red-500 '>{userError}</p>}
          {message && <p className='text-green-600 '>{message}</p>}

          <form onSubmit={handleSubmit(submitForm)} className="space-y-3 md:space-y-4">
            {errors.email && <p className='ml-0 text-red-500'>{errors.email.message}</p>}
            <input id='email' {...register('email', {
              required: "email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "email is not valid"
              },
              onChange: (e) => setValue('email', e.target.value.trim())
            })} type="email" placeholder="Email" className="w-full p-2 md:p-3 border border-zinc-300 rounded-2xl" />

            <input id='password'{
              ...register('password', {
                required: " field is required",

                onChange: (e) => setValue('password', e.target.value.trim())
              })
            } type="password" placeholder="Password" className="w-full p-2 md:p-3 border border-zinc-300 rounded-2xl" />
            {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
            <button
              className="w-full bg-gradient-to-r from-zinc-700 to-zinc-900 text-white py-2 md:py-3 rounded-2xl flex items-center justify-center"
              disabled={loading}
            >
              {loading && <span className="spinner mr-2"></span>}
              <span>{loading ? 'Logging in...' : 'Log in'}</span>
            </button>

          </form>
{/* 
          <div className="my-1 md:my-2 text-center text-zinc-500">OR</div>
          <div className='ml-14'>
            <GoogleLogin
              onSuccess={credentialResponse => {
                const decoded = jwtDecode(credentialResponse.credential);
                console.log(decoded);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </div> */}
          <div className="text-center mt-2 md:mt-4">
            <button onClick={handleForgotPassword} className="text-zinc-500">Forgot password?</button>
          </div>
          <div className="text-center mt-2 md:mt-4 text-zinc-500">don’t have an account? <a href="/register" className="text-blue-600">Sign up</a></div>
        </div>
      </div>
    </div>
  )
}

export default Login
