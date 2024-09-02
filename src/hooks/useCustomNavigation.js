// src/hooks/useCustomNavigate.js

import { useNavigate } from 'react-router-dom';

const useCustomNavigate = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return handleNavigation;
};

export default useCustomNavigate;
