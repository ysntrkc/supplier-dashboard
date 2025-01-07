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
  Legend
} from 'chart.js';
import { useReactTable, getCoreRowModel, getSortedRowModel, createColumnHelper, flexRender } from '@tanstack/react-table';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('bar'); // Add this new state

  // Fetch vendors on component mount
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

  // Fetch chart and table data when vendor is selected
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedVendor) {
        setChartData(null);
        setTableData([]);
        return;
      }

      try {
        // Fetch monthly sales data
        const monthlySalesResponse = await axios.get(
          `${backendUrl}/api/dashboard/monthly/${selectedVendor.value}`
        );

        if (monthlySalesResponse.data.type === 'success') {
          const sales = monthlySalesResponse.data.data;
          
          if (sales.length > 0) {
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
                tension: 0.1, // Makes the line smoother
                fill: true,   // Fill area under the line
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              }],
            });
          }
        }

        // Fetch product sales data
        const productSalesResponse = await axios.get(
          `${backendUrl}/api/dashboard/product/${selectedVendor.value}`
        );

        if (productSalesResponse.data.type === 'success') {
          setTableData(productSalesResponse.data.data);
        }

      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
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
      columnHelper.accessor('name', {
        header: 'Product Name',
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mb-8 backdrop-blur-sm backdrop-filter">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Select a Vendor</h2>
        <Select
          options={options}
          onChange={handleChange}
          placeholder="Search vendors..."
          isSearchable
          className="text-sm"
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: '#3B82F6',
              primary25: '#EFF6FF',
              primary50: '#DBEAFE',
            },
          })}
        />
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {selectedVendor && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              Selected Vendor ID: <span className="font-mono font-medium">{selectedVendor.value}</span>
            </p>
          </div>
        )}
      </div>
      {chartData && (
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Sales Overview</h3>
            <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
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
          <div className="p-4 bg-gray-50 rounded-lg">
            {chartType === 'bar' ? <Bar data={chartData} /> : <Line data={chartData} />}
          </div>
        </div>
      )}
      {tableData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl overflow-hidden">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Product Sales</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder
                          ? null
                          : (
                            <div className="flex items-center space-x-1">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getCanSort() && (
                                <span className="text-gray-400">
                                  {header.column.getIsSorted()
                                    ? header.column.getIsSorted() === 'asc'
                                      ? '↑'
                                      : '↓'
                                    : '↕'}
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
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map(row => (
                  <tr 
                    key={row.id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td 
                        key={cell.id} 
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
