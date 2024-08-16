import React, { useRef, useState, useEffect } from 'react';
import { resendOtp, verifyOtp } from '../../api/user';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { unVerified } from '../../redux/slices/otpSlice';
import { visible } from '../../redux/slices/forgotslice';
import { Delete } from '../../redux/slices/forgotEmailSlice';

const Otp = () => {
  const inputRefs = useRef([]);
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [otp, setOtp] = useState('')
  const [otpErr, setOtpError] = useState()
  const [timeLeft, setTimeLeft] = useState(5*60);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { email,purpose } = location.state

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  const handleInputChange = (e, index) => {
    const value = e.target.value;
    const newOtp = otp.split('')
    newOtp[index] = value
    setOtp(newOtp.join(''))
    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendOtp = () => {
    setOtpError(null)
    setTimeLeft(5*60);
    setIsButtonDisabled(true);
    resendOtp(email)
    // Logic for resending OTP goes here
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("purpose", purpose);
      const response = await verifyOtp(email, otp);
      if (response.data.status === "success") {
        if (purpose === 'register') {
          console.log("register otp");
          navigate('/');
        } else if (purpose === 'changePassword') {
          console.log("hodfd");
          dispatch(visible());
          dispatch(unVerified)
          navigate('/changePassword', { state: { email } });
        }
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.message === "Invalid otp") {
        setOtpError("Invalid OTP");
      }
      if (error.response.data.message === "OTP expired") {
        setOtpError("OTP expired");
      }
    }
  };

  useEffect(() => {
    dispatch(Delete())
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 1) {
          return prevTime - 1;
        } else {
          clearInterval(timer);
          setIsButtonDisabled(false); // Enable the button when timer finishes
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-white">
      <div className="bg-card dark:bg-card-foreground p-8 rounded-lg shadow-md w-full max-w-md border border-primary dark:border-primary-foreground">
        <h2 className="text-center text-lg font-semibold mb-4 text-primary dark:text-primary-foreground">We sent an OTP to your email</h2>

        <p className="text-center text-sm text-secondary mb-4 dark:text-secondary-foreground">
          Time remaining: {formatTime(timeLeft)}
        </p>

        <form className="space-y-6">
          <div>
            {otpErr && <p className='text-rose-500'>{otpErr}</p>}
            <label htmlFor="otp" className="block text-sm font-medium text-secondary mb-2 dark:text-secondary-foreground">Enter the OTP</label>
            <div className="flex space-x-2 justify-center">
              {[0, 1, 2, 3].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-12 h-12 border rounded-md text-center text-lg text-primary dark:text-primary-foreground"
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <button onClick={handleSubmit} type="submit" className="bg-blue-400 text-accent-foreground py-2 px-4 rounded-md hover:bg-accent/80">Verify OTP</button>
          </div>
        </form>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isButtonDisabled}
            className={`mt-4 py-2 px-4 rounded-md ${isButtonDisabled ? 'bg-gray-400 text-accent-foreground hidden' : 'bg-black hover:bg-black-500 text-white'}`}
          >
            Resend OTP
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-secondary dark:text-secondary-foreground">Have an account? <a href="#" className="text-primary dark:text-primary-foreground hover:underline">Log in</a></p>
        </div>
      </div>
    </div>
  );

};

export default Otp;
