import { AuditLog, User } from "../types";

interface AuditTableProps {
  auditLogs: AuditLog[];
  totalLogs: number;
  users?: User[];
}

export default function AuditTable({ auditLogs, totalLogs, users = [] }: AuditTableProps) {
  // Safe handling to prevent undefined errors
  const safeAuditLogs = auditLogs || [];
  const safeTotalLogs = totalLogs || 0;
  const safeUsers = users || [];

  // Function to find user by some identifier (you might need to adjust this based on your data structure)
  const findUserForLog = (log: AuditLog) => {
    // This is a placeholder - you'll need to adjust the matching logic based on your actual data
    // If your audit logs had userEmail or userId, we could match them properly
    return null; // Currently returns null since we don't have user info in logs
  };

  // Function to get action color
  const getActionColor = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('login') || actionLower.includes('signin')) {
      return 'bg-green-100 text-green-800';
    } else if (actionLower.includes('logout') || actionLower.includes('signout')) {
      return 'bg-red-100 text-red-800';
    } else if (actionLower.includes('register') || actionLower.includes('signup')) {
      return 'bg-blue-100 text-blue-800';
    } else if (actionLower.includes('error') || actionLower.includes('fail')) {
      return 'bg-red-100 text-red-800';
    } else if (actionLower.includes('create') || actionLower.includes('add')) {
      return 'bg-purple-100 text-purple-800';
    } else if (actionLower.includes('update') || actionLower.includes('edit')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (actionLower.includes('delete') || actionLower.includes('remove')) {
      return 'bg-red-100 text-red-800';
    } else if (actionLower.includes('page_view') || actionLower.includes('view')) {
      return 'bg-gray-100 text-gray-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to format the action for display
  const formatAction = (action: string) => {
    const actionMap: { [key: string]: string } = {
      'page_view': 'Page View',
      'login': 'Login',
      'logout': 'Logout',
      'register': 'Register',
      'create': 'Create',
      'update': 'Update',
      'delete': 'Delete'
    };
    
    return actionMap[action] || action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">
          Audit Logs ({safeAuditLogs.length})
        </h3>
        <span className="text-sm text-gray-500">
          Total: {safeTotalLogs} logs
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {safeAuditLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No audit logs found matching your criteria.
                </td>
              </tr>
            ) : (
              safeAuditLogs.map((item, idx) => {
                const action = item.action || 'page_view';
                const url = item.url || 'No URL';
                const user = findUserForLog(item);

                return (
                  <tr key={item._id || idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user ? (
                          <>
                            {user.profilePicture ? (
                              <img
                                src={user.profilePicture}
                                alt={user.name}
                                className="h-8 w-8 rounded-full"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                                {user.name?.charAt(0) || 'U'}
                              </div>
                            )}
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center text-gray-400">
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="text-sm">Anonymous User</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionColor(action)}`}
                        title={`Action: ${action}`}
                      >
                        {formatAction(action)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 break-words max-w-md">
                      <div className="truncate" title={url}>
                        {url}
                      </div>
                      {url.length > 50 && (
                        <div className="text-xs text-gray-400 mt-1">
                          {url.substring(0, 50)}...
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-gray-400">No timestamp</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Information about missing data */}
      {safeAuditLogs.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-blue-50">
          <div className="flex items-center text-sm text-blue-700">
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>
              Audit logs are currently tracking anonymous page views. User identification will appear when users are logged in.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}