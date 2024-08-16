import React, { useState } from 'react'
import image from '../../assets/Screenshot 2024-07-03 134235.png'
import { useForm } from 'react-hook-form'
import signUp, { googleSignUp } from '../../api/user'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { verified } from '../../redux/slices/otpSlice'
import Spinner from '../../Components/User/Spinner'
import { toast } from 'react-toastify'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from "jwt-decode";
import { login, setUser } from '../../redux/slices/home'
import { available } from '../../redux/slices/form'



const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [passwordError, setPasswordError] = useState()
  const [isLoading, setLoading] = useState(false)
  const [email, setEmail] = useState()
  const [errorDob,setDoberror]=useState()
  const [userError,setError]=useState()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  const submitForm = async (data) => {
    try {
      const { email, password, conpass, userName, name, dob } = data
      const purpose="register"
      let errors = false
      if (password !== conpass) {
        setPasswordError("password does not match")
        errors = true
      }
      if (errors) {
        return null
      }
      setLoading(true)
      const response = await signUp(
        email,
        userName,
        name,
        dob,
        password

      )
      if (response.data.status === 'success') {
        setEmail(email)
        dispatch(verified("otpPageVerification"))
        navigate('/otp', { state: { email,purpose } })

      }
    } catch (error) {
      console.log(error.response.data.message);
      if (error.response.data.message === "EMAIL_ALREADY_EXISTS") {
        console.log("hey");
        toast.error("email already exists")
      } else if(error.response.data.message==="userName already exists") {
         setError("userName is already taken")
      }else if(error.response.data.message==="enter the correct date"){
        const doberror="you must be at least 16 years old"
        setDoberror(doberror)
        console.log(error);
      }

    } finally {
      setLoading(false)
    }
  }
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential)
    console.log(decoded.email);
    setLoading(true)
    const gooleAuthenticated = true
    const response = await googleSignUp(decoded.email, decoded.name)
    console.log("hoooo", response);
    // const { email, userName, name, _id, profileImg } = response.data.data
    const { email, userName, name, _id, profileImg,isBlocked } = response.data.data.user
    console.log("id got", _id)
    if (response.data.data.status === 'gooogle' && response.data.data.auth.verified) {
      const image_url = profileImg
      console.log(name)
      dispatch(login())
      dispatch(setUser({ email, _id, userName, image_url,isBlocked }));
      navigate('/home')
    } else {
      dispatch(available())

      navigate('/googleForm', { state: { _id } })
    }

  }
  const handleGoogleLoginError = () => {
    console.log('login failed');
    toast.error("google login failed")
  }
  return (

    <div className="p-4 md:p-6 prose dark:prose-invert min-h-screen flex flex-col md:flex-row">
      <div className="flex flex-1 justify-center items-center relative bg-gray-200 p-4 hidden md:flex">
        <img src={image} alt="Screenshot" className="w-3/4 max-w-xs h-auto rounded-2xl" />
      </div>
      <div className="flex flex-1 justify-center items-center bg-zinc-100 p-4 md:p-6">
        <div className="max-w-xs w-full">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center font-stardos">Sign Up</h1>
          <form onSubmit={handleSubmit(submitForm)} className="space-y-3 md:space-y-4">
            <input id='email' {...register('email', {
              required: "email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "email is not valid"
              },
              onChange: (e) => setValue('email', e.target.value.trim())
            })} type="email" placeholder="Email" className="w-full p-2 md:p-3 border border-zinc-300 rounded-2xl" />
            {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
            {userError&&<p className='text-rose-500'>{userError}</p>}
            <input id='userName'{...register('userName', {
              required: "field is required",
              pattern: {
                value: /^[a-zA-Z0-9]{3,20}$/,
                message: "Username must be 3-20 characters long and contain only letters and numbers",
              },
              onChange: (e) => setValue('userName', e.target.value.trim())


            })} type="text" placeholder="Username" className="w-full p-2 md:p-3 border border-zinc-300 rounded-2xl" />
             
            {errors.userName && <p className='text-red-500'>{errors.userName.message}</p>}
            <input id='name'
              {
              ...register('name', { required: " field required", onChange: (e) => setValue('name', e.target.value.trim()) })
              } type="text" placeholder="Name" className="w-full p-2 md:p-3 border border-zinc-300 rounded-2xl" />
            {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
            <input id='dob' {
              ...register('dob', { required: "this field is required", onChange: (e) => setValue('dob', e.target.value.trim()) })
            } type="date" placeholder="Date of Birth" className="w-full p-2 md:p-3 border border-zinc-300 rounded-2xl" />
            {errorDob&&<p className='text-red-500'>{errorDob}</p>}
            <input id='password'{
              ...register('password', {
                required: " field is required",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character"
                },
                onChange: (e) => setValue('password', e.target.value.trim())
              })
            } type="password" placeholder="Password" className="w-full p-2 md:p-3 border border-zinc-300 rounded-2xl" />
            {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
            <input id='conpass' {
              ...register('conpass', {
                required: "field is required",
                onChange: (e) => setValue('conpass', e.target.value.trim())
              })
            } type="password" placeholder="Confirm Password" className="w-full p-2 md:p-3 border border-zinc-300 rounded-2xl" />
            {passwordError && <p className='text-red-500'>{passwordError}</p>}
            <button
              className="w-full bg-gradient-to-r from-zinc-700 to-zinc-900 text-white py-2 md:py-3 rounded-2xl flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading && <span className="spinner mr-2"></span>}
              <span>{isLoading ? 'Registering...' : 'Sign up'}</span>
            </button>
          </form>

          <div className="my-1 md:my-2 text-center text-zinc-500">OR</div>
          <div className='ml-14'>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
            />;
          </div>
          <div className="text-center mt-2 md:mt-4 text-zinc-500">Already have an account? <a href="/login" className="text-blue-600">Log in</a></div>
        </div>
      </div>
    </div>
  )
}

export default Signup
