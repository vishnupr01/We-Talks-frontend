import React, { useState } from 'react';
import image from '../../assets/Screenshot 2024-07-03 134235.png';
import { useForm } from 'react-hook-form';
import { googleUpdate } from '../../api/user';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { unAvailable } from '../../redux/slices/form';

const FormComponent = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  const [loading, setLoading] = useState()
  const [doberror,setDoberror]=useState()
  const location=useLocation()
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const { _id } = location.state
  const submitForm = async (data) => {
    try {
      const { userName, dob } = data
      console.log(_id);
       
      setLoading(true)
      const response = await googleUpdate(
        _id,
        userName,
        dob,
      )
      console.log(response);
     console.log("status",response.data.status);
      if (response.data.status === 'success') {
        dispatch(unAvailable())
        navigate('/')
        return
      }
    } catch (error) {
      console.log("error found",error);
      if (error.response.data.message === "EMAIL_ALREADY_EXISTS") {
        console.log("hey");
        toast.error("email already exists")
      } else if(error.response.data.message==="enter the correct date"){
        const doberror="you must be at least 16 years old"
        setDoberror(doberror)
        console.log(error);
      }else{

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
            <input id='userName'{...register('userName', {
              required: "field is required",
              pattern: {
                value: /^[a-zA-Z0-9]{3,20}$/,
                message: "Username must be 3-20 characters long and contain only letters and numbers",
              },
              onChange: (e) => setValue('userName', e.target.value.trim())


            })} type="text" placeholder="Username" className="w-full p-2 md:p-3 border border-zinc-300 rounded-2xl" />
            <input id='dob' {
              ...register('dob', { required: "this field is required", onChange: (e) => setValue('dob', e.target.value.trim()) })
            } type="date" placeholder="Date of Birth" className="w-full p-2 md:p-3 border border-zinc-300 rounded-2xl" />
            {doberror&&<p className='text-red-500'>{doberror}</p>}
            <button className="w-full bg-gradient-to-r from-zinc-700 to-zinc-900 text-white py-2 md:py-3 rounded-2xl">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormComponent;
