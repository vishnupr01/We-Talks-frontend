import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';

const ReportModal = ({ isOpen, onClose, onReport }) => {
  const [description, setDescription] = useState('');

  const handleReport = () => {
    onReport(description);
    setDescription('');
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
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue..."
              className="w-full border border-gray-300 p-2 rounded-md"
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
