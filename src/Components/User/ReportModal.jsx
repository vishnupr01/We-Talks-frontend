import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';

const ReportModal = ({ isOpen, onClose, onReport }) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); // State for selected category
  const [errors, setErrors] = useState('')

  const handleReport = () => {
    console.log("report category",category);
    
    if (!category || !description) {
      setErrors("missing fields")
      return
    }
    onReport( description,category ); // Pass category and description
    setDescription('');
    setCategory('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-sm mx-auto bg-white p-4 rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-semibold flex items-center">
            <FontAwesomeIcon icon={faBan} className="mr-2" />
            Report Post
          </Dialog.Title>
          <Dialog.Description className="mt-2">
            <div className="mt-2">
              {errors&&<p className='text-red-600'>{errors}</p>}
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) =>{
                  setCategory(e.target.value)
                  setErrors('')
                  
                }}
                className="w-full border border-gray-300 p-2 rounded-md"
              >
                <option value="" disabled>Select a category</option>
                <option value="Spam">Spam</option>
                <option value="Harassment">Harassment</option>
                <option value="Misinformation">Misinformation</option>
                <option value="18+ content">18+ content</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <textarea
              value={description}
              onChange={(e) =>{
                setDescription(e.target.value)
                setErrors('')

              } }
              placeholder="Describe the issue..."
              className="w-full border border-gray-300 p-2 rounded-md mt-3"
              rows="4"
            />
          </Dialog.Description>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleReport}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Report
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ReportModal;
