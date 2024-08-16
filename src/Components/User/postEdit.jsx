import React, { useEffect, useState } from 'react';
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { deletePost, saveCaption, singlePost } from '../../api/post';
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { toast } from 'react-hot-toast';

const PostEditingPage = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [postData, setPostData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState('');
  const navigate=useNavigate()
  const location = useLocation();
  const { postId } = location.state;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', height: '0px', right: '10px', zIndex: 1 }}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faArrowRight} style={{ display: 'none', height: '0px' }} />
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

  useEffect(() => {
    const fetchPost = async (postId) => {
      try {
        setLoading(true);
        const response = await singlePost(postId);
        console.log("data",response);
        setPostData(response.data.data);
        setCaption(response.data.data[0].caption);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost(postId);
  }, [postId]);

  const handleCaptionEdit = () => {
    setIsEditing(true);
  };
  const handleDelete = async (postId) => {
    try {
      const response =await deletePost(postId)
      console.log(response)
      if(response.data.status==="success"){
        navigate('/profile')
        toast.success("post deleted")
      }else{
        toast.error("post deletion failed")
      }

    } catch (error) {
      if(error){
        toast.error("post deletion failed")
      }
     throw error
    }
  }
  const handleSave = async (postId) => {
    try {

      setIsEditing(false);
      setPostData((prevData) => {
        const updatedData = [...prevData];
        updatedData[0].caption = caption;
        return updatedData;
      });
      console.log("riccc", postData[0].caption);
      const response = await saveCaption(postId, caption)
      if (response.data.status === 'success') {
        toast.success("updated successfully")
      }
      console.log("casave", response);

    } catch (error) {
      throw error
    }


  };
  const handleEditCancel = () => {
    setIsEditing(false)
  }

  if (loading) return <div>Loading...</div>;
console.log("img",postData[0].details.name);
  return (
    <div className="p-4 sm:p-12  prose font-stardos dark:prose-invert min-h-screen border bg-gray-200">
      <h1 className="text-xl  sm:text-3xl pl-40 font-bold mb-4 sm:mb-8 text-center sm:text-left">Edit Your Post</h1>
      <div className="bg-white dark:bg-white text-black dark:text-black p-4 sm:p-8 rounded-lg shadow-lg max-w-full sm:max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
          <div className="w-full md:w-1/2">
            {postData[0]?.images?.length > 1 ? (
              <Slider {...sliderSettings}>
                {postData[0].images.map((img, imgIndex) => (
                  <img key={imgIndex} className="w-full object-cover" src={img} alt="Post" />
                ))}
              </Slider>
            ) : (
              <img
                className="w-full object-cover mb-4"
                src={postData[0]?.images[0]}
                alt="Post"
              />
            )}
          </div>

          <div className="md:w-1/2">
            <div className="flex items-center justify-between mb-6">
              <div>
                {isEditing ? (
                  <input
                   
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="border p-2 rounded w-full bg-white"
                  />
                ) : (
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold">Caption</h2>
                    <p className="text-lg sm:text-xl font-normal">{postData[0]?.caption}</p>
                  </div>
                )}
              </div>
              <div className="flex space-x-4 items-center">
                {isEditing ? (
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={() => handleSave(postId)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={handleCaptionEdit}
                  >
                    Edit
                  </button>
                )}
                <button onClick={handleEditCancel} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">Cancel</button>
                <Menu as="div" className="relative">
                  <Menu.Button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <EllipsisVerticalIcon className="w-6 h-6" />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-2">
                      
                      <Menu.Item>
                        {({ active }) => (
                          <button onClick={()=>handleDelete(postId)}
                            className={`block w-full px-4 py-2 text-left text-sm ${active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200' : 'text-gray-700 dark:text-gray-400'}`}
                          >
                            Delete Post
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`block w-full px-4 py-2 text-left text-sm ${active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200' : 'text-gray-700 dark:text-gray-400'}`}
                          >
                            Report
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              </div>
            </div>
            <div className="flex items-center text-xl sm:text-2xl mb-6">
              <FontAwesomeIcon icon={faThumbsUp} />
              <p className="text-lg text-gray-400 font-medium ml-4">Sanjay Kumar, Sanu Dz, and 37 others</p>
            </div>
            <div className="bg-white dark:bg-white border p-4 sm:p-6 rounded-lg mb-6">
              <p className="text-black dark:text-black text-lg">Vishnu P R</p>
              <p className="text-gray-700 dark:text-gray-400 text-sm">Thank you 😊</p>
            </div>
            <div className="flex items-center space-x-4">
              <img
                src={postData[0].details.profileImg}
                alt="User avatar"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-gray-300 dark:border-gray-600"
              />
              <input
                type="text"
                placeholder="Write a comment..."
                className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200 p-3 rounded-lg border border-gray-300 dark:border-gray-600 text-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditingPage;
