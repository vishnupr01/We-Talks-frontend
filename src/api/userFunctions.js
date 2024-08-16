import Api from "../services/axios";
import userRoutes from "../services/endpoints/userEndPoints";
export const getUserProfile = async () => {
  try {
    const response = await Api.get(userRoutes.userProfile)
    return response

  } catch (error) {
    throw error

  }
}
export const updateProfile=async(userName,name,bio,dob)=>{
  try {

    const response=await Api.patch(userRoutes.updateProfile,{
      userName,
      name,
      bio,
      dob
    })
    return response
  } catch (error) {
    throw error
  }
}
export const saveImage=async(image)=>{
  try {
    const response=await Api.patch(userRoutes.saveProfileImg,{
      image
    })
    return response
  } catch (error) {
    
  }throw error
}
export const getFriendProfile=async(userId)=>{
  try {
    console.log("front",userId);
    const response=await Api.get(`${userRoutes.friendProfile}/${userId}`)
    console.log("dfdsfsdeeee",response);
    return response
  } catch (error) {
    throw error
  }
}
export const SearchUser=async(query)=>{
  try {
    console.log(query);
    const encodedQuery=encodeURIComponent(query)
    const response=await Api.get(`${userRoutes.searchUsers}?query=${encodedQuery}`)
    return response
    
  } catch (error) {
    throw error
  }
}