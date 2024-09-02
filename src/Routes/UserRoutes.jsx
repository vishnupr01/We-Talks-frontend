import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../protection/PrivateRoute';
import Login from '../pages/User/Login';
import Otp from '../pages/User/Otp';
import Signup from '../pages/User/SignUP';
import OtpPageVerify from '../protection/OtpPageVerify';
import Home from '../pages/User/Home';
import LoginPrivate from '../protection/LoginPrivate';
import GooglePrivate from '../protection/googlePrivate';
import CreatePost from '../Components/User/CreatePost';
import LivePost from '../Components/User/LivePosts';
import ProfileComponent from '../Components/User/UserProfile';
import Posts from '../Components/User/Posts';
import EditProfile from '../Components/User/EditProfile';
import FriendProfile from '../Components/User/FriendProfile';
import FriendPosts from '../Components/User/FriendPosts';
import ForgotComponent from '../pages/User/Forgot';
import ChangePassword from '../pages/User/ChangePassword';
import ForgotPageVerify from '../protection/ForgotpageVerify';
import RegisterPrivate from '../protection/RegisterPrivate';
import ForgotEmailVerify from '../protection/ForgotEmail';
import PostEditingPage from '../Components/User/postEdit';
import SavedPosts from '../Components/User/SavedPosts';
import Notification from '../Components/User/Notification';
import Message from '../Components/User/Message';
import DefaultMsg from '../Components/User/DefaultMsg';
import MessageBox from '../Components/User/MessageBox';
import FriendRequestsList from '../Components/User/FriendRequestsList';
import FriendPage from '../Components/User/FriendsPage';
import Room from '../Components/User/Room';
import Lobby from '../Components/User/Lobby';
import NotFound from '../pages/User/NotFound';
import ServerErrorPage from '../pages/User/ServerError';


function UserRoutes() {
  return (

    <Routes>
      <Route path='/500' element={<ServerErrorPage />} />
      <Route path='/changePassword' element={<ForgotPageVerify />} />
      <Route element={<RegisterPrivate />}>
      <Route path="/register" element={<Signup />} />
      </Route>
      <Route path='/forgotPassword' element={<ForgotEmailVerify />} />
      <Route path='/googleForm' element={<GooglePrivate />} />
      <Route path="/login" element={<LoginPrivate />} />
      <Route path="/otp" element={<OtpPageVerify />} />

      <Route element={<PrivateRoute />}>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />}>
          <Route path='/home/lobby' element={<Lobby />} />
          <Route path='/home/room' element={<Room />} />
          <Route path='/home/friendRequests' element={<FriendRequestsList />} />
          <Route path='/home/profile/friendsList' element={<FriendPage />} />
          <Route path='/home/messages' element={<Message />}>
            <Route path='messageBox' element={<MessageBox />} />
            <Route index element={<DefaultMsg />} />
          </Route>
          <Route path='/home/notifications' element={<Notification />} />
          <Route path='/home/postDetails' element={<PostEditingPage />} />
          <Route path='/home/createPost' element={<CreatePost />} />
          <Route path='/home/editProfile' element={<EditProfile />} />
          <Route path='/home/friendProfile' element={<FriendProfile />}>
            <Route index element={<FriendPosts />} />
          </Route>
          <Route path='/home/profile' element={<ProfileComponent />}>
            <Route path='/home/profile/saved' element={<SavedPosts />} />
            <Route index element={<Posts />} />
          </Route>
          <Route index element={<LivePost />} />
        </Route>
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>

  );
}

export default UserRoutes;
