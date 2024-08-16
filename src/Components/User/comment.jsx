import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faHeart as fasHeart, faReply, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { createComment, fetchReplies, getAllComments, likeComment, postReplyComment } from '../../api/comment';
import { useSelector } from 'react-redux';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';

const CommentModal = React.memo(({ onClose, selectedPost }) => {
  const [newComment, setNewComment] = useState('');
  const [commentData, setCommentData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [replies, setReplies] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});
  const [replyTo, setReplyTo] = useState();
  const [visibleReplies, setVisibleReplies] = useState({});
  const [loading, setLoading] = useState(false)
  const { id } = useSelector((state) => state.authSlice.user);

  const likingComment = async (commentId) => {
    try {
      setLoading(true);
      const response = await likeComment(commentId);
      console.log("likeComment", response);

      if (response.data.data === null) {
        return;
      }

      const likedComment = response.data.data;

      setCommentData((prevComments) =>
        prevComments.map((comment) =>
          comment._id === likedComment._id
            ? { ...comment, likes: likedComment.likes, isLiked: likedComment.liked.includes(id) }
            : comment
        )
      );
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }


  const fetchRepliesForComment = useCallback(async (commentId) => {
    if (!visibleReplies[commentId]) {
      try {
        setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));
        const response = await fetchReplies(commentId);
        setReplies((prev) => ({
          ...prev,
          [commentId]: response.data.data
        }));
      } catch (error) {
        console.error('Error fetching replies:', error);
      } finally {
        setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
      }
    }
    setVisibleReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  }, [visibleReplies]);

  const fetchdata = useCallback(async () => {
    try {
      const response = await getAllComments(selectedPost._id, page);
      const allComments = response.data.data;
      // setPosts(prevPosts => {
      //   const newPosts = filteredPosts.filter(post => !prevPosts.some(p => p._id === post._id));
      //   if (newPosts.length === 0) {
      //     setHasMore(false);
      //   }
      //   return [
      //     ...prevPosts,
      //     ...newPosts.map(post => ({
      //       ...post,
      //       isliked: post.liked?.includes(id),
      //       isSaved: post.savedUser?.includes(id)
      //     }))
      //   ];
      // });
      setCommentData((prevComments) => {
        const newComments = allComments.filter(
          (comment) => !prevComments.some((p) => p._id === comment._id)
        );
        setHasMore(newComments.length > 0);
        return [
          ...prevComments,
          ...newComments.map((comment) => ({
            ...comment,
            isLiked: comment.liked?.includes(id) // Ensure this is correctly checking the `liked` array
          }))
        ];
      });
    } catch (error) {
      console.error(error);
    }
  }, [page, selectedPost?._id]);

  const fetchMoreComments = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  useEffect(() => {
    fetchdata();
  }, [fetchdata]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const getTimeElapsed = (createdAt) => {
    const now = new Date();
    const postTime = new Date(createdAt);
    const timeDiff = now - postTime;

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const handlePostComment = useCallback(async (postId) => {
    try {
      setLoading(true)
      if (newComment.trim()) {
        let response;
        if (newComment[0] === '@') {
          response = await postReplyComment(postId, newComment, replyTo);
          
        } else {
          response = await createComment(postId, newComment);
        }
        setNewComment('');
        console.log("reply response",response);
        
        if (response.data.status === 'success') { 
          console.log("its workkkkk");
          
          fetchdata();
        }
      }
    } catch (error) {
      console.error(error);
    }finally{
      setLoading(false)
    }
  }, [newComment, replyTo, fetchdata]);

  // const handleLikeComment = useCallback((commentId) => {
  //   console.log('Like Comment:', commentId);
  // }, []);

  const handleReplyComment = useCallback((commentId, userName) => {
    setNewComment(`@${userName}`);
    setReplyTo(commentId);
  }, []);
  console.log("replylength", commentData);
  if (loading) return <div>loading...</div>
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 text-black text-opacity-80 bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md p-4">
        <div className="flex justify-between  items-center">
          <h2 className="text-lg font-bold">Comments</h2>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        {commentData?.length === 0 && <p>No comments yet...</p>}
        <InfiniteScroll
          scrollThreshold={`200px`}
          dataLength={commentData?.length}
          next={fetchMoreComments}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          style={{ maxHeight: '320px', overflowY: 'auto' }}
          className='comment-modal-content'
        >
          <div className="mt-4">
            {commentData?.map((comment) => (
              <div className="flex flex-col items-start mb-4">
                <div className="flex items-start">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={comment.authorDetails.profileImg || 'default-profile-img.jpg'}
                    alt="Profile"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{comment.authorDetails.userName}</span>
                      <div className="flex ml-2   space-x-2">
                        {comment.isLiked ? <button onClick={() => likingComment(comment._id)}>
                          <FontAwesomeIcon className='text-sm text-red-600' icon={fasHeart} />
                        </button> : <button onClick={() => likingComment(comment._id)}>
                          <FontAwesomeIcon className='text-sm' icon={farHeart} />
                        </button>}

                        <button onClick={() => handleReplyComment(comment._id, comment.authorDetails.userName)}>
                          <FontAwesomeIcon icon={faReply} />
                        </button>
                      </div>
                    </div>
                    <p>   {comment.comment}</p>
                    <div className='mt-2'>
                      <span className='text-gray-400 mr-2'>{getTimeElapsed(comment.createdAt)}</span>
                      {comment.likes===1&&<span className='text-gray-400 mr-2 text-sm'>{comment.likes} like</span>}
                      {comment.likes>1&&<span className='text-gray-400 mr-2 text-sm'>{comment.likes} likes</span>}
                      {comment?.replies?.length > 0 &&

                        <button onClick={() => fetchRepliesForComment(comment._id)} className='text-sm'>
                          {loadingReplies[comment._id] ? 'Loading replies...' : visibleReplies[comment._id] ? 'Hide replies' : 'View replies'}
                          <FontAwesomeIcon className='ml-2' icon={visibleReplies[comment._id] ? faChevronUp : faChevronDown} />
                        </button>}
                      <div className={`comment-replies ${visibleReplies[comment._id] ? 'open' : 'closed'}`}>
                        {visibleReplies[comment._id] && replies[comment._id] && replies[comment._id].map((reply, index) => (
                          <div key={index} className="reply">
                            <img
                              className="reply-img"
                              src={reply.profileImg || 'default-profile-img.jpg'}
                              alt="Profile"
                            />
                            <div>
                              <span className="font-bold">{reply.userName}</span>
                              <p>{reply.comment}</p>
                              <span className='text-gray-400 mr-2'>{getTimeElapsed(reply.createdAt)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {hasMore && <button onClick={fetchMoreComments} className='ml-40 text-blue-500'>more...</button>}
        </InfiniteScroll>
        <div className="mt-4 flex">
          <input
            type="text"

            className="w-full p-2 border text-white border-gray-300 rounded-l-lg"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
           
          />
           {loading && <div className="spinner3 ml-2"></div>}
          <button
            onClick={() => handlePostComment(selectedPost._id)}
            className="bg-blue-500 text-white p-2 rounded-r-lg"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
});

export default CommentModal;
