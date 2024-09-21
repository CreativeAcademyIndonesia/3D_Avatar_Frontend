import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import excel from '../assets/images/excel.png';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const backendUrl = import.meta.env.VITE_GCC_NODE_SERVER;

export function Dashboard() {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false); 
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Bulan 1-12
  const navigate = useNavigate();

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`${backendUrl}/avatar/chat/history?month=${month}`);
      if (!response.ok) {
        throw new Error('Gagal mengambil data chat history');
      }
      const data = await response.json();
      setChatHistory(data.data);
      // Swal.fire({
      //   icon: 'success',
      //   title: 'Success!',
      //   text: 'Chat history fetched successfully!',
      // });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Fetch Failed!',
        text: error.message,
        showCloseButton: false,
        showConfirmButton: false,
      });
      console.error('Error fetching chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory(); 
  }, [month]);

  const fetchChatDetails = async (session) => {
    try {
      const response = await fetch(`${backendUrl}/avatar/chat/history-details?session=${session}`);
      if (!response.ok) {
        throw new Error('Gagal mengambil detail chat');
      }
      const data = await response.json();
      setModalData(data.data);
      setShowModal(true);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Fetch Failed!',
        text: error.message,
        showCloseButton: false,
        showConfirmButton: false,
      });
    }
  };

  const fetchAnalytics = async (nama, session) => {
    setAnalyticsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/avatar/chat/analisa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama, session }),
      });
      if (!response.ok) {
        throw new Error('Gagal mengambil data analisis');
      }
      const data = await response.json();
      console.log('Analisis Data:', data);
      await fetchChatHistory();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Analytics fetched successfully!',
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      Swal.fire({
        icon: 'error',
        title: 'Fetch Failed!',
        text: error.message,
        showCloseButton: false,
        showConfirmButton: false,
      });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const downloadExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, `${fileName}.xlsx`);
  };

  const handleMonthChange = async (event) => {
      const selectedMonth = event.target.value.split('-')[1];
      setMonth(selectedMonth);
      // setLoading(true);
      // await fetchChatHistory();
  };

  const handleDownload = () => {
    if (chatHistory.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data',
        text: 'There is no chat history to download.',
      });
      return;
    }
    downloadExcel(chatHistory, 'ChatHistory');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center p-4 pointer-events-none">
      <div className="bg-white bg-opacity-80 p-4 rounded-xl border-2 border-[#4651CE] w-full max-w-4xl max-h-screen overflow-auto pointer-events-auto">
        <div className='mb-2 pb-1 border-b border-[#4651CE]'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex gap-2 items-center'>
              <h1 className="font-semibold text-2xl text-[#4651CE]">Analisa Chat</h1>
              <input type="month" className='bg-transparent'   value={`${new Date().getFullYear()}-${month.toString().padStart(2, '0')}`} onChange={handleMonthChange}  />
            </div>
            <button className='px-4 py-2 rounded-xl text-white' onClick={handleDownload}>
              <img src={excel} alt="Download Excel" className='w-6' />
            </button>
          </div>
          <p className='text-sm text-gray-600'>AUC = Area Under the Receiver Operating Characteristic Curve; the area measures discrimination, that is, the ability of the test to correctly classify those with and without the risk. [90-1.0 = Excellent; 80-.90 = Good; .70-.80 = Fair; .60-.70 = Poor]</p>
        </div>
        <table className="min-w-full">
          <thead>
            <tr className='text-[#4651CE]'>
              <th className='px-2 py-1 whitespace-nowrap'>ID</th>
              <th className='px-2 py-1 whitespace-nowrap'>Nama</th>
              <th className='px-2 py-1 whitespace-nowrap'>Session</th>
              <th className='px-2 py-1 whitespace-nowrap'>AI Sensitivity</th>
              <th className='px-2 py-1 whitespace-nowrap'>AI Specificity</th>
              <th className='px-2 py-1 whitespace-nowrap'>AI PPV</th>
              <th className='px-2 py-1 whitespace-nowrap'>AI AUC</th>
              <th className='px-2 py-1 whitespace-nowrap'>UC Sensitivity</th>
              <th className='px-2 py-1 whitespace-nowrap'>UC Specificity</th>
              <th className='px-2 py-1 whitespace-nowrap'>UC PPV</th>
              <th className='px-2 py-1 whitespace-nowrap'>UC AUC</th>
              <th className='px-2 py-1 whitespace-nowrap'>Score</th>
              <th className='px-2 py-1 whitespace-nowrap'>Action</th>
            </tr>
          </thead>
          <tbody>
            {chatHistory.map(item => (
              <tr key={item.id}>
                <td className='px-2 py-1 whitespace-nowrap'>{item.id}</td>
                <td className='px-2 py-1 whitespace-nowrap'>{item.nama}</td>
                <td className='px-2 py-1 whitespace-nowrap'>{item.session}</td>
                <td className='px-2 py-1 whitespace-nowrap'>{item.ai_sensitivity !== null ? item.ai_sensitivity : 'N/A'}</td>
                <td className='px-2 py-1 whitespace-nowrap'>{item.ai_spesificity !== null ? item.ai_spesificity : 'N/A'}</td>
                <td className='px-2 py-1 whitespace-nowrap'>{item.ai_ppv !== null ? item.ai_ppv : 'N/A'}</td>
                <td className='px-2 py-1 whitespace-nowrap'>{item.ai_auc !== null ? item.ai_auc : 'N/A'}</td>
                <td className='px-2 py-1 whitespace-nowrap'>{item.uc_sensitivity !== null ? item.uc_sensitivity : 'N/A'}</td>
                <td className='px-2 py-1 whitespace-nowrap'>{item.uc_spesificity !== null ? item.uc_spesificity : 'N/A'}</td>
                <td className='px-2 py-1 whitespace-nowrap'>{item.uc_ppv !== null ? item.uc_ppv : 'N/A'}</td>
                <td className='px-2 py-1 whitespace-nowrap'>{item.uc_auc !== null ? item.uc_auc : 'N/A'}</td>
                <td className='px-2 py-1 whitespace-nowrap'>{item.score !== null ? item.score : 'N/A'}</td>
                <td className='px-2 py-1 whitespace-nowrap'>
                  <div className='flex gap-2'>
                    <button onClick={() => fetchChatDetails(item.session)} className="bg-[#4651CE] px-4 py-2 rounded-xl text-white">Details</button>
                    <button 
                      onClick={() => fetchAnalytics(item.nama, item.session)} 
                      className={`px-4 py-2 rounded-xl text-white ${analyticsLoading ? 'bg-gray-400' : 'bg-yellow-500'}`}
                      disabled={analyticsLoading} 
                    >
                      {analyticsLoading ? 'Loading...' : 'Analytics'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 pointer-events-auto">
        <div className="bg-white p-4 rounded-xl max-w-xl max-h-[80vh] overflow-auto">
          <h2 className="text-xl mb-4">Detail Chat</h2>
          <ul>
            {modalData.map(detail => (
              <li key={detail.id} className="mb-2">
                <strong>Human:</strong> {detail.human_message}<br />
                <strong>AI:</strong> {detail.ai_message}<br />
                <small>{new Date(detail.created_at).toLocaleString()}</small>
              </li>
            ))}
          </ul>
          <button onClick={() => setShowModal(false)} className="mt-4 bg-[#4651CE] text-white px-4 p-2 rounded-xl">Close</button>
        </div>
      </div>
    )}
    </div>
  );
}



