
import Api from "../services/axios";
import adminRoutes from "../services/endpoints/adminEndPoints";
const login = async (email, password) => {
  try {
    const response = await Api.post(adminRoutes.login, {
      email,
      password
    })
    return response
  } catch (error) {
    console.log(error);
    throw error

  }
}
export default login
export const isAdmin = async () => {
  try {
    const result = await Api.get(adminRoutes.isAdmin)
    return result
  } catch (error) {
    console.log(error);
    throw error
  }
}
export const getUsers = async (currentPage) => {
  try {
    const result = await Api.get(`${adminRoutes.getUser}?page=${currentPage}`)
  
    console.log(result);
    return result
  } catch (error) {
    console.log(error);
    throw error
  }
}
export const blockUser = async (email) => {
  try {
    const response=await Api.patch(adminRoutes.blockUser,{
      email
    })
    console.log("block",response);
    return response
  } catch (error) {

  }

  
  
}
export const UnBlockUser = async (email) => {
  try {
    const response=await Api.patch(adminRoutes.UnBlockUser,{
      email
    })
    console.log("Unblock",response);
    return response
  } catch (error) {
 throw error
  }
}
export const getUserAdmin=async(userId)=>{
  try {
    const response=await Api.get(`${adminRoutes.getUserProfile}/${userId}`)
    return response
  } catch (error) {
    throw error
    
  }
}
export const deleteAdminPost = async (postId) => {
  try {
    const response = await Api.delete(`${adminRoutes.deletePost}?postId=${postId}`)
    return response
  } catch (error) {
    throw error
  }
}