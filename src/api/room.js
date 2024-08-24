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
export const getToken = async (channelName, uid) => {
  try {
    const response = await Api.get(`${roomRoutes.createToken}?channelName=${encodeURIComponent(channelName)}&uid=${encodeURIComponent(uid)}`)
    return response
  } catch (error) {
    throw error
  }
}