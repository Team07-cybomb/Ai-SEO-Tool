interface HeaderProps {
  activeTab: string;
  onRefresh: () => void;
  error: string | null;
}

export default function Header({ activeTab, onRefresh, error }: HeaderProps) {
  const getTabTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Dashboard Overview";
      case "users":
        return "User Management";
      case "audit":
        return "Audit Logs";
      default:
        return "Dashboard";
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case "overview":
        return "Real-time user statistics and overview";
      case "users":
        return "Manage and view all registered users";
      case "audit":
        return "Track user activities and system logs";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{getTabTitle()}</h2>
          <p className="text-gray-600 text-sm mt-1">{getTabDescription()}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onRefresh}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh
          </button>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Admin User</span>
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}
    </>
  );
}