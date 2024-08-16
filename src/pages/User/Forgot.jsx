import React, { useState } from 'react';
import image from '../../assets/Screenshot 2024-07-03 134235.png';
import { useForm } from 'react-hook-form';
import { forgotOtp, googleUpdate, resendOtp } from '../../api/user';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { unAvailable } from '../../redux/slices/form';
import { verified } from '../../redux/slices/otpSlice';
import { Delete } from '../../redux/slices/forgotEmailSlice';

const ForgotComponent = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  const [loading, setLoading] = useState()
  const[email,setEmail]=useState()
  const location=useLocation()
  const navigate=useNavigate()
  const dispatch=useDispatch()

  const submitForm = async (data) => {
    try {
      const {email } = data
       const purpose="changePassword"
      setLoading(true)
      // const response = await resendOtp(email)
      const response = await forgotOtp(email)
      console.log("heyy",response);

     if (response.data.status === 'success') {
      setEmail(email)
      dispatch(verified("otpPageVerification"))
      navigate('/otp', { state: { email,purpose } })
     
    }
    } catch (error) {
      console.log("error found",error);
     if(error.response.data.message==="User not found"){
      toast.error("user not found")
     }

    } finally {
      setLoading(false)
    
    }
  }
  return (
    <div className="p-4 md:p-6 prose dark:prose-invert min-h-screen flex flex-col md:flex-row">
      <div className="flex flex-1 justify-center items-center relative bg-gray-200 p-4 hidden md:flex">
        <img src={image} alt="Screenshot" className="w-3/4 max-w-xs h-auto rounded-2xl" />
      </div>
      <div className="flex flex-1 justify-center items-center bg-zinc-100 p-4 md:p-6">
        <div className="max-w-xs w-full">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center font-stardos">WE TALKS</h1>
          <form onSubmit={handleSubmit(submitForm)} className="space-y-3 md:space-y-4">
            <p className='text-blue-500'>we sent an otp to your email</p>
          <input id='email' {...register('email', {
              required: "email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "email is not valid"
              },
              onChange: (e) => setValue('email', e.target.value.trim())
            })} type="email" placeholder="Email" className="w-full p-2 md:p-3 border border-zinc-300 rounded-2xl" />
            
            <button className="w-full bg-gradient-to-r from-zinc-700 to-zinc-900 text-white py-2 md:py-3 rounded-2xl">
              send Otp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotComponent;
