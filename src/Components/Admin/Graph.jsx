import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { dayDetails, monthDetails, yearDetails } from '../../api/admin'; // Import your API functions
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsGraph = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [graphData, setGraphData] = useState({ users: [], posts: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (timeframe === 'day') {
          response = await dayDetails();
        } else if (timeframe === 'month') {
          response = await monthDetails();
        } else {
          response = await yearDetails();
        }
        console.log("graph response",response);
        
        setGraphData({
          users: response.data.data.users,
          posts: response.data.data.posts,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [timeframe]);

  const data = {
    labels: timeframe === 'day' ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] :
            timeframe === 'month' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] :
            ['2022', '2023', '2024'],
    datasets: [
      {
        label: 'Users',
        data: graphData.users,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Posts',
        data: graphData.posts,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white'
        },
        position: 'top',
      },
      title: {
        display: true,
        text: `Statistics - ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}`,
        color: 'white',
      },
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      y: {
        ticks: { color: 'white' },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
  };

  return (
    <div className="bg-gray-800 p-6  rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4 text-white">User and Post Statistics</h2>
      <div className="flex justify-between mb-4">
        <button 
          onClick={() => setTimeframe('day')} 
          className={`px-4 py-2 rounded-md ${timeframe === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          Day
        </button>
        <button 
          onClick={() => setTimeframe('month')} 
          className={`px-4 py-2 rounded-md ${timeframe === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          Month
        </button>
        <button 
          onClick={() => setTimeframe('year')} 
          className={`px-4 py-2 rounded-md ${timeframe === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          Year
        </button>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};

export default StatisticsGraph;
