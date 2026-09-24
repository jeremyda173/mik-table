import React, { useState, useEffect, useRef, useMemo, createContext, useContext } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  flexRender,
  type Table as ReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type ColumnFiltersState,
  type ExpandedState,
  type RowSelectionState,
  type ColumnPinningState,
  type FilterFn,
} from '@tanstack/react-table';
import * as XLSX from 'xlsx';
import { 
  ChevronDown, ChevronUp, ChevronsUpDown, Search, Download, 
  FileSpreadsheet, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Settings2, AlignJustify, AlignCenter, Pin, PinOff
} from 'lucide-react';
import './DataTable.css';

// --- Utility Functions ---
const fuzzyFilter: FilterFn<any> = (row, columnId, value) => {
  const itemValue = row.getValue(columnId);
  if (itemValue == null) return false;
  return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
};

// --- Context ---
type DensityState = 'compact' | 'normal' | 'relaxed';

interface TableContextType<TData> {
  table: ReactTable<TData>;
  data: TData[];
  density: DensityState;
  setDensity: React.Dispatch<React.SetStateAction<DensityState>>;
  enableRowSelection: boolean;
  enableColumnFilters: boolean;
  enableColumnResizing: boolean;
  enablePinning: boolean;
  enableRowExpansion: boolean;
  renderSubComponent?: (props: { row: any }) => React.ReactNode;
}

const TableContext = createContext<TableContextType<any> | undefined>(undefined);

export function useTableContext<TData>() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('DataTable sub-components must be used within a <DataTable> wrapper.');
  }
  return context as TableContextType<TData>;
}

// --- Props & Types ---
export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enableRowSelection?: boolean;
  enableColumnFilters?: boolean;
  enableColumnResizing?: boolean;
  enablePinning?: boolean;
  enableRowExpansion?: boolean;
  renderSubComponent?: (props: { row: any }) => React.ReactNode;
  onRowSelectionChange?: (selectedRows: any[]) => void;
  children: React.ReactNode;
  className?: string;
}

// --- 1. Root Component (Provider) ---
function DataTableRoot<TData, TValue>({
  columns: userColumns,
  data,
  enableRowSelection = true,
  enableColumnFilters = true,
  enableColumnResizing = true,
  enablePinning = true,
  enableRowExpansion = true,
  renderSubComponent,
  onRowSelectionChange,
  children,
  className = '',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({ left: [], right: [] });
  const [density, setDensity] = useState<DensityState>('normal');

  const columns = useMemo(() => {
    const cols = [...userColumns];
    if (enableRowSelection) {
      cols.unshift({
        id: 'select',
        header: ({ table }) => (
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={table.getIsAllRowsSelected()}
              ref={(input) => {
                if (input) {
                  input.indeterminate = table.getIsSomeRowsSelected();
                }
              }}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        ),
        enableSorting: false,
        enableResizing: false,
        size: 50,
      } as any);
    }
    if (enableRowExpansion && renderSubComponent) {
      cols.unshift({
        id: 'expander',
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <button
              className="expand-btn"
              onClick={row.getToggleExpandedHandler()}
            >
              {row.getIsExpanded() ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          ) : null;
        },
        enableSorting: false,
        enableResizing: false,
        size: 50,
      } as any);
    }
    return cols;
  }, [userColumns, enableRowSelection, enableRowExpansion, renderSubComponent]);

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
      columnPinning,
    },
    enableColumnResizing,
    columnResizeMode: 'onChange',
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onColumnPinningChange: setColumnPinning,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  });

  useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, table, onRowSelectionChange]);

  const contextValue: TableContextType<TData> = {
    table,
    data,
    density,
    setDensity,
    enableRowSelection,
    enableColumnFilters,
    enableColumnResizing,
    enablePinning,
    enableRowExpansion,
    renderSubComponent,
  };

  return (
    <TableContext.Provider value={contextValue}>
      <div className={`data-table-container density-${density} ${className}`}>
        {children}
      </div>
    </TableContext.Provider>
  );
}

// --- 2. Sub-components ---

function DataTableToolbar({ children, className = '' }: { children?: React.ReactNode, className?: string }) {
  return (
    <div className={`data-table-toolbar ${className}`}>
      {children}
    </div>
  );
}

function DataTableSearch({ placeholder = "Search all columns..." }: { placeholder?: string }) {
  const { table } = useTableContext();
  return (
    <div className="search-container">
      <Search className="search-icon" size={18} />
      <input
        value={(table.getState().globalFilter as string) ?? ''}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        className="search-input"
        placeholder={placeholder}
      />
    </div>
  );
}

