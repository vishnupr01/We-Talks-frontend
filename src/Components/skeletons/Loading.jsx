import React from 'react';

const SkeletonLoading = () => {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="h-5 w-3/4 bg-base-300 rounded animate-pulse"></div>
      <div className="h-5 w-full bg-base-300 rounded animate-pulse"></div>
      <div className="h-5 w-full bg-base-300 rounded animate-pulse"></div>
    
    </div>
  );
};

export default SkeletonLoading;
