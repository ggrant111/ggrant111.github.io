import { useState, useEffect, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Pie, Doughnut, PolarArea } from 'react-chartjs-2';
import { NotificationPermission } from '@/components/NotificationPermission';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

interface TrackingLead {
  _id: string;
  firstName: string;
  lastName: string;
  destination: string;
  sentAt: string;
  success: boolean;
  sentBy: string;
  vehicle?: {
    make?: string;
    model?: string;
  };
}

interface LeadTrackingProps {
  salesPerson: string | null;
}

interface APIError extends Error {
  message: string;
  status?: number;
}

export const LeadTracking = ({ salesPerson }: LeadTrackingProps) => {
  const [leads, setLeads] = useState<TrackingLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    sentBy: salesPerson || '',
    startDate: '',
    endDate: ''
  });
  const [viewMode, setViewMode] = useState<'table' | 'dashboard'>('table');

  // Mapping of destination emails to store names
  const destinationNameMap: Record<string, string> = {
    'excellencemotors@eleadtrack.net': 'Excellence Motors',
    'excellencegm@eleadtrack.net': 'Universal Motors',
    'excellenceford@demosite.forddirectcrmpro.com': 'Excellence Ford',
  };

  // Function to get store name from email
  const getStoreName = (email: string): string => {
    return destinationNameMap[email] || email;
  };

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (filter.sentBy) params.append('sentBy', filter.sentBy);
      if (filter.startDate) params.append('startDate', filter.startDate);
      if (filter.endDate) params.append('endDate', filter.endDate);

      const response = await fetch(`/api/track-lead?${params.toString()}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch leads');
      }

      setLeads(data.leads || []);
    } catch (error: unknown) {
      const err = error as APIError;
      setError(err.message);
      // Clear leads instead of showing mock data
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [filter.sentBy, filter.startDate, filter.endDate]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Improved styling for better contrast
  const inputClassName = "mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm py-2 px-3 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  // Prepare data for charts
  const prepareChartData = () => {
    // Define a modern color palette
    const colors = {
      blue: ['rgba(56, 189, 248, 0.8)', 'rgba(59, 130, 246, 0.8)'],
      purple: ['rgba(168, 85, 247, 0.8)', 'rgba(139, 92, 246, 0.8)'],
      pink: ['rgba(236, 72, 153, 0.8)', 'rgba(219, 39, 119, 0.8)'],
      green: ['rgba(16, 185, 129, 0.8)', 'rgba(5, 150, 105, 0.8)'],
      orange: ['rgba(249, 115, 22, 0.8)', 'rgba(234, 88, 12, 0.8)'],
    };
    
    // Helper to create gradients
    const generateGradientColors = (count: number) => {
      const colorSets = Object.values(colors);
      return Array.from({ length: count }, (_, i) => 
        colorSets[i % colorSets.length][0]
      );
    };
    
    // Lead destinations distribution
    const destinationCounts: Record<string, number> = {};
    leads.forEach(lead => {
      // Use store name instead of email address
      const storeName = getStoreName(lead.destination);
      destinationCounts[storeName] = (destinationCounts[storeName] || 0) + 1;
    });
    
    // Sales person performance
    const salesPersonCounts: Record<string, number> = {};
    leads.forEach(lead => {
      if (lead.sentBy) {
        salesPersonCounts[lead.sentBy] = (salesPersonCounts[lead.sentBy] || 0) + 1;
      }
    });
    
    // Lead status breakdown
    const statusCounts = {
      success: leads.filter(lead => lead.success).length,
      failed: leads.filter(lead => !lead.success).length,
    };
    
    // Vehicle make breakdown
    const vehicleMakes: Record<string, number> = {};
    leads.forEach(lead => {
      const make = lead.vehicle?.make || 'Unknown';
      vehicleMakes[make] = (vehicleMakes[make] || 0) + 1;
    });

    // Common chart options
    const commonChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            padding: 20,
            color: '#4B5563',
            font: {
              size: 11,
              family: 'Inter, sans-serif',
            },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#1F2937',
          bodyColor: '#4B5563',
          borderColor: 'rgba(229, 231, 235, 1)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          boxPadding: 6,
          usePointStyle: true,
          titleFont: {
            size: 12,
            weight: 'bold' as const,
            family: 'Inter, sans-serif',
          },
          bodyFont: {
            size: 12,
            family: 'Inter, sans-serif',
          },
          callbacks: {
            label: function(context: any) {
              const label = context.dataset.label || '';
              const value = context.parsed || context.raw || 0;
              return `${label}: ${value}`;
            }
          }
        },
      },
    };
    
    return {
      destinations: {
        labels: Object.keys(destinationCounts),
        datasets: [
          {
            label: 'Leads',
            data: Object.values(destinationCounts),
            backgroundColor: generateGradientColors(Object.keys(destinationCounts).length),
            borderWidth: 0,
            borderRadius: 4,
          },
        ],
      },
      salesPersons: {
        labels: Object.keys(salesPersonCounts),
        datasets: [
          {
            label: 'Leads',
            data: Object.values(salesPersonCounts),
            backgroundColor: colors.blue[0],
            hoverBackgroundColor: colors.blue[1],
            borderWidth: 0,
            borderRadius: 6,
            barThickness: 20,
            maxBarThickness: 30,
          },
        ],
      },
      status: {
        labels: ['Successful', 'Failed'],
        datasets: [
          {
            data: [statusCounts.success, statusCounts.failed],
            backgroundColor: [colors.green[0], colors.pink[0]],
            hoverBackgroundColor: [colors.green[1], colors.pink[1]],
            borderWidth: 0,
            cutout: '70%',
          },
        ],
      },
      vehicles: {
        labels: Object.keys(vehicleMakes),
        datasets: [
          {
            data: Object.values(vehicleMakes),
            backgroundColor: generateGradientColors(Object.keys(vehicleMakes).length),
            borderWidth: 0,
          },
        ],
      },
      statusCounts,
      commonChartOptions
    };
  };
  
  const chartData = prepareChartData();
  const { statusCounts, commonChartOptions } = chartData;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <input
            type="text"
            name="sentBy"
            placeholder="Filter by Sales Person"
            value={filter.sentBy}
            onChange={handleFilterChange}
            className={inputClassName}
          />
          <input
            type="date"
            name="startDate"
            value={filter.startDate}
            onChange={handleFilterChange}
            className={inputClassName}
          />
          <input
            type="date"
            name="endDate"
            value={filter.endDate}
            onChange={handleFilterChange}
            className={inputClassName}
          />
        </div>
        {salesPerson && salesPerson !== 'default@example.com' && (
          <NotificationPermission userId={salesPerson} />
        )}
      </div>

      <div className="w-full max-w-7xl mx-auto">
        <div className="p-6 bg-white shadow-md rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Lead Tracking Dashboard</h2>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-md ${viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('dashboard')}
                className={`px-4 py-2 rounded-md ${viewMode === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Dashboard
              </button>
            </div>
          </div>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salesperson</label>
                <input
                  type="text"
                  name="sentBy"
                  value={filter.sentBy}
                  onChange={handleFilterChange}
                  placeholder="Filter by salesperson"
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={filter.startDate}
                  onChange={handleFilterChange}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={filter.endDate}
                  onChange={handleFilterChange}
                  className={inputClassName}
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => fetchLeads()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Display errors prominently */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
              <div className="flex">
                <div className="py-1">
                  <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">API Error</p>
                  <p className="text-sm">{error}</p>
                  <p className="text-sm mt-2">
                    Please check your Supabase connection and configuration. Detailed error information is available in the console.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : leads.length === 0 ? (
            <div className="bg-gray-50 p-8 text-center rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-2">No leads found</h3>
              <p className="text-gray-500">
                {error 
                  ? "There was an error fetching your leads. Please try adjusting your filters or check the API connection." 
                  : "Try adjusting your filters to see more results."}
              </p>
            </div>
          ) : (
            <>
              <div className="mt-4 text-sm text-gray-500">
                {leads.length} leads found
              </div>
              
              {viewMode === 'table' ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vehicle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Destination
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sales Person
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sent At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leads.map((lead) => (
                        <tr key={lead._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{lead.firstName} {lead.lastName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {lead.vehicle?.make && lead.vehicle?.model 
                                ? `${lead.vehicle.make} ${lead.vehicle.model}` 
                                : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{getStoreName(lead.destination)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{lead.sentBy || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(lead.sentAt)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              lead.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {lead.success ? 'Sent' : 'Failed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {leads.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No leads found. Try adjusting your filters.
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Leads by Sales Person</h3>
                    <div className="h-64">
                      <Bar 
                        data={chartData.salesPersons} 
                        options={{
                          ...commonChartOptions,
                          indexAxis: 'y' as const,
                          scales: {
                            x: {
                              grid: {
                                display: false,
                              },
                              ticks: {
                                color: '#9CA3AF',
                              }
                            },
                            y: {
                              grid: {
                                display: false,
                              },
                              ticks: {
                                color: '#9CA3AF',
                              }
                            }
                          },
                        }} 
                      />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Lead Status</h3>
                    <div className="h-64 flex justify-center items-center">
                      <div className="relative w-full h-full flex justify-center items-center">
                        <Doughnut 
                          data={chartData.status} 
                          options={{
                            ...commonChartOptions,
                            plugins: {
                              ...commonChartOptions.plugins,
                              tooltip: {
                                ...commonChartOptions.plugins.tooltip,
                                callbacks: {
                                  label: function(context: any) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    return `${label}: ${percentage}% (${value})`;
                                  }
                                }
                              }
                            },
                          }} 
                        />
                        {leads.length > 0 && (
                          <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <p className="text-3xl font-bold text-gray-800">
                              {Math.round((statusCounts.success / leads.length) * 100)}%
                            </p>
                            <p className="text-sm text-gray-500">Success Rate</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Leads by Destination</h3>
                    <div className="h-64 flex justify-center">
                      <Pie 
                        data={chartData.destinations} 
                        options={{
                          ...commonChartOptions,
                          plugins: {
                            ...commonChartOptions.plugins,
                            tooltip: {
                              ...commonChartOptions.plugins.tooltip,
                              callbacks: {
                                label: function(context: any) {
                                  const label = context.label || '';
                                  const value = context.raw || 0;
                                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                  const percentage = Math.round((value / total) * 100);
                                  return `${label}: ${percentage}% (${value})`;
                                }
                              }
                            }
                          },
                        }} 
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Leads by Vehicle Make</h3>
                    <div className="h-64 flex justify-center">
                      <PolarArea 
                        data={chartData.vehicles} 
                        options={{
                          ...commonChartOptions,
                          scales: {
                            r: {
                              display: false,
                            },
                          },
                          plugins: {
                            ...commonChartOptions.plugins,
                            tooltip: {
                              ...commonChartOptions.plugins.tooltip,
                              callbacks: {
                                label: function(context: any) {
                                  const label = context.label || '';
                                  const value = context.raw || 0;
                                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                  const percentage = Math.round((value / total) * 100);
                                  return `${label}: ${percentage}% (${value})`;
                                }
                              }
                            }
                          },
                        }} 
                      />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Key Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-sm">
                        <div className="flex items-center mb-2">
                          <div className="p-2 rounded-full bg-blue-100 text-blue-700 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                              <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-blue-700">Total Leads</p>
                        </div>
                        <p className="text-3xl font-bold text-blue-900">{leads.length}</p>
                        <div className="mt-3 text-xs text-blue-600">
                          Across all destinations
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg shadow-sm">
                        <div className="flex items-center mb-2">
                          <div className="p-2 rounded-full bg-green-100 text-green-700 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-green-700">Successful Leads</p>
                        </div>
                        <p className="text-3xl font-bold text-green-900">
                          {leads.filter(lead => lead.success).length}
                        </p>
                        <div className="mt-3 text-xs text-green-600">
                          {leads.length > 0 
                            ? `${Math.round((leads.filter(lead => lead.success).length / leads.length) * 100)}% success rate`
                            : 'No leads yet'}
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg shadow-sm">
                        <div className="flex items-center mb-2">
                          <div className="p-2 rounded-full bg-purple-100 text-purple-700 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-purple-700">Sales People</p>
                        </div>
                        <p className="text-3xl font-bold text-purple-900">
                          {new Set(leads.map(lead => lead.sentBy).filter(Boolean)).size}
                        </p>
                        <div className="mt-3 text-xs text-purple-600">
                          Active team members
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};