function DataTableColumnVisibility() {
  const { table } = useTableContext();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="column-visibility-container" ref={menuRef}>
      <button 
        className="toolbar-btn" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <Settings2 size={16} /> Columns
      </button>
      {isOpen && (
        <div className="column-visibility-menu">
          <div className="menu-header">Toggle Columns</div>
          <div className="menu-items">
            <label className="visibility-item">
              <input
                type="checkbox"
                checked={table.getIsAllColumnsVisible()}
                onChange={table.getToggleAllColumnsVisibilityHandler()}
              />
              <span>Toggle All</span>
            </label>
            <div className="menu-divider"></div>
            {table.getAllLeafColumns().map(column => {
              if (column.id === 'select' || column.id === 'expander') return null;
              return (
                <label key={column.id} className="visibility-item">
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                  />
                  <span>{typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function DataTableDensityToggle() {
  const { density, setDensity } = useTableContext();
  return (
    <div className="density-toggle">
      <button 
        className={`toolbar-btn ${density === 'compact' ? 'active' : ''}`} 
        onClick={() => setDensity('compact')}
        title="Compact"
      >
        <AlignJustify size={16} />
      </button>
      <button 
        className={`toolbar-btn ${density === 'normal' ? 'active' : ''}`} 
        onClick={() => setDensity('normal')}
        title="Normal"
      >
        <AlignCenter size={16} />
      </button>
      <button 
        className={`toolbar-btn ${density === 'relaxed' ? 'active' : ''}`} 
        onClick={() => setDensity('relaxed')}
        title="Relaxed"
      >
        <AlignJustify size={16} style={{ transform: 'scaleY(1.3)' }} />
      </button>
    </div>
  );
}

function DataTableExport() {
  const { data } = useTableContext();

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(data as any[]);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'export.csv';
    link.click();
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data as any[]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, 'export.xlsx');
  };

  return (
    <div className="export-actions">
      <button className="export-btn csv-btn" onClick={exportToCSV}>
        <Download size={16} /> CSV
      </button>
      <button className="export-btn excel-btn" onClick={exportToExcel}>
        <FileSpreadsheet size={16} /> Excel
      </button>
    </div>
  );
}

function DataTableTable({ className = '' }: { className?: string }) {
  const { 
    table, 
    enablePinning, 
    enableColumnFilters, 
    enableColumnResizing, 
    renderSubComponent 
  } = useTableContext();

  return (
    <div className={`table-wrapper ${className}`}>
      <table className="data-table" style={{ width: table.getTotalSize() }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isPinned = header.column.getIsPinned();
                const pinStyles: React.CSSProperties = {
                   left: isPinned === 'left' ? `${header.column.getStart('left')}px` : undefined,
                   right: isPinned === 'right' ? `${header.column.getAfter('right')}px` : undefined,
                   position: isPinned ? 'sticky' : 'relative',
                   width: header.getSize(),
                   zIndex: isPinned ? 2 : 1,
                };

                return (
                  <th 
                    key={header.id} 
                    colSpan={header.colSpan}
                    style={{ ...pinStyles }}
                    className={`${isPinned ? `pinned-${isPinned}` : ''}`}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="th-content-wrapper">
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none sortable-header'
                              : 'header-content',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <ChevronUp size={16} className="sort-icon active" />,
                            desc: <ChevronDown size={16} className="sort-icon active" />,
                          }[header.column.getIsSorted() as string] ?? 
                            (header.column.getCanSort() ? (
                              <ChevronsUpDown size={16} className="sort-icon idle" />
                            ) : null)}
                        </div>

                        <div className="th-actions">
                          {enablePinning && header.column.id !== 'select' && header.column.id !== 'expander' && (
                            <button 
                              className={`pin-btn ${isPinned ? 'active' : ''}`}
                              onClick={() => {
                                if (isPinned) header.column.pin(false);
                                else header.column.pin('left');
                              }}
                              title="Pin Column"
                            >
                              {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                            </button>
                          )}
                        </div>

                        {enableColumnFilters && header.column.getCanFilter() && (
                           <div className="column-filter">
                             <input
                                type="text"
                                value={(header.column.getFilterValue() ?? '') as string}
                                onChange={e => header.column.setFilterValue(e.target.value)}
                                placeholder={`Filter...`}
                                className="filter-input"
                              />
                           </div>
                        )}

                        {enableColumnResizing && header.column.getCanResize() && (
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={`resizer ${
                              header.column.getIsResizing() ? 'isResizing' : ''
                            }`}
                          />
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <tr className={row.getIsSelected() ? 'row-selected' : ''}>
                  {row.getVisibleCells().map((cell) => {
                    const isPinned = cell.column.getIsPinned();
                    const pinStyles: React.CSSProperties = {
                       left: isPinned === 'left' ? `${cell.column.getStart('left')}px` : undefined,
                       right: isPinned === 'right' ? `${cell.column.getAfter('right')}px` : undefined,
                       position: isPinned ? 'sticky' : 'relative',
                       width: cell.column.getSize(),
                       zIndex: isPinned ? 1 : 0,
                    };
                    return (
                      <td 
                        key={cell.id} 
                        style={{ ...pinStyles }}
                        className={`${isPinned ? `pinned-${isPinned}` : ''}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
                {row.getIsExpanded() && renderSubComponent && (
                  <tr className="expanded-row">
                    <td colSpan={row.getVisibleCells().length}>
                      {renderSubComponent({ row })}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={table.getAllLeafColumns().length} className="no-results">
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function DataTablePagination({ className = '' }: { className?: string }) {
  const { table, enableRowSelection } = useTableContext();

  return (
    <div className={`pagination-container ${className}`}>
      <div className="selected-info">
        {enableRowSelection && (
           <span>
             {table.getFilteredSelectedRowModel().rows.length} of{' '}
             {table.getFilteredRowModel().rows.length} row(s) selected.
           </span>
        )}
      </div>
      
      <div className="pagination-right">
        <div className="page-size-selector">
          <span>Rows per page:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="page-info">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft size={18} />
          </button>
          <button
            className="pagination-btn"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="pagination-btn"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={18} />
          </button>
          <button
            className="pagination-btn"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Assemble Export Object ---
export const DataTable = Object.assign(DataTableRoot, {
  Toolbar: DataTableToolbar,
  Search: DataTableSearch,
  ColumnVisibility: DataTableColumnVisibility,
  DensityToggle: DataTableDensityToggle,
  Export: DataTableExport,
  Table: DataTableTable,
  Pagination: DataTablePagination,
});
