import React, { useCallback, useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop'
import { Dialog } from '@headlessui/react'
import { getCroppedImg } from '../../helperFunctions/getCropped';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { createPost } from '../../api/post';
import convertBlobUrlToBase64 from '../../helperFunctions/blob';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isBlocked } from '../../api/user';
import showBlockedAlert from '../../popups/alert';


const CreatePost = () => {
  const fileInputRef = useRef(null);
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm()
  const [selectedImages, setSelectedImages] = useState([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [imageToCrop, setImageToCrop] = useState(null)
  const [inputKey, setInputKey] = useState()
  const [userLocation, setUserLocation] = useState()
  const [imageError, setImageError] = useState()
  const [count, setCount] = useState(0)
  const [buttonLoading, setButtonLoading] = useState(false)
  const[loading,setLoading]=useState()
  const [message,setMessage]=useState()
  const maxCaptionLength = 150;
  const navigate = useNavigate()
  if(message==="not authenticated"){
    navigate('/login')
  }

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
      setInputKey(Date.now())
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


      setCropModalOpen(false)
    } catch (error) {
      console.log(error);
    }
  }

  // const handleFileChange = async (event) => {
  //   const files = Array.from(event.target.files); // Convert FileList to Array
  //   const imageFiles = files.filter(file => file.type.startsWith('image/')); // Filter only image files


  //   const imagePreviews = imageFiles.map(file => {
  //     return new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         resolve(reader.result); // Resolve with the image URL
  //       };
  //       reader.readAsDataURL(file);
  //     });
  //   });

  //   // Wait for all promises to resolve and update the state
  //   const images = await Promise.all(imagePreviews);
  //   setSelectedImages(prevImages => [...prevImages, ...images]);
  // };

  const handleDeleteImage = (index) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleGetCurrentLocation = (e) => {
    e.preventDefault()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (posistion) => {
          const { latitude, longitude } = posistion.coords;
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            )
            const address = response.data.display_name;
            setUserLocation(address || 'Unknown location');

          } catch (error) {
            console.error('Error fetching the location address:', error);
            toast("Error getting location name");
          }
        },
        (error) => {
          console.log(error);
          toast("Error getting current location")
        }
      )
    } else {
      toast("Geolocation is not supported by this browser")
    }
  }
  useEffect(() => {

    console.log('Post count:', count);


    if (count > 0) {
      setSelectedImages([]); // Clear selected images
      setUserLocation('');
      reset({ caption: '' });
    }
  }, [count]);
  const onSubmit = async (data) => {
    setButtonLoading(true)
    const { caption } = data
    try {
      console.log('selected', selectedImages);
      if (selectedImages.length <= 0) {
        setImageError("pick atleast one Image")
        return
      }


      const response = await createPost(userLocation, caption, selectedImages)
      if (response.data.status === "success") {
        setCount(count + 1)
        toast.success("posted successfully")
        navigate('/home')
      }
      console.log("response recevied", response);
    } catch (error) {
      if (error) {
        if (error.response.data.message === 'User is blocked') {
          showBlockedAlert()
          navigate('/login')
        }
      }
      if (error) {
        toast.error("posting failed")
      }
      throw error
    } finally {
      setButtonLoading(false)
    }
  }

  return (
    <div className="flex justify-center mt-20 items-center  mt-4 bg-gray-100">
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-black mb-4">Create Post</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <textarea
            className="w-full p-2 mb-4 bg-gray-100 text-black rounded-lg"
            placeholder="Caption"
            rows="4"
            maxLength={maxCaptionLength}
            {...register('caption', { required: true })}
          ></textarea>
          {errors.caption && <span className='text-red-400'>caption is required</span>}

          <div className="w-full mb-4">
            <label className="block text-gray-600 mb-2">Add Photos</label>
            <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-gray-100">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                key={inputKey}
              />
              <div className="flex flex-col items-center">
                {selectedImages.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={image} alt={`Selected ${index}`} className="w-20 h-20 object-cover rounded-lg" />
                        <button
                          className="absolute top-0 right-0 bg-gray-400 text-white rounded-full h-6 w-6"
                          onClick={() => handleDeleteImage(index)}
                        >
                          <span className='text-black'>&times;</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <svg
                      className="w-12 h-12 text-gray-500 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3v18h18V3H3zm3 3h12v12H6V6zm6 9l3-3-3-3-3 3 3 3zm0-3h.01"
                      />
                    </svg>
                    <span className="text-gray-500">Drag photo here</span>
                  </>
                )}
                <button
                  className="mt-2 px-4 py-2 text-black rounded-lg bg-transparent border border-gray-400"
                  onClick={handleFileButtonClick}
                >
                  Select from computer
                </button>
              </div>
            </div>
          </div>
          {imageError && <span className='text-red-500'>{imageError}</span>}
          <input
            className="w-full p-2 mb-4 bg-gray-100 text-black rounded-lg"
            type="text"
            value={userLocation}
            onChange={(e) => {
              setUserLocation(e.target.value)
            }}
          />
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            onClick={handleGetCurrentLocation}
          >
            Use Current Location
          </button>

          <button disabled={buttonLoading} className="w-full px-4 py-2 bg-blue-600 mt-5 text-white rounded-lg">

            Post
          </button>
        </form>
      </div>
      {/*Crop modal*/}
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

export default CreatePost;
