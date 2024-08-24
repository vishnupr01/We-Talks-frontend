import userRoutes from "../services/endpoints/userEndPoints";
import Api from "../services/axios";
const signUp = async (email, userName, name, dob, password,) => {
  try {
    const response = await Api.post(userRoutes.signUp, {
      email,
      userName,
      name,
      password,
      dob,

    })
    return response
  } catch (error) {
    console.log("error during signup", error);
    throw error
  }
}
export const resendOtp = async (email) => {
  try {
    const response = await Api.post(userRoutes.reSend, { email })
    return response

  } catch (error) {
    throw error
  }
}
export const verifyOtp = async (email, otp) => {
  try {
    const response = await Api.post(userRoutes.verifyOtp, {
      email,
      otp
    })
    console.log(response);
    return response
  } catch (error) {
    throw error
  }
}

export default signUp
export const signIn = async (email, password) => {
  try {
    const response = await Api.post(userRoutes.signIn, {
      email,
      password
    })
    return response
  } catch (error) {
    throw error
  }

}
export const isUser = async () => {
  try {
    const result = await Api.get(userRoutes.isUser)
    return result
  } catch (error) {
    console.log(error);
    throw error
  }
}
export const logOut = async () => {
  try {
    const result = await Api.post(userRoutes.logout)
    return result
  } catch (error) {
    console.log(error);
    throw error
  }
}
export const googleSignUp = async (email, name) => {
  try {
    const response = await Api.post(userRoutes.google, {
      email,
      name,
    })
    return response
  } catch (error) {
    throw error
  }
}
export const googleUpdate = async (_id, userName, dob) => {
  try {

    const response = await Api.patch(userRoutes.googleUpdate, {
      _id,
      userName,
      dob
    })
    return response
  } catch (error) {
    throw error
  }
}
export const isBlocked = async () => {
  try {
    const response = await Api.get(userRoutes.isBlocked)
    console.log(response);
    return response
  } catch (error) {
    console.log(error);
  }
}
export const forgotOtp = async (email) => {
  try {
    console.log(email);
    const response = await Api.post(userRoutes.forgotOtp, { email })
    console.log(response);
    return response
  } catch (error) {
    throw error

  }
}
export const changePassword = async (email, newPassword) => {
  try {
    const response = await Api.patch(userRoutes.changepass, { email, newPassword })
    return response
  } catch (error) {
    throw error
  }


}
export const getToken = async () => {
  try {
    const response = await Api.get(userRoutes.getToken)
    return response
  } catch (error) {
    throw error
  }
}
export const fetchAllFriends = async () => {
  try {
    const response = await Api.get(userRoutes.fetchFriends)
    return response
  } catch (error) {
    throw error
  }
}
export const unFriend = async (receiverId) => {
  try {
    const response = await Api.patch(userRoutes.unFriendRoute, { receiverId })
    return response
  } catch (error) {
    throw error
  }
}
export const searchFriend = async (query) => {
  try {
    console.log(query);
    const encodedQuery = encodeURIComponent(query)
    const response = await Api.get(`${userRoutes.searchFriendRoute}?query=${encodedQuery}`)
    return response
  } catch (error) {
    throw error

  }
}
export const userBlock = async (blockId) => {
  try {
    const response = await Api.patch(userRoutes.blockUser, { blockId })
    return response
  } catch (error) {
    throw error
  }

}

export const unblockUser = async (blockId) => {
  try {
    const response = await Api.patch(userRoutes.unBlockUser, { blockId })
    return response
  } catch (error) {
    throw error
  }
}

export const refreshToken = async () => {
  try {
    const response = await Api.post(userRoutes.refershToken)
    console.log("refresh response", response);

  } catch (error) {
    throw error
  }
}