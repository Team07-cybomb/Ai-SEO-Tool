import { AuditLog, User, ToolData } from "../types";

interface AuditTableProps {
  auditLogs: (AuditLog | ToolData)[];
  totalLogs: number;
  users?: User[];
  showToolColumn?: boolean;
}

export default function AuditTable({ 
  auditLogs, 
  totalLogs, 
  users = [], 
  showToolColumn = true 
}: AuditTableProps) {
  // Safe handling to prevent undefined errors
  const safeAuditLogs = auditLogs || [];
  const safeTotalLogs = totalLogs || 0;
  const safeUsers = users || [];

  // Function to find user for audit log
  const findUserForLog = (log: AuditLog | ToolData) => {
    // First try to find by userId
    if ('userId' in log && log.userId) {
      const user = safeUsers.find(user => user._id === log.userId);
      if (user) return user;
    }
    
    // Then try by userEmail
    if ('userEmail' in log && log.userEmail) {
      const user = safeUsers.find(user => user.email === log.userEmail);
      if (user) return user;
    }
    
    // Then try by email (alternative field)
    if ('email' in log && log.email) {
      const user = safeUsers.find(user => user.email === log.email);
      if (user) return user;
    }
    
    return null;
  };

  // Function to get action color
  const getActionColor = (action: string, tool: string = '') => {
    const actionLower = action.toLowerCase();
    const toolLower = tool.toLowerCase();
    
    if (actionLower.includes('login') || actionLower.includes('signin')) {
      return 'bg-green-100 text-green-800';
    } else if (actionLower.includes('logout') || actionLower.includes('signout')) {
      return 'bg-red-100 text-red-800';
    } else if (actionLower.includes('register') || actionLower.includes('signup')) {
      return 'bg-blue-100 text-blue-800';
    } else if (actionLower.includes('error') || actionLower.includes('fail')) {
      return 'bg-red-100 text-red-800';
    } else if (actionLower.includes('create') || actionLower.includes('add') || actionLower.includes('generate')) {
      return 'bg-purple-100 text-purple-800';
    } else if (actionLower.includes('update') || actionLower.includes('edit')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (actionLower.includes('delete') || actionLower.includes('remove')) {
      return 'bg-red-100 text-red-800';
    } else if (actionLower.includes('seo_audit') || actionLower.includes('audit') || toolLower.includes('seo_audit')) {
      return 'bg-indigo-100 text-indigo-800';
    } else if (actionLower.includes('name_generation') || toolLower.includes('business_name')) {
      return 'bg-pink-100 text-pink-800';
    } else if (actionLower.includes('keyword_analysis') || toolLower.includes('keyword_checker')) {
      return 'bg-orange-100 text-orange-800';
    } else if (actionLower.includes('keyword_scraping') || toolLower.includes('keyword_scraper')) {
      return 'bg-cyan-100 text-cyan-800';
    } else if (actionLower.includes('keyword_generation') || toolLower.includes('keyword_generator')) {
      return 'bg-teal-100 text-teal-800';
    } else if (actionLower.includes('page_view') || actionLower.includes('view')) {
      return 'bg-gray-100 text-gray-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to format the action for display
  const formatAction = (action: string, tool: string = '') => {
    const actionMap: { [key: string]: string } = {
      'page_view': 'Page View',
      'login': 'Login',
      'logout': 'Logout',
      'register': 'Register',
      'create': 'Create',
      'update': 'Update',
      'delete': 'Delete',
      'seo_audit': 'SEO Audit',
      'name_generation': 'Name Generation',
      'keyword_analysis': 'Keyword Analysis',
      'keyword_scraping': 'Keyword Scraping',
      'keyword_generation': 'Keyword Generation'
    };
    
    return actionMap[action] || action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Function to format tool name for display
  const formatToolName = (tool: string) => {
    const toolMap: { [key: string]: string } = {
      'seo_audit': 'SEO Audit',
      'business_name_generator': 'Business Name Generator',
      'keyword_checker': 'Keyword Checker',
      'keyword_scraper': 'Keyword Scraper',
      'keyword_generator': 'Keyword Generator'
    };
    
    return toolMap[tool] || tool.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Function to get display URL for different tool types
  const getDisplayUrl = (log: AuditLog | ToolData) => {
    if ('url' in log && log.url) return log.url;
    if ('mainUrl' in log && log.mainUrl) return log.mainUrl;
    if ('path' in log && log.path) return log.path;
    if ('endpoint' in log && log.endpoint) return log.endpoint;
    if ('uri' in log && log.uri) return log.uri;
    
    // For tool-specific data, create descriptive text
    if ('tool' in log) {
      switch (log.tool) {
        case 'business_name_generator':
          return `Industry: ${('industry' in log && log.industry) || 'N/A'}, Style: ${('stylePreference' in log && log.stylePreference) || 'N/A'}`;
        case 'keyword_generator':
          return `Topic: ${('topic' in log && log.topic) || 'N/A'}, Industry: ${('industry' in log && log.industry) || 'N/A'}`;
        case 'keyword_checker':
        case 'keyword_scraper':
          return `URL: ${('mainUrl' in log && log.mainUrl) || 'N/A'}`;
        default:
          return 'No URL available';
      }
    }
    
    return 'No URL available';
  };

  // Function to get timestamp
  const getTimestamp = (log: AuditLog | ToolData) => {
    if ('timestamp' in log && log.timestamp) return log.timestamp;
    if ('createdAt' in log && log.createdAt) return log.createdAt;
    if ('time' in log && log.time) return log.time;
    if ('date' in log && log.date) return log.date;
    if ('generatedAt' in log && log.generatedAt) return log.generatedAt;
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">
          Activity Logs ({safeAuditLogs.length})
        </h3>
        <span className="text-sm text-gray-500">
          Total: {safeTotalLogs} activities
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
              {showToolColumn && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tool
                </th>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {safeAuditLogs.length === 0 ? (
              <tr>
                <td colSpan={showToolColumn ? 5 : 4} className="px-6 py-8 text-center text-gray-500">
                  No activity logs found matching your criteria.
                </td>
              </tr>
            ) : (
              safeAuditLogs.map((item, idx) => {
                const action = ('action' in item && item.action) || ('type' in item && item.type) || ('event' in item && item.event) || 'activity';
                const tool = ('tool' in item && item.tool) || 'seo_audit';
                const url = getDisplayUrl(item);
                const user = findUserForLog(item);
                const displayName = ('userName' in item && item.userName) || user?.name || 'Anonymous User';
                const displayEmail = ('userEmail' in item && item.userEmail) || user?.email || ('email' in item && item.email) || 'Unknown';
                const timestamp = getTimestamp(item);

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
                                {displayName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {displayEmail}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center text-gray-500">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium text-sm">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {displayName}
                              </div>
                              <div className="text-xs text-gray-400">
                                {displayEmail}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionColor(action, tool)}`}
                        title={`Action: ${action}`}
                      >
                        {formatAction(action)}
                      </span>
                    </td>
                    {showToolColumn && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {formatToolName(tool)}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm text-gray-900 break-words max-w-md">
                      <div className="truncate" title={url}>
                        {url}
                      </div>
                      {url.length > 50 && (
                        <div className="text-xs text-gray-400 mt-1">
                          {url.substring(0, 50)}...
                        </div>
                      )}
                      {/* Additional tool-specific details */}
                      {tool === 'business_name_generator' && 'nameCount' in item && (
                        <div className="text-xs text-gray-500 mt-1">
                          {item.nameCount} names generated
                        </div>
                      )}
                      {tool === 'keyword_generator' && 'keywordCount' in item && (
                        <div className="text-xs text-gray-500 mt-1">
                          {item.keywordCount} keywords generated
                        </div>
                      )}
                      {(tool === 'keyword_checker' || tool === 'keyword_scraper') && 'keywordCount' in item && (
                        <div className="text-xs text-gray-500 mt-1">
                          {item.keywordCount} keywords found
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {timestamp ? (
                        <>
                          <div>{new Date(timestamp).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(timestamp).toLocaleTimeString()}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">No timestamp</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}