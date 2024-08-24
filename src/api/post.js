import Api from "../services/axios";
import postRoutes from "../services/endpoints/postEndPoints";
export const createPost = async (location, caption, images) => {
  try {
    console.log(postRoutes.CreatePost);
    const response = await Api.post(postRoutes.CreatePost, {
      location,
      caption,
      images
    })
    return response
  } catch (error) {
    console.log("create post error", error);
    throw error
  }
}
export const loadAllPosts = async (page) => {
  try {
    const response = await Api.get(`${postRoutes.getAllPosts}?page=${page}`)
    return response
  } catch (error) {
    console.log(error);
    throw error

  }
}
export const singlePost = async (postId) => {
  try {
    const response = await Api.get(`${postRoutes.singlePost}?postId=${postId}`)
    return response
  } catch (error) {
    throw error
  }
}
export const saveCaption = async (postId, caption) => {
  try {
    const response = await Api.patch(postRoutes.saveCaption, {
      postId,
      caption
    })
    return response
  } catch (error) {
    throw error
  }

}
export const deletePost = async (postId) => {
  try {
    const response = await Api.delete(`${postRoutes.postDelete}?postId=${postId}`)
    return response
  } catch (error) {
    throw error
  }
}
export const likePost = async (postId) => {
  try {
    const response = await Api.patch(postRoutes.likePost, { postId })
    return response

  } catch (error) {
    throw error
  }

}
export const getLikedPosts = async () => {
  try {
    const response = await Api.get(postRoutes.getLiked)
    return response
  } catch (error) {
    throw error
  }
}
export const savingPost = async (postId) => {
  try {
    const response = await Api.patch(postRoutes.postSave, {
      postId
    })
    return response

  } catch (error) {
    throw error
  }

}
export const savedPosts = async () => {
  try {
    const response = await Api.get(postRoutes.savedPosts)
    return response
  } catch (error) {
    throw error
  }
}
export const reportPost = async (post_id, description) => {
  try {
    console.log("api call",post_id);
    
    const response = await Api.post(postRoutes.reportPost, {
      post_id,
      description
    })

    return response
  } catch (error) {
    throw error
  }
}
