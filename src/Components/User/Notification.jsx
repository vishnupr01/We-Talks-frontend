import React, { useEffect, useState } from 'react';
import { getAllNotifications } from '../../api/notification';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newNotifications, setNewNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getAllNotifications();
      console.log("noti", response);

      setNotifications(response.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    // Categorize notifications when `notifications` changes
    const categorizeNotifications = (notifications) => {
      const categorized = {
        Today: [],
        Yesterday: [],
        'This week': [],
        'This month': [],
        Earlier: []
      };
      console.log("my noti", notifications);

      notifications.forEach(notification => {
        const category = getTimeCategory(notification.createdAt);
        categorized[category].push({
          postImg: notification?.postId?.images[0], // Ensure this path is correct
          action: notification.message,
          avatar: notification.sender.profileImg,
          timeAgo: getTimeAgo(notification.createdAt),
          user: notification.sender.name, // Assuming you want to show the user's name
          isFollowing: notification.isFollowing // Assuming you want to show if the user is following
        });
      });

      return Object.keys(categorized).map(time => ({
        time,
        items: categorized[time]
      }));
    };

    const getTimeCategory = (date) => {
      const now = new Date();
      const notificationDate = new Date(date);
      const diffInDays = Math.floor((now - notificationDate) / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays <= 7) return 'This week';
      if (notificationDate.getMonth() === now.getMonth() && notificationDate.getFullYear() === now.getFullYear()) return 'This month';
      return 'Earlier';
    };

    const getTimeAgo = (date) => {
      const now = new Date();
      const notificationDate = new Date(date);
      const diffInSeconds = Math.floor((now - notificationDate) / 1000);

      const secondsInMinute = 60;
      const secondsInHour = 3600;
      const secondsInDay = 86400;

      if (diffInSeconds < secondsInMinute) return `Just now`;
      if (diffInSeconds < secondsInHour) return `${Math.floor(diffInSeconds / secondsInMinute)}m`;
      if (diffInSeconds < secondsInDay) return `${Math.floor(diffInSeconds / secondsInHour)}h`;
      return `${Math.floor(diffInSeconds / secondsInDay)}d`;
    };

    setNewNotifications(categorizeNotifications(notifications));
  }, [notifications]);

  if (loading) return <div>Loading...</div>;

  // Filter out sections with empty items
  const filteredNotifications = newNotifications.filter(section => section.items.length > 0);

  console.log("new notifications", filteredNotifications);

  return (
    <div className="bg-white text-black p-4 w-full max-w-8xl h-screen mx-auto rounded-lg shadow-lg">
      <h1 className='font-bold text-2xl'>Notifications</h1>
      {filteredNotifications.length > 0 ? (
        filteredNotifications.map((section, index) => (
          <div key={index} className="mt-4">
            <h3 className="text-xl font-semibold mb-2">{section.time}</h3>
            {section.items.map((item, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <img
                      src={item.avatar}
                      alt={item.user}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="">
                        <span className="" style={{ fontWeight: 'bold',color:'blue' }}>{item.user}</span>{item.action}
                      </p>
                      <p className="text-xs text-gray-500">{item.timeAgo}</p>
                    </div>
                  </div>
                  {item.postImg && (
                    <img
                      src={item.postImg}
                      alt="Post image"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  )}
                  {item.isFollowing && (
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">
                      Following
                    </button>
                  )}
                </div>
                {/* Add the separator */}
                <hr className="my-2 border-gray-300" />
              </div>
            ))}
          </div>
        ))
      ) : (
        <p className='mt-4'>No new  notifications</p>
      )}
    </div>
  );
};

export default Notification;
