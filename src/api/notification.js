import Api from "../services/axios";
import notificationRoutes from "../services/endpoints/notificationEndPoints";

export const getAllNotifications = async () => {
  try {
    const response = await Api.get(notificationRoutes.getNotifications)
    return response
  } catch (error) {
    throw error
  }
}
export const getNotificationCount = async () => {
  try {
    const response = await Api.get(notificationRoutes.getNotificationCount)
    return response
  } catch (error) {
    throw error
  }
}
export const newFriendRequest = async (receiverId) => {
  try {
    const response = await Api.post(notificationRoutes.createFriendRequest, {
      receiverId
    })
    return response
  } catch (error) {
    throw error

  }

}
export const fetchRequests = async () => {
  try {
    const response = await Api.get(notificationRoutes.allFriendRequests)
    return response
  } catch (error) {
    throw error

  }
}
export const confirmRequest = async (senderId,updaterId) => {
  try {
    const response = await Api.patch(notificationRoutes.acceptRequest,{senderId,updaterId})
    return response
  } catch (error) {
    throw error
  }
}