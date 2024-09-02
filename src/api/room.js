import Api from "../services/axios";
import roomRoutes from "../services/endpoints/roomEndpoints";

export const searchRoom = async (roomName, roomId) => {
  try {
    const response = await Api.get(`${roomRoutes.enterRoom}?roomName=${encodeURIComponent(roomName)}&roomId=${encodeURIComponent(roomId)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching room:', error);
    throw error;
  }
};
export const getToken = async (channelName, uid,role) => {
  try {
    const response = await Api.get(`${roomRoutes.createToken}?channelName=${encodeURIComponent(channelName)}&uid=${encodeURIComponent(uid)}&role=${encodeURIComponent(role)}`)
    return response
  } catch (error) {
    throw error
  }
}

export const spaceRequest=async(roomId,token,userId)=>{
  try {
    const response=await Api.post(roomRoutes.spaceinvitaion,{
      roomId,
      token,
      userId
    })
    
  } catch (error) {
    
  }
}
export const declineInvitation=async(userId)=>{
  try {
    await Api.post(roomRoutes.inviteDeclied,{
       userId
    })
  } catch (error) {
     throw error
  }
}