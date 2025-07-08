import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faGear, faRightFromBracket, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';

export const UserControls = ({ nama, sessionId, onResetSession }) => {
  const navigate = useNavigate();
  const { handleLogout, role } = useChat();

  return (
    <div>
      <div className='fixed top-4 left-4 flex items-start gap-4'>
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {nama ? nama[0].toUpperCase() : '?'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{nama || "Tamu"}</h3>
              <p className="text-xs text-gray-500">Sesi: {sessionId || "-"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed top-4 right-4 flex items-start gap-4">
      
        {/* Controls */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onResetSession}
            className="p-3 rounded-xl bg-white bg-opacity-90 backdrop-blur-md shadow-lg hover:bg-opacity-100 transition-all duration-200 text-indigo-600 group relative"
            title="Reset Sesi"
          >
            <FontAwesomeIcon icon={faEraser} />
            <span className="absolute right-full mr-2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Reset Sesi
            </span>
          </button>

          {role === 'admin' && (
            <button
              onClick={() => navigate('/dashboard')}
              className="p-3 rounded-xl bg-white bg-opacity-90 backdrop-blur-md shadow-lg hover:bg-opacity-100 transition-all duration-200 text-indigo-600 group relative"
              title="Dashboard Admin"
            >
              <FontAwesomeIcon icon={faChartLine} />
              <span className="absolute right-full mr-2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Dashboard Admin
              </span>
            </button>
          )}

          <a
            href="/reset-password"
            className="p-3 rounded-xl bg-white bg-opacity-90 backdrop-blur-md shadow-lg hover:bg-opacity-100 transition-all duration-200 text-indigo-600 group relative"
            title="Pengaturan"
          >
            <FontAwesomeIcon icon={faGear} />
            <span className="absolute right-full mr-2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Pengaturan
            </span>
          </a>

          <button
            onClick={handleLogout}
            className="p-3 rounded-xl bg-white bg-opacity-90 backdrop-blur-md shadow-lg hover:bg-opacity-100 transition-all duration-200 text-red-600 group relative"
            title="Keluar"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span className="absolute right-full mr-2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Keluar
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}; 