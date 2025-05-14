import { useContext, useEffect, useState, useRef } from 'react';
import { Menu, RefreshCw, Download, FileText, FileDown } from 'lucide-react';
import { LoaderContext } from '../contexts/LoaderContext';
import { api, basePath } from '../services/api';

const DataTable = ({ headers = [], hit_url = '', actions=[], Export=[], reloadTrigger }) => {
    const { startLoading, finishLoading } = useContext(LoaderContext);
    const [sortKey, setSortKey] = useState('');
    const [tableState, setTableState] = useState({
        data: [],
        perPage: 5,
        page: 1,
        total: 0,
        search: '',
        sortDirection: 'desc',
        reloadTrigger: 0,
    });

    const isExport = Export.isExport;

    const { data, perPage, page, total, search, sortDirection } = tableState;

    const [activeDropdown, setActiveDropdown] = useState(null);
    const containerRef = useRef(null);
    const [tableHeaders] = useState(headers);

    const totalPages = Math.ceil(total / perPage);

    const token = localStorage.getItem('token');

    const fetchData = async () => {
        startLoading();
        try {
            const response = await api.get(basePath + hit_url, {
                params: {
                    page: tableState.page,
                    per_page: tableState.perPage,
                    search: tableState.search,
                    sort: tableState.sortDirection,
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // console.log(response.data)
            setTableState(prev => ({
                ...prev,
                data: response.data.users || [],
                total: response.data.total || 0,
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            finishLoading();
        }
    };

    useEffect(() => {
        fetchData();
    }, [tableState.page, tableState.perPage, tableState.search, tableState.sortDirection, tableState.reloadTrigger, reloadTrigger]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const clickedInsideDropdown = e.target.closest('.dropdown-ignore') || e.target.closest('.dropdown-menu');
            if (!clickedInsideDropdown) {
                setActiveDropdown(null);
            }
        };
    
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);    

    const toggleDropdown = (key) => {
        setActiveDropdown(prev => (prev === key ? null : key));
    };

    const handleSort = (key) => {
        if (tableHeaders.find(h => h.key === key)?.sortable) {
            setTableState(prev => ({
                ...prev,
                sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc',
            }));
            setSortKey(key);
        }
    };

    const handleReload = () => {
        setTableState(prev => ({
            ...prev,
            page: 1,
            reloadTrigger: prev.reloadTrigger + 1,
        }));
    };

    const handlePerPageChange = (newPerPage) => {
        setTableState(prev => ({ ...prev, perPage: newPerPage, page: 1 }));
        setActiveDropdown(null);
    };

    const handleSearchChange = (val) => {
        setTableState(prev => ({ ...prev, search: val, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setTableState(prev => ({ ...prev, page: newPage }));
    };

    const handleExportCSV = async () => {
        try {
            const response = await api.get(basePath + Export.hit_url_csv, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            var fileName = Export.hit_url_csv;
            fileName = fileName.replace(/\//g, '');
            link.href = url;
            link.download = fileName+".csv";
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('CSV export failed:', error);
        }
    };
    
    const handleExportPDF = async () => {
        try {
            const response = await api.get(basePath + Export.hit_url_pdf, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            var fileName = Export.hit_url_pdf;
            fileName = fileName.replace(/\//g, '');
            link.href = url;
            link.download = fileName+".pdf";
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('PDF export failed:', error);
        }
    };      

    return (
        <div ref={containerRef} className="p-4">
            {/* Controls (reload, export, perPage, search) */}
            <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                <div className="flex items-center flex-wrap gap-2">
                    <button className="table-btn px-4 py-2 rounded-lg text-sm flex items-center" onClick={handleReload}>
                        <RefreshCw size={16} className="mr-2" />
                        Reload
                    </button>

                    {isExport && (<div className="relative">
                        <button className="table-btn px-4 py-2 rounded-lg text-sm dropdown-ignore flex items-center" onClick={() => toggleDropdown('export')}>
                            <Download size={16} className="mr-2" />
                            Export
                        </button>
                        {activeDropdown === 'export' && (
                            <div className="absolute top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 animate-fade-in">
                                <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={handleExportCSV}><FileText size={16} className="mr-2" /> Export CSV</button>
                                <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={handleExportPDF}><FileDown size={16} className="mr-2" /> Export PDF</button>
                            </div>
                        )}
                    </div>)}

                    <div className="relative">
                        <button className="table-btn px-4 py-2 rounded-lg text-sm dropdown-ignore" onClick={() => toggleDropdown('perPage')}>
                            Show {perPage} rows
                        </button>
                        {activeDropdown === 'perPage' && (
                            <div className="absolute top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 animate-fade-in">
                                {[5, 10, 25, 50, 100].map(n => (
                                    <button key={n} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handlePerPageChange(n)}>
                                        Show {n} rows
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="Search..."
                    className="border px-3 py-2 rounded-xl text-sm dark:bg-gray-900 dark:text-white"
                    value={search}
                    onChange={e => handleSearchChange(e.target.value)}
                />
            </div>

            {/* Table */}
            <table className="min-w-full table-auto border-separate text-sm">
                <thead>
                    <tr className="bg-[#f8f9fd] dark:bg-gray-800 text-left rounded-t-lg">
                        {tableHeaders.map(header => (
                            <th
                                key={header.key}
                                className="p-3 border-b cursor-pointer"
                                onClick={() => handleSort(header.key)}
                            >
                                {header.label}
                                {header.sortable && (
                                    <>
                                        {' '}
                                        {sortKey === header.key
                                            ? sortDirection === 'asc' ? '↑' : '↓'
                                            : '↑'}
                                    </>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={item.id || index} className="border-b">
                            {tableHeaders.map(header => (
                                <td key={header.key} className="p-3">
                                    {header.key === 'action' ? (
                                        <div className="relative">
                                            <button
                                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 dropdown-ignore"
                                                onClick={() => toggleDropdown(`action-${index}`)}
                                            >
                                                <Menu size={18} />
                                            </button>
                                            {activeDropdown === `action-${index}` && (
                                                <div className="absolute left-4 top-10 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 animate-fade-in">
                                                    {actions.map((action, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => action.onClick(item)}
                                                            className="block w-full px-4 py-2 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        >
                                                            <action.icon size={16} className="mr-2" />
                                                            {action.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        header.key.includes('date') || header.key === 'created_at'
                                            ? new Date(item[header.key]).toLocaleDateString()
                                            : item[header.key] || '-'
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={headers.length} className="text-center py-4 text-gray-500 dark:text-gray-400">
                                No entries found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm">
                <span>
                    Showing {data.length > 0 ? (page - 1) * perPage + 1 : 0} to {Math.min(page * perPage, total)} of {total} entries
                </span>
                <div className="flex gap-2">
                    <button
                        className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                        disabled={page === 1}
                        onClick={() => handlePageChange(Math.max(page - 1, 1))}
                    >
                        Previous
                    </button>
                    {(() => {
                        const maxButtons = 4;
                        const half = Math.floor(maxButtons / 2);
                        let start = Math.max(1, page - half);
                        let end = start + maxButtons - 1;

                        if (end > totalPages) {
                            end = totalPages;
                            start = Math.max(1, end - maxButtons + 1);
                        }

                        return (
                            <>
                                {start > 1 && <span className="px-2">...</span>}
                                {Array.from({ length: end - start + 1 }, (_, i) => i + start).map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => handlePageChange(num)}
                                        className={`px-4 py-2 rounded-xl ${page === num ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                    >
                                        {num}
                                    </button>
                                ))}
                                {end < totalPages && <span className="px-2">...</span>}
                            </>
                        );
                    })()}
                    <button
                        className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                        disabled={page >= totalPages}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;