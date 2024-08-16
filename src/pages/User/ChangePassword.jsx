import React, { useState } from 'react';
import image from '../../assets/Screenshot 2024-07-03 134235.png';
import { useForm } from 'react-hook-form';
import { changePassword, googleUpdate } from '../../api/user';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { unAvailable } from '../../redux/slices/form';
import { invisible } from '../../redux/slices/forgotslice';

const ChangePassword = () => {
  const { register, handleSubmit, setValue, formState: { errors },clearErrors } = useForm()
  const [loading, setLoading] = useState()
  const [passwordErr,setPasswordErr]=useState()
  const location=useLocation()
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const { email } = location.state
  const submitForm = async (data) => {
    try {
      const { newPassword,conPassword } = data 
      if(newPassword!==conPassword){
        setPasswordErr("password does not match")
        return
      }
      setLoading(true)
      const response = await changePassword(
       email,newPassword
      )
      console.log(response);
     console.log("status",response.data.status);
      if (response.data.data === true) {
        dispatch(unAvailable())
        dispatch(invisible())
        toast.success("password changed")
        navigate('/login')
        return
      }else{
        toast.error("update failed")
        return
      }
    } catch (error) {
      console.log("error found",error);

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
      
         <input id='newPassword'{
              ...register('newPassword', {
                required: " field is required",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character"
                },
                onChange: (e) => {
                  setValue('newPassword', e.target.value.trim())
                  clearErrors('newPassword')
                }
                
              })
            } type="password" placeholder="new  Password" className="w-full p-2 md:p-3 border border-zinc-300 rounded-2xl" />
            {errors.newPassword && <p className='text-red-500'>{errors.newPassword.message}</p>}
            {passwordErr&&<p className='text-red-600'>{passwordErr}</p>}
              <input id='conPassword'{
              ...register('conPassword', {
                required: " field is required",
                onChange: (e) => {
                  setValue('conPassword', e.target.value.trim(),
                   setPasswordErr(null))

                }
              })
            } type="password" placeholder="confirm Password" className="w-full p-2 md:p-3 border border-zinc-300 rounded-2xl" />
            <button className="w-full bg-gradient-to-r from-zinc-700 to-zinc-900 text-white py-2 md:py-3 rounded-2xl">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword
