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
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, createColumnHelper, flexRender } from '@tanstack/react-table';
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
  const [tableData, setTableData] = useState({ products: [], pagination: null });
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [sorting, setSorting] = useState({ sort_by: '', sort_order: '' });
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

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

  const fetchTableData = async () => {
    if (!selectedVendor) return;
    
    setIsTableLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/dashboard/product/${selectedVendor.value}`, {
        params: {
          page: pageIndex + 1,
          limit: pageSize,
          ...(sorting.sort_by && { sort_by: sorting.sort_by }),
          ...(sorting.sort_order && { sort_order: sorting.sort_order }),
          ...(search && { search }),
        }
      });

      if (response.data.type === 'success') {
        setTableData(response.data.data);
      }
      setIsTableLoading(false);
    } catch (err) {
      setError('Failed to fetch table data');
      console.error(err);
      setIsTableLoading(false);
    }
  };

  useEffect(() => {
    const fetchChartData = async () => {
      if (!selectedVendor) {
        setChartData({
          labels: [],
          datasets: [{
            label: 'Monthly Sales',
            data: [],
            backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.6)' : 'rgba(75, 192, 192, 0.6)',
            borderColor: isDarkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            tension: 0.1,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: isDarkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(75, 192, 192, 1)',
          }],
        });
        return;
      }

      setIsChartLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/dashboard/monthly/${selectedVendor.value}`);

        if (response.data.type === 'success') {
          const sales = response.data.data;
          
          if (sales.length === 0) {
            setChartData({
              labels: [],
              datasets: [{
                label: 'Monthly Sales',
                data: [],
                backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.6)' : 'rgba(75, 192, 192, 0.6)',
                borderColor: isDarkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                tension: 0.1,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: isDarkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(75, 192, 192, 1)',
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
                backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.6)' : 'rgba(75, 192, 192, 0.6)',
                borderColor: isDarkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                tension: 0.1,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: isDarkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(75, 192, 192, 1)',
              }],
            });
          }
        }
        setIsChartLoading(false);
      } catch (err) {
        setError('Failed to fetch chart data');
        console.error(err);
        setIsChartLoading(false);
      }
    };

    fetchChartData();
  }, [selectedVendor, isDarkMode]);

  useEffect(() => {
    fetchTableData();
  }, [selectedVendor, pageIndex, pageSize, sorting, search]);

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

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setSearch(searchInput);
      setPageIndex(0);
    }
  };

  const handleSearchClick = () => {
    setSearch(searchInput);
    setPageIndex(0);
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
    data: tableData.products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: tableData.pagination?.total_pages ?? -1,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      sorting: sorting.sort_by ? [{ id: sorting.sort_by, desc: sorting.sort_order === 'desc' }] : [],
    },
    onSortingChange: (updater) => {
      const currentSorting = sorting.sort_by ? [{ id: sorting.sort_by, desc: sorting.sort_order === 'desc' }] : [];
      const newSorting = typeof updater === 'function' ? updater(currentSorting) : updater;

      if (newSorting.length === 0) {
        setSorting({ sort_by: '', sort_order: '' });
      } else {
        const [currentSort] = currentSorting;
        const [newSort] = newSorting;

        if (currentSort?.id === newSort.id && currentSort?.desc) {
          setSorting({ sort_by: '', sort_order: '' });
        } else {
          setSorting({
            sort_by: newSort.id,
            sort_order: newSort.desc ? 'desc' : 'asc',
          });
        }
      }
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex, pageSize });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
  });

  const chartOptions = {
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? '#F3F4F6' : '#374151'
        },
        grid: {
          color: isDarkMode ? '#4B5563' : '#E5E7EB',
          lineWidth: isDarkMode ? 0.5 : 1
        }
      },
      y: {
        ticks: {
          color: isDarkMode ? '#F3F4F6' : '#374151'
        },
        grid: {
          color: isDarkMode ? '#4B5563' : '#E5E7EB',
          lineWidth: isDarkMode ? 0.5 : 1
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? '#F3F4F6' : '#374151'
        }
      }
    }
  };

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
              neutral50: isDarkMode ? '#9CA3AF' : '#6B7280',
              neutral30: isDarkMode ? '#6B7280' : '#D1D5DB',
              neutral20: isDarkMode ? '#4B5563' : '#E5E7EB',
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
              chartType === 'bar' ? 
                <Bar data={chartData} options={chartOptions} /> : 
                <Line data={chartData} options={chartOptions} />
            )}
          </div>
        </div>
      )}

      {selectedVendor && (
        <div className={`table-container ${isDarkMode ? 'dark' : 'light'}`}>
          <div className="table-header-section">
            <h3 className={`table-title ${isDarkMode ? 'dark' : 'light'}`}>Product Sales</h3>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className={`search-input ${isDarkMode ? 'dark' : 'light'}`}
              />
              <button
                onClick={handleSearchClick}
                className={`search-button ${isDarkMode ? 'dark' : 'light'}`}
              >
                Search
              </button>
            </div>
          </div>
          {isTableLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : tableData.products.length === 0 ? (
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
              <div className={`pagination ${isDarkMode ? 'dark' : 'light'}`}>
                <button
                  onClick={() => setPageIndex(old => Math.max(old - 1, 0))}
                  disabled={pageIndex === 0}
                  className={`pagination-button ${isDarkMode ? 'dark' : 'light'}`}
                >
                  Previous
                </button>
                <span className={`pagination-info ${isDarkMode ? 'dark' : 'light'}`}>
                  Page {pageIndex + 1} of {tableData.pagination?.total_pages || 1}
                  {tableData.pagination && (
                    <> | Total: {tableData.pagination.total} items</>
                  )}
                </span>
                <button
                  onClick={() => setPageIndex(old => 
                    tableData.pagination ? Math.min(old + 1, tableData.pagination.total_pages - 1) : old
                  )}
                  disabled={!tableData.pagination || pageIndex >= tableData.pagination.total_pages - 1}
                  className={`pagination-button ${isDarkMode ? 'dark' : 'light'}`}
                >
                  Next
                </button>
                <select
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                    setPageIndex(0);
                  }}
                  className={`page-size-select ${isDarkMode ? 'dark' : 'light'}`}
                >
                  {[10, 25, 50, 100].map(size => (
                    <option key={size} value={size}>
                      Show {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
