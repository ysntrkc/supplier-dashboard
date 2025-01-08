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
import { useDarkMode } from './DarkModeContext.jsx';

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
    <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className={`vendor-section ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="vendor-header">
          <h2 className={`section-title ${isDarkMode ? 'dark' : 'light'}`}>Select a Vendor</h2>
          <button
            onClick={toggleDarkMode}
            className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
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

        {error && (
          <div className={`error-message ${isDarkMode ? 'dark' : 'light'}`}>
            {error}
          </div>
        )}

        {selectedVendor && (
          <div className={`vendor-info ${isDarkMode ? 'dark' : 'light'}`}>
            <p>
              Selected Vendor ID: <span className="font-mono font-medium">{selectedVendor.value}</span>
            </p>
          </div>
        )}
      </div>

      {selectedVendor && (
        <div className={`chart-container ${isDarkMode ? 'dark' : 'light'}`}>
          <div className="chart-header">
            <h3 className={`chart-title ${isDarkMode ? 'dark' : 'light'}`}>Sales Overview</h3>
            <div className={`chart-controls ${isDarkMode ? 'dark' : 'light'}`}>
              <button
                className={`chart-button ${chartType === 'bar' ? 'active' : ''} ${isDarkMode ? 'dark' : 'light'}`}
                onClick={() => setChartType('bar')}
              >
                Bar Chart
              </button>
              <button
                className={`chart-button ${chartType === 'line' ? 'active' : ''} ${isDarkMode ? 'dark' : 'light'}`}
                onClick={() => setChartType('line')}
              >
                Line Chart
              </button>
            </div>
          </div>
          <div className={`chart-content ${isDarkMode ? 'dark' : 'light'}`}>
            {isChartLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : chartData?.datasets[0]?.data.length === 0 ? (
              <div className="no-data">
                No sales data available
              </div>
            ) : (
              chartType === 'bar' ? <Bar data={chartData} /> : <Line data={chartData} />
            )}
          </div>
        </div>
      )}

      {selectedVendor && (
        <div className={`table-container ${isDarkMode ? 'dark' : 'light'}`}>
          <h3 className={`table-title ${isDarkMode ? 'dark' : 'light'}`}>Product Sales</h3>
          {isTableLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : tableData.length === 0 ? (
            <div className="no-data">
              No product sales data available
            </div>
          ) : (
            <div className={`table-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
              <table className={`data-table ${isDarkMode ? 'dark' : 'light'}`}>
                <thead className={`table-header ${isDarkMode ? 'dark' : 'light'}`}>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className={`table-header-cell ${isDarkMode ? 'dark' : 'light'}`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.isPlaceholder
                            ? null
                            : (
                              <div className="header-content">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {header.column.getCanSort() && (
                                  <span className={`sort-indicator ${isDarkMode ? 'dark' : 'light'}`}>
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
                <tbody className={`table-body ${isDarkMode ? 'dark' : 'light'}`}>
                  {table.getRowModel().rows.map(row => (
                    <tr 
                      key={row.id} 
                      className={`table-row ${isDarkMode ? 'dark' : 'light'}`}
                    >
                      {row.getVisibleCells().map(cell => (
                        <td 
                          key={cell.id} 
                          className={`table-cell ${isDarkMode ? 'dark' : 'light'}`}
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
