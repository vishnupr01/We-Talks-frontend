import React, { useEffect, useState } from 'react';
import { getReports } from '../../api/admin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const users = [
  {
    name: 'Yaray Rosales',
    email: 'name@email.com',
    profile: 'https://via.placeholder.com/32', // Replace with actual profile image URL
    description: 'Manager of the sales team responsible for...'
  },
  {
    name: 'Lennert Nijenbjank',
    email: 'name@email.com',
    profile: 'https://via.placeholder.com/32',
    description: 'Admin overseeing IT operations...'
  },
  {
    name: 'Tallah Cotton',
    email: 'name@email.com',
    profile: 'https://via.placeholder.com/32',
    description: 'Lead Auditor for financial audits...'
  },
  // Add more users as needed
];

const ReportManagement = () => {
  const [reports, setReports] = useState([])
  const [loading,setLoading]=useState(false)
  const navigate=useNavigate()
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await getReports()
      console.log("reports", response);
      setReports(response.data.data)

    } catch (error) {
      throw error
    }finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  console.log("reports data", reports);
  const postDetails=(postId)=>{
    navigate(`/adminHome/postManagement`,{state:{postId}})
    }
    if(loading)return <div>loading...</div>
  return (
    <div className="container mx-auto p-4 ml-2">
      <div className="overflow-x-auto">
        <h1 className='ml-4 text-2xl text-black'>Report Management<span className='ml-2 text-red-500'><FontAwesomeIcon icon={faBan} className="text-xl" /></span> </h1>
       
        <table className="min-w-full mt-5 bg-white border border-gray-200">
          
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reports</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          
          {reports.length>=1&& <tbody>
          {reports.map((report, index) => (
            <tr key={index} className="border-t">
              <td className="px-6 py-4 whitespace-nowrap flex items-center">
                <img src={report.reporterDetails.profileImg} alt={`${report.reporterDetails.name} profile`} className="w-8 h-8 rounded-full mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{report.reporterDetails.name}</div>
                  <div className="text-sm text-gray-500">{report.reporterDetails.email}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{report.description}</div>
              </td>
              <td className="px-6 py-4 text-center">
                <button onClick={()=>postDetails(report.postId)} className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded-full">
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>}
         
        </table>
        {reports.length===0&&<h1 className='ml-2 text-blue-500 mt-2'>No reports yet...</h1>}
      </div>
    </div>
  );
};

export default ReportManagement;
