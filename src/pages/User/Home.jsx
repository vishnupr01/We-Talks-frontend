import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faComment, faUpload, faBell, faPlus, faBars, faSignOutAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../api/user';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { clearUser, logout } from '../../redux/slices/home';
import showBlockedAlert from '../../popups/alert';
import SearchModal from '../../Components/User/SearchModal';
import { getNotificationCount } from '../../api/notification';
import { useSocketContext } from '../../context/SocketContext';

const Modal = React.memo(({ show, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      const result = await logOut();
      if (result.data.message === 'Logged out successfully') {
        dispatch(logout());
        dispatch(clearUser());
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, [dispatch, navigate]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center ml-20 mt-96 justify-start">
      <div className="bg-black rounded-lg p-6 mt-24 w-44 relative">
        <div className="flex justify-end">
          <button className="focus:outline-none text-white text-2xl" onClick={onClose}>
            &times;
          </button>
        </div>
        <ul>
          <li className="mb-2">
            <button onClick={handleLogout} className="text-white flex items-center">
              Log Out
              <FontAwesomeIcon icon={faSignOutAlt} className="ml-2" />
            </button>
          </li>
          <li className="mb-2"><button onClick={onClose} className="text-white">Option 2</button></li>
          <li className="mb-2"><button onClick={onClose} className="text-white">Option 3</button></li>
        </ul>
      </div>
    </div>
  );
});

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket } = useSocketContext();
  const { image_url, name, isBlocked } = useSelector((state) => state.authSlice.user);
  console.log("page rerendering");
  
  const getNotificationCounts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getNotificationCount();
      setNotificationCount(response.data.data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleNewMessage = (notificationCount) => {
      setNotificationCount(notificationCount);
    };

    if (socket) {
      socket.on("notificationCount", handleNewMessage);
    }

    return () => {
      if (socket) {
        socket.off("notificationCount", handleNewMessage);
      }
    };
  }, [socket]);

  useEffect(() => {
    if (isBlocked) {
      dispatch(logout());
      dispatch(clearUser());
      showBlockedAlert();
      navigate('/login');
    }
    getNotificationCounts();
  }, [isBlocked, navigate, dispatch, getNotificationCounts]);

  const handleMenuClick = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleSearchOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleSearchCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);



  return (
    <div className="flex h-screen">
      <aside className="w-24 bg-zinc-800 flex flex-col items-center py-4 fixed h-full top-0 left-0">
        <Link to='/home' className="flex items-center pb-0 hover:bg-blue-100 p-2 rounded">
          <button className="focus:outline-none flex flex-col mt-4 items-center mb-12">
            <FontAwesomeIcon icon={faHome} size="lg" />
            <span className="text-xs font-stardos">Home</span>
          </button>
        </Link>
        <button onClick={handleSearchOpenModal} className="focus:outline-none flex flex-col items-center mb-12">
          <FontAwesomeIcon icon={faSearch} size="lg" />
          <span className="text-xs font-stardos">Search</span>
        </button>

        <Link to='/home/messages' className="flex items-center pb-0 hover:bg-blue-100 p-2 rounded">
          <button className="focus:outline-none flex flex-col items-center mb-12">
            <FontAwesomeIcon icon={faComment} size="lg" />
            <span className="text-xs font-stardos">Messages</span>
          </button>
        </Link>
        <div className="relative mb-12">
          <Link to='/home/notifications ' className="flex items-center pb-0 hover:bg-blue-100 p-2 rounded">
            <button className="focus:outline-none flex flex-col items-center">
              <FontAwesomeIcon icon={faBell} size="lg" />
              <span className="text-xs">Notifications</span>
            </button>
          </Link>
          {notificationCount > 0 && <span className="absolute top-0 right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{notificationCount}</span>}
        </div>
        <button className="focus:outline-none flex flex-col items-center mb-12">
          <FontAwesomeIcon icon={faPlus} size="lg" />
          <span className="text-xs">Create</span>
        </button>
        <Link to='/home/profile' className="flex items-center pb-0 hover:bg-blue-100 p-2 rounded">
          <button className="focus:outline-none flex flex-col items-center mb-12">
            <img className='h-12 w-12 rounded-3xl' src={image_url} alt="User" />
            <span className="text-xs">{name}</span>
          </button>
        </Link>
        <Link to='/home/createPost' className="flex items-center pb-0 hover:bg-blue-100 p-2 rounded">
          <button className="focus:outline-none flex flex-col items-center mb-12">
            <FontAwesomeIcon icon={faUpload} size="lg" />
            <span className="text-xs">New Post</span>
          </button>
        </Link>
        <button className="focus:outline-none flex flex-col items-center mb-12" onClick={handleMenuClick}>
          <FontAwesomeIcon icon={faBars} size="lg" />
          <span className="text-xs">Menu</span>
        </button>
      </aside>
      <div className="flex-1 flex flex-col ml-24">
        <header className="bg-zinc-800 p-7 justify-between shadow-md fixed top-0 left-24 right-0 z-10 flex items-center">
          <div className="flex items-center ml-96 pl-52">
            <h1 className="text-2xl font-bold font-stardos">
              <span className="text-green-500 font-sans">WE</span> <span className='text-white'>TALKS</span>
            </h1>
            <FontAwesomeIcon icon={faComment} size="lg" className="ml-2 text-white " />
          </div>
          <div className="flex items-center">
            <Link to="/home/friendRequests" className="relative">
              <FontAwesomeIcon icon={faUserFriends} size="lg" className="text-white mr-4" />
            </Link>
          </div>
        </header>
        <main className="flex-1 bg-gray-100 flex flex-col pt-20">
          <div className="flex-1 p-1">
            <Outlet />
          </div>
        </main>
      </div>
     <SearchModal isOpen={isModalOpen} onClose={handleSearchCloseModal} />
      <Modal show={showModal} onClose={handleCloseModal} />
    </div>
  );
};

export default Home;
