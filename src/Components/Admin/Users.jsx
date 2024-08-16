import React, { useState, useEffect } from 'react';
import { blockUser, getUsers, UnBlockUser } from '../../api/admin';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [visibleDropdown, setVisibleDropdown] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
 const navigate=useNavigate()
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsers(currentPage);
        setUsers(response.data.data.users || []);
        setTotalUsers(response.data.data.totalUsers || 0);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [count, currentPage]);

  const handleBlock = async (email, event) => {
    event.stopPropagation();
    try {
      console.log("Calling backend to block user:", email);
      const response = await blockUser(email);
      console.log("Issue found", response);
      setCount(count + 1);
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleUnBlock = async (email, event) => {
    event.stopPropagation(); 
    try {
      console.log("Calling backend to unblock user:", email);
      await UnBlockUser(email);
      setCount(count + 1);
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  const toggleDropdown = (userId) => {
    setVisibleDropdown(prev => (prev === userId ? null : userId));
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown')) {
      setVisibleDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleIncrementPage = () => {
    if (currentPage < Math.ceil(totalUsers / pageSize)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDecrementPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const navigatePage=(userId)=>{
  navigate('/adminHome/usersprofile', { state: { userId } })
  }

  return (
    <div className="p-8 prose bg-zinc-800  dark:prose-invert w-6/6">
      <div className="bg-card bg-gray-200 p-4 rounded-lg shadow-lg h-full flex flex-col">
        <h2 className="text-xl font-bold text-card-foreground mb-4">Users</h2>
        <div className="overflow-y-auto flex-1">
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user.id} className="flex items-center bg-black justify-between p-4 bg-foreground rounded-lg shadow hover:bg-muted cursor-pointer">
                <div className="flex items-center space-x-4">
                  <img src={user.profileImg} alt={`${user.userName}'s profile`} className="w-12 h-11 rounded-full" />
                  <div>
                    <p className="text-lg font-semibold text-white">{user.userName}</p>
                    <p className="text-sm text-gray-400 text-muted-foreground">Active 28d ago</p>
                  </div>
                </div>
                <div className="relative dropdown">
                  <button className="text-muted-foreground text-white hover:text-primary" onClick={() => toggleDropdown(user._id)}>&#x22EE;</button>
                  {visibleDropdown === user._id && (
                    <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg bg-white shadow-lg">
                      <button onClick={()=>navigatePage(user._id)} className="block w-full text-left px-4 py-2 text-primary-foreground hover:bg-muted">Check Profile</button>
                      {user.isBlocked ? (
                        <button onClick={(event) => handleUnBlock(user.email, event)} className="block w-full text-left px-4 py-2 text-destructive-foreground hover:bg-muted">Unblock</button>
                      ) : (
                        <button onClick={(event) => handleBlock(user.email, event)} className="block w-full text-left px-4 py-2 text-destructive-foreground hover:bg-muted">Block</button>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handleDecrementPage}
            disabled={currentPage === 1}
            className="bg-primary-foreground text-black px-4 py-2 rounded">
            Previous
          </button>
          <span className="text-center">{`Page ${currentPage} of ${Math.ceil(totalUsers / pageSize)}`}</span>
          <button
            onClick={handleIncrementPage}
            disabled={currentPage >= Math.ceil(totalUsers / pageSize)}
            className="bg-primary-foreground text-black px-4 py-2 rounded">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
