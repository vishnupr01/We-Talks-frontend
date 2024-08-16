import React from 'react'

const DefaultMsg = () => {
  return (
    <div className="flex-grow h-screen   bg-white flex flex-col justify-center items-center  text-black">
    <div className="text-center">
      <div className="mb-4">
        <svg
          className="w-16 h-16 mx-auto text-gray-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M2 5a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 012 2v3a2 2 0 01-2 2h-3l-4 4v-4H4a2 2 0 01-2-2V5zm2-1a1 1 0 00-1 1v5a1 1 0 001 1h4v3l3-3h3a1 1 0 001-1V8a1 1 0 00-1-1H4V5a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="text-lg">Your messages</p>
      <p className="text-gray-500">Send a message to start a chat.</p>
      <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
        Send message
      </button>
    </div>
  </div>
  )
}

export default DefaultMsg