// <form onSubmit={handleSubmit}>
// <div className="mb-4">
//   <label htmlFor="nama" className="block mb-2 text-slate-800">Nama</label>
//   <input
//     type="text"
//     id="nama"
//     value={nama}
//     onChange={(e) => setNama(e.target.value)}
//     className="w-full placeholder:text-slate-800 placeholder:italic p-4 bg-opacity-30 bg-white backdrop-blur-md rounded-2xl outline-2 outline-offset-1 focus:outline focus:outline-[#4651CE]"
//     placeholder='Masukan Nama Anda'
//     required
//   />
// </div>
// <div className="mb-4">
//   <label htmlFor="password" className="block mb-2 text-slate-800">Access Key:</label>
//   <input
//     type="password"
//     id="password"
//     value={password}
//     onChange={(e) => setPassword(e.target.value)}
//     className="w-full placeholder:text-slate-800 placeholder:italic p-4 bg-opacity-30 bg-white backdrop-blur-md rounded-2xl outline-2 outline-offset-1 focus:outline focus:outline-[#4651CE]"
//     placeholder='Masukan Password'
//     required
//   />
// </div>
// <button 
//   type="submit" 
//   className="bg-[#4651CE] hover:bg-[#4651CE] text-white p-4 px-10 font-semibold uppercase rounded-2xl w-full"
// >
//   Masuk
// </button>
// </form>