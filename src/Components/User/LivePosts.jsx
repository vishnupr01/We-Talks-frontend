import React, { useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getLikedPosts, likePost, loadAllPosts, savingPost } from '../../api/post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faBookBookmark, faSave, faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart, faComment as farComment, faPaperPlane as farPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link, useNavigate } from 'react-router-dom';
import showBlockedAlert from '../../popups/alert';
import { useSelector } from 'react-redux';
import CommentModal from './comment';
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { getUserProfile } from '../../api/userFunctions';

const LivePost = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [hasmore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false)
  const [blockedUsers, setBlockedUsers] = useState([])
  const navigate = useNavigate();
  const { id } = useSelector((state) => state.authSlice.user);

  const openModal = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };
  // const fetchUserProfile = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await getUserProfile();
  //     const blockedIds = response.data.data.blockedUsers.map(user => user?.blockedId);
  //     setBlockedUsers(blockedIds);
  //     console.log('Blocked Users:', blockedIds); // Check the console to ensure this is correct
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const savePost = async (postId) => {
    try {
      const response = await savingPost(postId);
      const savedPost = response.data.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) => ({
          ...post,
          isSaved: savedPost.saved.includes(postId),
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const likingPost = async (postId) => {
    try {
      const response = await likePost(postId);
      console.log("what happens on like",response);
      
      // if(response.data.data===null){
      //   return
      // }
      const likedPost = response.data.data;
      setPosts((prevPosts) => 
        prevPosts.map((post) =>
          post._id === likedPost._id
            ? { ...post, likes: likedPost.likes, isliked: likedPost.liked.includes(id) }
            : post
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
 
    // fetchUserProfile()
    fetchPosts();

  }, [page]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
  
      // Execute both API calls in parallel
      const [userProfileResponse, postsResponse] = await Promise.all([
        getUserProfile(),
        loadAllPosts(page)
      ]);
  
      // Process the user profile response
      const blockedIds = userProfileResponse.data.data.blockedUsers.map(user => user?.blockedId);
      setBlockedUsers(blockedIds);
  
      // Process the posts response
      const postsData = postsResponse.data.data;
      const filteredPosts = postsData.filter(post => !blockedIds.includes(post.creator_id));
  
      // Update posts state
      setPosts(prevPosts => {
        const newPosts = filteredPosts.filter(post => !prevPosts.some(p => p._id === post._id));
        if (newPosts.length === 0) {
          setHasMore(false);
        }
        return [
          ...prevPosts,
          ...newPosts.map(post => ({
            ...post,
            isliked: post.liked?.includes(id),
            isSaved: post.savedUser?.includes(id)
          }))
        ];
      });
  
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message === 'User is blocked') {
        showBlockedAlert();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }
  const fetchMorePosts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        fetchMorePosts();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', height: '0px', right: '10px', zIndex: 1 }}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faArrowRight} style={{ height: '0px' }} />
      </div>
    );
  }

  function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', left: '9px', zIndex: 1 }}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </div>
    );
  }

  const handleFriendProfile = (userId) => {
    if (id === userId) {
      navigate('profile');
    } else {
      navigate('friendProfile', { state: { userId } });
    }
  };

  const getTimeElapsed = (createdAt) => {
    const now = new Date();
    const postTime = new Date(createdAt);
    const timeDiff = now - postTime;

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };
  console.log("blockedIds", blockedUsers);

  return (
    <div className="flex justify-center items-center bg-gray-200 min-h-screen p-4">
      <div className="bg-white text-black rounded-lg overflow-hidden max-w-md shadow-lg  w-full">
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMorePosts}
          hasMore={hasmore}
          endMessage={<p style={{ textAlign: 'center' }}><b>No more posts...</b></p>}
        >
          {posts.map((post, postIndex) => (
            <div key={post._id || postIndex} className="p-4">
              <div className="flex items-center mb-4">
                <img className="w-10 h-10 rounded-full" src={post.user.profileImg} alt="Profile" />
                <div className="ml-4 flex-grow">
                  <button onClick={() => handleFriendProfile(post.creator_id)}>
                    <span className="font-bold text-sm md:text-base">{post.user.userName}</span>
                  </button>
                  <span className="text-gray-400 ml-2 text-xs md:text-sm">{getTimeElapsed(post.createdAt)}</span>
                </div>
                <div className="ml-4 md:ml-6">
                  <Menu as="span" className="relative">
                    <Menu.Button
                      as="div" // Changed from button to div to avoid default button behavior
                      className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer" // Add cursor-pointer for better UX
                    >
                      <EllipsisVerticalIcon className="w-6 h-6" />
                    </Menu.Button>
                    <Menu.Items
                      className="absolute   z-10 right-0 mt-2 w-48 bg-white text-black border border-gray-300 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="p-2">
                        {post.isSaved ? (
                          <Menu.Item>
                            {({ active }) => (
                              <div
                                onClick={() => savePost(post._id)}
                                className={`block w-full px-4 py-2 text-left text-sm cursor-pointer ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                              >
                                <FontAwesomeIcon icon={faSave} className="text-xl" />
                                <span className="pl-2">Unsave Post</span>
                              </div>
                            )}
                          </Menu.Item>
                        ) : (
                          <Menu.Item>
                            {({ active }) => (
                              <div
                                onClick={() => savePost(post._id)}
                                className={`block w-full px-4 py-2 text-left text-sm cursor-pointer ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                              >
                                <FontAwesomeIcon icon={faSave} className="text-xl" />
                                <span className="pl-2">Save Post</span>
                              </div>
                            )}
                          </Menu.Item>
                        )}
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              className={`block w-full px-4 py-2 text-left text-sm cursor-pointer ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                            >
                              <FontAwesomeIcon icon={faBan} className="text-xl" />
                              <span className="pl-2">Report</span>
                            </div>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Menu>
                </div>
              </div>
              {post.images.length > 1 ? (
                <Slider {...sliderSettings}>
                  {post.images.map((img, imgIndex) => (
                    <img
                      key={imgIndex}
                      className="w-full object-cover mb-4"
                      src={img}
                      alt="Post"
                    />
                  ))}
                </Slider>
              ) : (
                <img
                  className="w-full object-cover mb-4"
                  src={post.images[0]}
                  alt="Post"
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    {post.isliked ? (
                      <button className="text-red-600" onClick={() => likingPost(post._id)}>
                        <FontAwesomeIcon className="text-2xl" icon={fasHeart} />
                      </button>
                    ) : (
                      <button onClick={() => likingPost(post._id)}>
                        <FontAwesomeIcon className="text-2xl" icon={farHeart} />
                      </button>
                    )}
                    <button onClick={() => openModal(post)}>
                      <FontAwesomeIcon className="text-2xl ml-3" icon={farComment} />
                    </button>
                    <span className="text-2xl ml-3">
                      <FontAwesomeIcon icon={farPaperPlane} />
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {post.likes} likes
                  </div>
                </div>
                <div>
                  <span className="font-bold">@{post.user.userName}</span> {post.caption}
                </div>
                <div className="text-gray-400 text-xs md:text-sm mt-1">
                  View all {post.comments?.length || 0} comments

                </div>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
      {showModal && <CommentModal selectedPost={selectedPost} onClose={closeModal} />}
    </div>
  );
};

export default LivePost;
