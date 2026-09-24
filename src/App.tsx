import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './components/DataTable';
import { mockEmployees, type Employee } from './utils/mockData';
import { Building2, Briefcase, Calendar, DollarSign, Fingerprint, MapPin, Mail, Phone, Filter } from 'lucide-react';

function App() {
  const [selectedRows, setSelectedRows] = useState<Employee[]>([]);

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Fingerprint size={16} /> ID
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 200,
        cell: (info) => (
          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
            {info.getValue() as string}
          </div>
        ),
      },
      {
        accessorKey: 'department',
        header: () => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={16} /> Department
          </div>
        ),
        size: 150,
      },
      {
        accessorKey: 'role',
        header: () => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Briefcase size={16} /> Role
          </div>
        ),
        size: 180,
      },
      {
        accessorKey: 'joinDate',
        header: () => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} /> Join Date
          </div>
        ),
        size: 150,
        cell: (info) => {
          const date = new Date(info.getValue() as string);
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        },
      },
      {
        accessorKey: 'salary',
        header: () => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <DollarSign size={16} /> Salary
          </div>
        ),
        size: 120,
        cell: (info) => {
          const amount = info.getValue() as number;
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          }).format(amount);
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
        cell: (info) => {
          const status = info.getValue() as string;
          let statusClass = '';
          
          if (status === 'Active') statusClass = 'status-active';
          else if (status === 'On Leave') statusClass = 'status-leave';
          else if (status === 'Terminated') statusClass = 'status-terminated';

          return (
            <span className={`status-badge ${statusClass}`}>
              {status}
            </span>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content-wrapper">
          <div className="brand">
            <div className="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M3 9H21" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 21V9" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h1>Nexus Data</h1>
          </div>
          <p className="subtitle">Advanced Employee Directory & Management</p>
        </div>
      </header>

      <main className="app-main">
        {selectedRows.length > 0 && (
          <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
            <strong style={{ color: 'var(--text-main)' }}>Bulk Actions:</strong> 
            <span style={{ margin: '0 12px', color: 'var(--text-muted)' }}>{selectedRows.length} employee(s) selected.</span>
            <button style={{ padding: '8px 16px', background: 'var(--primary-color)', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
              Process Payroll
            </button>
            <button style={{ marginLeft: '8px', padding: '8px 16px', background: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
              Send Email
            </button>
          </div>
        )}
        
        <div className="table-section">
          {/* AQUI ESTA LA MAGIA DEL COMPOUND COMPONENT */}
          <DataTable 
            columns={columns} 
            data={mockEmployees}
            onRowSelectionChange={setSelectedRows}
            enableRowSelection={true}
            enableColumnFilters={true}
            enableColumnResizing={true}
            enablePinning={true}
            enableRowExpansion={true}
            renderSubComponent={({ row }) => (
              <div style={{ padding: '16px', background: 'var(--bg-main)', borderRadius: '8px', display: 'flex', gap: '48px', border: '1px solid var(--border-color)' }}>
                 <div>
                   <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--text-main)' }}>Contact Details</h3>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: 'var(--text-muted)' }}>
                     <Mail size={16} /> {(row.original as any).name.toLowerCase().replace(' ', '.')}@nexusdata.com
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: 'var(--text-muted)' }}>
                     <Phone size={16} /> +1 (555) 019-{Math.floor(1000 + Math.random() * 9000)}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                     <MapPin size={16} /> {['New York, NY', 'San Francisco, CA', 'London, UK', 'Austin, TX'][Math.floor(Math.random() * 4)]}
                   </div>
                 </div>
                 <div>
                   <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--text-main)' }}>Performance Snapshot</h3>
                   <div style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>
                     <strong style={{ color: 'var(--text-main)' }}>Last Review:</strong> {new Date().toLocaleDateString()}
                   </div>
                   <div style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>
                     <strong style={{ color: 'var(--text-main)' }}>Rating:</strong> ⭐⭐⭐⭐
                   </div>
                   <div style={{ color: 'var(--text-muted)' }}>
                     <strong style={{ color: 'var(--text-main)' }}>Manager:</strong> John Smith
                   </div>
                 </div>
              </div>
            )}
          >
            {/* Header Titles */}
            <div className="data-table-header-titles">
              <h2>Employee Directory</h2>
              <p>Manage all your employees, customize views, and export data.</p>
            </div>

            {/* Construimos nuestro propio Toolbar y decidimos QUÉ botones llevar */}
            <DataTable.Toolbar>
              <div className="toolbar-left">
                <DataTable.Search placeholder="Find by name or role..." />
                
                {/* Custom Button integrated smoothly */}
                <button className="toolbar-btn" style={{ marginLeft: '8px' }}>
                  <Filter size={16} /> Advanced Filters
                </button>
              </div>

              <div className="toolbar-right">
                <DataTable.DensityToggle />
                <DataTable.ColumnVisibility />
                <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 8px' }}></div>
                <DataTable.Export />
              </div>
            </DataTable.Toolbar>

            {/* La tabla per se */}
            <DataTable.Table />

            {/* La Paginación al final */}
            <DataTable.Pagination />
            
          </DataTable>
        </div>
      </main>
    </div>
  );
}

export default App;
