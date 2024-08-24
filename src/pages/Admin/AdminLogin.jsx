import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import login from '../../api/admin';
import { Adminlogin } from '../../redux/slices/admin';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false); // Initialize loading state

  const submitForm = async (data) => {
    try {
      const { email, password } = data;
      setLoading(true);
      const response = await login(email, password);
      console.log("hello",response);
      if (response.data.status === "success") {
        console.log("entering");
        dispatch(Adminlogin());
        navigate('/adminHome/dashboard');
      }else{
       
      }
    } catch (error) {
        if(error.response.data.message==="PASSWORD_INCORRECT"){
        console.log(error);
        toast.error("password is incorrect")
      }
      if(error.response.data.message==="Email is not valid"){
        console.log(error);
        toast.error("invalid email")
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-background dark:bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-primary font-stardos">WE TALKS</h1>
          </div>
          <form onSubmit={handleSubmit(submitForm)} className="bg-white border shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-center text-3xl font-bold mb-6 text-primary font-stardos">Admin Login</h2>
            <div className="mb-4">
              <input
                id='email'
                {...register('email', {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Email is not valid"
                  },
                  onChange: (e) => setValue('email', e.target.value.trim())
                })}
                type="email"
                placeholder="Email"
                className="w-full p-2 md:p-3 border border-zinc-300 rounded-2xl"
              />
              {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
            </div>
            <div className="mb-6">
              <input
                id='password'
                {...register('password', {
                  required: "Password is required",
                  onChange: (e) => setValue('password', e.target.value.trim())
                })}
                type="password"
                placeholder="Password"
                className="w-full p-2 md:p-3 border border-zinc-300 rounded-2xl"
              />
              {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-black from-primary to-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-primary"
              >
                {loading ? 'Loading...' : 'Log in'}
              </button>
            </div>
            <div className="text-center mt-4">
              <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-accent-foreground" href="#">Forgot password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
