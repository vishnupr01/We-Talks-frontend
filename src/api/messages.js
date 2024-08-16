
import Api from "../services/axios";
import messageRoutes from "../services/endpoints/messageEndPoints";
export const getConversations = async () => {
  try { 
    const response=await Api.get(messageRoutes.getAllConversation)
    return response
  } catch (error) {
    throw error
  }

}
export const getUserMessages=async (receiverId)=>{
  try {
    const response=await Api.get(`${messageRoutes.getAllMessages}?receiverId=${receiverId}`)
    return response
  } catch (error) {
    throw error
  }
}
export const sendMessage=async(message,recieverIds)=>{
  console.log("api",message,recieverIds);
  
  try {
    const response=await Api.post(messageRoutes.sendMessage,{
      message,
      recieverIds
    })
    return response
  } catch (error) {
    throw error
  }
}