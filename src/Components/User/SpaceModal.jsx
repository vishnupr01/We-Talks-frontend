import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { getToken } from '../../api/room';
import { useSelector } from 'react-redux';


const CreateSpaceModal = ({ isOpen, onClose }) => {
  const [roomId, setRoomId] = useState('')
  const [description, setDesription] = useState('')
  const [fieldError, setFieldError] = useState('')

  const navigate = useNavigate()
  const role="publisher"
  const { id } = useSelector((state) => state.authSlice.user);
  const uid=id
  sessionStorage.setItem('uid', uid);
  // const createInstance=async()=>{
  //   try {
  //     const response=await getToken(roomId,uid)
  //      setTokens(response.data.data)
  //   } catch (error) {
  //      console.log(error);
       
  //   }
  // }
  const navigatetoSpace = async() => {

    if (!roomId || !description) {
      setFieldError('fields required')
      return
    }
    const response=await getToken(roomId,uid)
    const tokens=response.data.data
    navigate('/home/room', { state: { roomId, description,role,tokens } })
    if (roomId && description) {
      onClose()
      setDesription('')
      setRoomId('')
    }

  }


  return (
    <CSSTransition
      in={isOpen}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-gray-800 text-white rounded-lg p-6 w-96 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Create Your Space</h2>
          {fieldError && <p className='text-red-500'>{fieldError}</p>}
          <div className="mb-4">
            <label htmlFor="spaceName" className="block text-sm font-medium mb-1">Space Name</label>
            <input
              onChange={(e) => {
                setRoomId(e.target.value)
                setFieldError('')
              }}

              type="text"
              id="spaceName"
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="spaceDescription" className="block text-sm font-medium mb-1">Space Description</label>
            <textarea
              onChange={(e) => {
                setDesription(e.target.value)
                setFieldError('')
              }}
              id="spaceDescription"
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white"
              rows="4"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-500 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => navigatetoSpace()}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-gray-500 transition duration-200"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default CreateSpaceModal;
