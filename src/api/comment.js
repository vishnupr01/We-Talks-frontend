import commentRoutes from "../services/endpoints/commentEndPoints";
import Api from "../services/axios";
export const createComment = async (postId, text) => {
  try {
    const response = await Api.post(commentRoutes.createComment, {
      postId,
      text
    })
    return response
  } catch (error) {
    throw error
  }
}
export const getAllComments = async (postId, page) => {
  try {
    const response = await Api.get(`${commentRoutes.getComments}?postId=${postId}&page=${page}`)
    return response
  } catch (error) {
    throw error
  }
}

export const postReplyComment = async (postId, newComment, replayTo) => {
  try {
    const response = await Api.post(commentRoutes.replyComment, {
      postId, newComment, replayTo
    })
    return response
  } catch (error) {
    throw error
  }

}
export const fetchReplies = async (commentId) => {
  try {
    const response = await Api.get(`${commentRoutes.allReplys}?commentId=${commentId}`)
    return response
  } catch (error) {
    throw error
  }
}
export const likeComment = async (commentId) => {
  try {
    const response = await Api.patch(commentRoutes.commentLike, { commentId })
    return response
  } catch (error) {
    throw error
  }
}