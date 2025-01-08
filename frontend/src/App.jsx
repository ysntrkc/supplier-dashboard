import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useReactTable, getCoreRowModel, getSortedRowModel, createColumnHelper, flexRender } from '@tanstack/react-table';
import axios from 'axios';
import { useDarkMode } from './DarkModeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/vendor`);
        if (response.data.type === 'success') {
          setVendors(response.data.data);
        }
      } catch (err) {
        setError('Failed to fetch vendors');
        console.error(err);
      }
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedVendor) {
        setChartData({
          labels: [],
          datasets: [{
            label: 'Monthly Sales',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            tension: 0.1,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          }],
        });
        setTableData([]);
        return;
      }

      setIsChartLoading(true);
      setIsTableLoading(true);

      try {
        const monthlySalesResponse = await axios.get(
          `${backendUrl}/api/dashboard/monthly/${selectedVendor.value}`
        );

        if (monthlySalesResponse.data.type === 'success') {
          const sales = monthlySalesResponse.data.data;
          
          // Set empty chart data if no sales
          if (sales.length === 0) {
            setChartData({
              labels: [],
              datasets: [{
                label: 'Monthly Sales',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                tension: 0.1,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              }],
            });
          } else {
            const firstMonth = sales[0].label;
            const lastMonth = sales[sales.length - 1].label;
            const allMonths = getMonthsBetween(firstMonth, lastMonth);
            const salesMap = new Map(sales.map(item => [item.label, item.value]));
            const data = allMonths.map(month => salesMap.get(month) || 0);

            setChartData({
              labels: allMonths,
              datasets: [{
                label: 'Monthly Sales',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                tension: 0.1,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              }],
            });
          }
        }
        setIsChartLoading(false);

        const productSalesResponse = await axios.get(
          `${backendUrl}/api/dashboard/product/${selectedVendor.value}`
        );

        if (productSalesResponse.data.type === 'success') {
          setTableData(productSalesResponse.data.data);
        }
        setIsTableLoading(false);

      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
        setIsChartLoading(false);
        setIsTableLoading(false);
      }
    };

    fetchData();
  }, [selectedVendor]);

  const options = vendors.map(vendor => ({
    value: vendor._id,
    label: vendor.name,
  }));

  function getMonthsBetween(startMonth, endMonth) {
    const months = [];
    let currentMonth = new Date(startMonth + '-01');
    const endDate = new Date(endMonth + '-01');

    while (currentMonth <= endDate) {
      const year = currentMonth.getFullYear();
      const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
      months.push(`${year}-${month}`);
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }
    return months;
  }

  const handleChange = (selectedOption) => {
    setError(null);
    setSelectedVendor(selectedOption);
  };

  const columnHelper = createColumnHelper();
  const columns = useMemo(
    () => [
			columnHelper.accessor('code', {
				header: 'Product Code',
			}),
      columnHelper.accessor('name', {
        header: 'Product Name',
      }),
			columnHelper.accessor('color', {
				header: 'Color',
			}),
      columnHelper.accessor('total', {
        header: 'Total Sales',
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'} p-6`}>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-lg w-full max-w-md mb-8 backdrop-blur-sm backdrop-filter`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Select a Vendor</h2>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
        </div>
        
        <Select
          options={options}
          onChange={handleChange}
          placeholder="Search vendors..."
          isSearchable
          isClearable
          className="text-sm"
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: '#3B82F6',
              primary25: isDarkMode ? '#374151' : '#EFF6FF',
              primary50: isDarkMode ? '#4B5563' : '#DBEAFE',
              neutral0: isDarkMode ? '#1F2937' : 'white',
              neutral80: isDarkMode ? '#F3F4F6' : '#1F2937',
              neutral50: isDarkMode ? '#9CA3AF' : '#6B7280', // placeholder text
              neutral30: isDarkMode ? '#6B7280' : '#D1D5DB', // border color
              neutral20: isDarkMode ? '#4B5563' : '#E5E7EB', // border color (unfocused)
            },
          })}
          styles={{
            input: (provided) => ({
              ...provided,
              color: isDarkMode ? 'white' : 'inherit',
            }),
            singleValue: (provided) => ({
              ...provided,
              color: isDarkMode ? 'white' : 'inherit',
            }),
            option: (provided, state) => ({
              ...provided,
              color: isDarkMode ? (state.isSelected ? 'white' : '#F3F4F6') : provided.color,
            }),
          }}
        />

        {/* Update error message styles */}
        {error && (
          <div className={`mt-4 p-3 ${isDarkMode ? 'bg-red-900/50 border-red-800 text-red-200' : 'bg-red-50 border-red-200 text-red-700'} rounded-lg border`}>
            {error}
          </div>
        )}

        {/* Update selected vendor styles */}
        {selectedVendor && (
          <div className={`mt-4 p-3 ${isDarkMode ? 'bg-blue-900/50 border-blue-800 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-800'} rounded-lg border`}>
            <p>
              Selected Vendor ID: <span className="font-mono font-medium">{selectedVendor.value}</span>
            </p>
          </div>
        )}
      </div>

      {/* Update chart container styles */}
      {selectedVendor && (
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg w-full max-w-4xl mb-8`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Sales Overview</h3>
            <div className={`inline-flex rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'} p-1`}>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  chartType === 'bar'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setChartType('bar')}
              >
                Bar Chart
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  chartType === 'line'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setChartType('line')}
              >
                Line Chart
              </button>
            </div>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {isChartLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : chartData?.datasets[0]?.data.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No sales data available
              </div>
            ) : (
              chartType === 'bar' ? <Bar data={chartData} /> : <Line data={chartData} />
            )}
          </div>
        </div>
      )}

      {selectedVendor && (
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg w-full max-w-4xl overflow-hidden`}>
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Product Sales</h3>
          {isTableLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : tableData.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              No product sales data available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                <thead className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors
                            ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.isPlaceholder
                            ? null
                            : (
                              <div className="flex items-center space-x-1">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {header.column.getCanSort() && (
                                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>
                                    {header.column.getIsSorted()
                                      ? header.column.getIsSorted() === 'asc'
                                        ? '↑'
                                        : '↓'
                                      : ''}
                                  </span>
                                )}
                              </div>
                            )
                          }
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className={`${isDarkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                  {table.getRowModel().rows.map(row => (
                    <tr 
                      key={row.id} 
                      className={`transition-colors ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                    >
                      {row.getVisibleCells().map(cell => (
                        <td 
                          key={cell.id} 
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
