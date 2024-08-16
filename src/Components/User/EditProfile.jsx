import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserProfile, saveImage, updateProfile } from '../../api/userFunctions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import showBlockedAlert from '../../popups/alert';
import { Dialog } from '@headlessui/react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../helperFunctions/getCropped';
import convertBlobUrlToBase64 from '../../helperFunctions/blob';

const EditProfile = () => {
  const[profileImgLoading,setprofileImgLoding]=useState()
  const [imageError, setImageError] = useState()
  const [selectedImages, setSelectedImages] = useState([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [imageToCrop, setImageToCrop] = useState(null)
  const [bio, setBio] = useState('');
  const [userNameErr, setUserNameErr] = useState()
  const [buttonLoading, setButtonLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [displayName, setDisplayName] = useState()
  const [displayUserName, setDisplayUserName] = useState()
  const [gender, setGender] = useState('');
  const [userData, setData] = useState()
  const [img, setImg] = useState()
  const [loading, setLoading] = useState(true);
  const [dateErr, setDateErr] = useState()
  const [count, setCount] = useState(0);
  const fileInputRef =useRef(null);




  const handleFileButtonClick = (e) => {
    e.preventDefault()
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (event) => {
    console.log("entering change")
    const file = event.target.files[0];
    if (file) {
      setImageError('')
      console.log("entering condition");
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageToCrop(reader.result)
        setCropModalOpen(true)
        console.log(cropModalOpen);
      }
      reader.readAsDataURL(file)
     
    }
  }
  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  })

  const handleSaveCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels)
      console.log('ur', croppedImage)
      const base64Image = await convertBlobUrlToBase64(croppedImage);
      setSelectedImages([...selectedImages, base64Image])
      setprofileImgLoding(true)
      setCropModalOpen(false)
      const saveProfileImg=await saveImage(base64Image)
      console.log("profile Image got",saveProfileImg);
      if(saveProfileImg)
      fetchData()
      
    } catch (error) {
      console.log(error);
    }finally{
      setprofileImgLoding(false)
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  const fetchData = async () => {
    try {
      console.log("count", count);
      const response = await getUserProfile()
      if (response && response.data && response.data.data) {

        const userData = response.data.data;
        setDisplayName(userData.name)
        setDisplayUserName(userData.userName)
        setUserName(userData.userName);
        setName(userData.name);
        setBio(userData.bio);
        setDob(formatDate(userData.dob));
        setImg(userData.profileImg)
      }

    } catch (error) {
      if (error) {
        if (error.response.data.message === 'User is blocked') {
          showBlockedAlert()
          navigate('/login')
        }
      }
      throw error

    }
    finally {
      setLoading(false)

    }
  }
  useEffect(() => {

    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true)
    try {
      const response = await updateProfile(userName, name, bio, dob)
      console.log("got", response);
      if (response.data.status === "success") {
        await fetchData()
        toast.success("updated successfully")
      }
    } catch (error) {
      if (error) {
        if (error.response.data.message === 'User is blocked') {
          showBlockedAlert()
          navigate('/login')
        }
      }
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "userName already exists") {
          setUserNameErr("UserName is already taken");
        } else if (errorMessage === "enter the correct date") {
          setDateErr("Date of Birth is invalid");
        } else {
          console.error("An unexpected error occurred:", errorMessage);
        }
      } else {
        // Handle cases where error.response is undefined or does not have data
        console.error("An unexpected error occurred:", error);
      }
    }finally{
      setButtonLoading(false)
    }
  
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-200 text-black border flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex items-center space-x-4 mb-6">
          {profileImgLoading?(<p>loading...</p>):(  <img
            src={img}// Replace with user's profile picture URL
            alt="Profile"
            className="w-13 h-12 rounded-full"
          />)}
        
          <div>
            <h2 className="text-xl font-bold text-black">{displayUserName}</h2>
            <p className="text-gray-400">{displayName}</p>
          </div>
          <button onClick={ handleFileButtonClick} className="ml-auto bg-blue-500 text-white px-4 py-2 rounded">Change photo</button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="mb-4">

          <label htmlFor="userName" className="block text-sm font-medium">UserName</label>
          <input
            type="text"
            id="userName"
            maxLength="30"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value)
              setUserNameErr('')
            }
            }
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-600 rounded text-black focus:ring-blue-500 focus:border-blue-500"
            placeholder="UserName"

          />
          {userNameErr && <p className='text-rose-500'>{userNameErr}</p>}
          <p className="text-gray-500 text-sm mt-1">Editing your links is only available on mobile. Visit the Instagram app and edit your profile to change the websites in your bio.</p>
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength="30"
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-600 rounded text-black focus:ring-blue-500 focus:border-blue-500"
            placeholder="name"

          />
          <p className="text-gray-500 text-sm mt-1">Editing your links is only available on mobile. Visit the Instagram app and edit your profile to change the websites in your bio.</p>
        </div>
        <div className="mb-4">
          {dateErr && <p className='text-red-500'>{dateErr}</p>}
          <label htmlFor="dateOfBirth" className="block text-sm font-medium">Date Of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-600 rounded text-black focus:ring-blue-500 focus:border-blue-500"
            value={dob}
            onChange={(e) => {
              setDob(e.target.value)
              setDateErr('')
            }}
          />
          <p className="text-gray-500 text-sm mt-1">Editing your links is only available on mobile. Visit the Instagram app and edit your profile to change the websites in your bio.</p>
        </div>
        <div className="mb-4">
          <label htmlFor="bio" className="block text-sm font-medium">Bio</label>
          <textarea
            id="bio"
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-600 rounded text-black focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            maxLength="150"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <p className="text-gray-500 text-sm mt-1"> / 150</p>
        </div>

        {/* <div className="mb-4">
          <label htmlFor="gender" className="block text-sm font-medium">Gender</label>
          <select
            id="gender"
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-600 rounded text-black focus:ring-blue-500 focus:border-blue-500"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <p className="text-gray-500 text-sm mt-1">This won’t be part of your public profile.</p>
        </div> */}



        <button disabled={buttonLoading} onClick={handleSubmit} className="w-full bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </div>
      <Dialog open={cropModalOpen} onClose={() => setCropModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white w-96 p-4 rounded-lg">
          <h3 className='text-lg font-medium text-black mb-4'>Crop Image</h3>
          <div className='relative w-full h-64 bg-gray-200'>
            {imageToCrop && (
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            )}

          </div>
          <div className='flex justify-end mt-4'>
            <button className='mr-2 px-4 py-2 bg-gray-600 text-white rounded-lg'
              onClick={() => setCropModalOpen(false)}>
              Cancel
            </button>
            <button className='px-4 py-2 bg-blue-600 text-white rounded-lg'
              onClick={handleSaveCroppedImage}>
              Save

            </button>
          </div>
        </Dialog.Panel>

      </Dialog>
    </div>
  );
};

export default EditProfile;
