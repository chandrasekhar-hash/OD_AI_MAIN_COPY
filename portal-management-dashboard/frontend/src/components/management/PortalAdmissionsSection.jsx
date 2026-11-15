import React, { useState, useEffect, useMemo } from 'react';
import { academyAdminApi } from '../../api/academyAdminApi';

const PortalAdmissionsSection = ({ isEditor, setToast }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all'); // 'all', 'portal', 'website'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEnquiry, setActiveEnquiry] = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};
      const data = await academyAdminApi.getEnquiries(params);
      setEnquiries(data || []);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch admissions & enquiries', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [selectedStatus]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await academyAdminApi.updateEnquiryStatus(id, newStatus);
      setToast({ message: `Status updated to ${newStatus}`, type: 'success' });
      fetchEnquiries();
      if (activeEnquiry && activeEnquiry.id === id) {
        setActiveEnquiry(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      await academyAdminApi.downloadEnquiriesCsv(selectedStatus);
      setToast({ message: 'Admissions data exported successfully', type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to export CSV', type: 'error' });
    } finally {
      setExporting(false);
    }
  };

  // Helper to detect if an enquiry is from OD AI Portal
  const isPortalApplication = (enq) => {
    const msg = (enq.message || '').toLowerCase();
    const title = (enq.course_title || '').toLowerCase();
    return msg.includes('od ai portal') || msg.includes('admission') || msg.includes('odat') || title.includes('portal') || title.includes('odat');
  };

  // Filtered enquiries based on source, status, and search query
  const filteredList = useMemo(() => {
    return enquiries.filter(item => {
      // Source filter
      const isPortal = isPortalApplication(item);
      if (filterSource === 'portal' && !isPortal) return false;
      if (filterSource === 'website' && isPortal) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (item.name || '').toLowerCase().includes(q);
        const phoneMatch = (item.phone || '').toLowerCase().includes(q);
        const emailMatch = (item.email || '').toLowerCase().includes(q);
        const msgMatch = (item.message || '').toLowerCase().includes(q);
        const courseMatch = (item.course_title || '').toLowerCase().includes(q);
        if (!nameMatch && !phoneMatch && !emailMatch && !msgMatch && !courseMatch) {
          return false;
        }
      }

      return true;
    });
  }, [enquiries, filterSource, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = enquiries.length;
    const portalCount = enquiries.filter(isPortalApplication).length;
    const newCount = enquiries.filter(e => e.status === 'new').length;
    const contactedCount = enquiries.filter(e => e.status === 'contacted').length;
    const closedCount = enquiries.filter(e => e.status === 'closed').length;
    return { total, portalCount, newCount, contactedCount, closedCount };
  }, [enquiries]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-700 border border-blue-500/30">New</span>;
      case 'contacted':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 border border-amber-500/30">Contacted</span>;
      case 'closed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">Enrolled / Closed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant">{status}</span>;
    }
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return { date: '—', time: '', relative: '' };
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now - d;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      let relative = '';
      if (diffMins < 1) relative = 'Just now';
      else if (diffMins < 60) relative = `${diffMins}m ago`;
      else if (diffHours < 24) relative = `${diffHours}h ago`;
      else if (diffDays === 1) relative = 'Yesterday';
      else relative = `${diffDays}d ago`;

      const date = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      return { date, time, relative };
    } catch {
      return { date: dateStr, time: '', relative: '' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">how_to_reg</span>
            <h2 className="font-headline text-xl font-bold text-on-surface">
              OD AI Portal Admissions & Enquiries
            </h2>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Real-time candidate submissions from the OD AI Portal & Website. See who applied, when they filled the form, and their selected academic track.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchEnquiries}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface"
            title="Refresh submissions"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Refresh
          </button>

          <button
            onClick={handleExportCsv}
            disabled={exporting || enquiries.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-xs disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">download</span>
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Total Submissions</p>
          <p className="text-2xl font-extrabold text-on-surface mt-1">{stats.total}</p>
          <span className="text-[11px] text-primary font-medium">{stats.portalCount} via OD AI Portal</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">New / Pending</p>
          <p className="text-2xl font-extrabold text-blue-700 mt-1">{stats.newCount}</p>
          <span className="text-[11px] text-on-surface-variant font-medium">Requires initial response</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Contacted</p>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">{stats.contactedCount}</p>
          <span className="text-[11px] text-on-surface-variant font-medium">Under discussion / counselling</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Enrolled / Closed</p>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">{stats.closedCount}</p>
          <span className="text-[11px] text-on-surface-variant font-medium">Completed admissions</span>
        </div>
      </div>

      {/* Controls & Filters Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex bg-surface-container rounded-lg p-0.5 text-xs font-semibold">
            {['all', 'new', 'contacted', 'closed'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-md capitalize transition-colors ${
                  selectedStatus === st ? 'bg-surface text-primary shadow-xs font-bold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Source Tabs */}
          <div className="flex bg-surface-container rounded-lg p-0.5 text-xs font-semibold">
            {[
              { id: 'all', label: 'All Sources' },
              { id: 'portal', label: 'OD AI Portal' },
              { id: 'website', label: 'Website' },
            ].map(src => (
              <button
                key={src.id}
                onClick={() => setFilterSource(src.id)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  filterSource === src.id ? 'bg-surface text-primary shadow-xs font-bold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {src.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, course..."
            className="w-full pl-9 pr-3 py-1.5 bg-surface-container rounded-lg text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-on-surface-variant text-xs flex flex-col items-center gap-2">
            <span className="material-symbols-outlined animate-spin text-2xl text-primary">progress_activity</span>
            Loading applicants and admissions...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-20 text-center text-on-surface-variant text-xs flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-4xl text-outline">inbox</span>
            No applicant records match your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-on-surface">
              <thead className="bg-surface-container text-on-surface-variant text-[11px] font-bold uppercase tracking-wider border-b border-outline-variant/30">
                <tr>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Program / Track</th>
                  <th className="py-3 px-4">Qualification / Mode</th>
                  <th className="py-3 px-4">When Filled</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredList.map((item) => {
                  const isPortal = isPortalApplication(item);
                  const ts = formatTimestamp(item.created_at);

                  return (
                    <tr key={item.id} className="hover:bg-surface-container/40 transition-colors">
                      {/* Name & Source */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-on-surface text-sm flex items-center gap-1.5">
                          {item.name}
                          {isPortal && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                              Portal
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-on-surface-variant">ID #{item.id}</span>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <a
                            href={`tel:${item.phone}`}
                            className="font-mono text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[13px]">call</span>
                            {item.phone}
                          </a>
                          {item.email && (
                            <a
                              href={`mailto:${item.email}`}
                              className="text-[11px] text-on-surface-variant hover:text-primary flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[13px]">mail</span>
                              {item.email}
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Course / Program */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 inline-block">
                          {item.course_title || (item.message && item.message.includes('[Program:') ? item.message.split('[Program:')[1]?.split(']')[0] : 'OD AI Admissions')}
                        </span>
                      </td>

                      {/* Academic Qualification */}
                      <td className="py-3 px-4 text-on-surface-variant text-xs">
                        {item.class_or_degree || '—'}
                      </td>

                      {/* When Filled (Date & Time) */}
                      <td className="py-3 px-4">
                        <div className="text-on-surface font-semibold text-xs">{ts.date}</div>
                        <div className="text-[11px] text-on-surface-variant flex items-center gap-1">
                          <span>{ts.time}</span>
                          {ts.relative && <span className="text-primary font-medium">({ts.relative})</span>}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveEnquiry(item)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface flex items-center gap-1"
                            title="View Full Application Details"
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            View
                          </button>

                          {isEditor && (
                            <select
                              value={item.status}
                              onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                              className="text-xs bg-surface-container rounded-lg px-2 py-1 text-on-surface border border-outline-variant/30 focus:outline-none"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="closed">Closed</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {activeEnquiry && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveEnquiry(null)}
        >
          <div
            className="bg-surface-container-lowest max-w-lg w-full rounded-2xl border border-outline-variant/30 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
                  Applicant Detail #{activeEnquiry.id}
                </span>
                <h3 className="font-headline text-lg font-bold text-on-surface mt-1">
                  {activeEnquiry.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveEnquiry(null)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Submission Timing */}
            <div className="bg-surface-container p-3 rounded-xl flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Submitted on:</span>
              <span className="font-semibold text-on-surface">
                {activeEnquiry.created_at ? new Date(activeEnquiry.created_at).toLocaleString('en-IN', {
                  dateStyle: 'full',
                  timeStyle: 'medium'
                }) : '—'}
              </span>
            </div>

            {/* Candidate Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-surface-container/60 p-3 rounded-xl">
                <span className="text-on-surface-variant block text-[11px] uppercase tracking-wider font-bold">Phone Number</span>
                <a href={`tel:${activeEnquiry.phone}`} className="font-mono font-semibold text-primary hover:underline text-sm mt-0.5 block">
                  {activeEnquiry.phone}
                </a>
              </div>

              <div className="bg-surface-container/60 p-3 rounded-xl">
                <span className="text-on-surface-variant block text-[11px] uppercase tracking-wider font-bold">Email Address</span>
                <a href={`mailto:${activeEnquiry.email}`} className="font-semibold text-on-surface hover:text-primary text-sm mt-0.5 block truncate">
                  {activeEnquiry.email || '—'}
                </a>
              </div>

              <div className="bg-surface-container/60 p-3 rounded-xl col-span-2">
                <span className="text-on-surface-variant block text-[11px] uppercase tracking-wider font-bold">Academic Qualification / Mode</span>
                <p className="font-semibold text-on-surface mt-0.5">
                  {activeEnquiry.class_or_degree || '—'}
                </p>
              </div>
            </div>

            {/* Notes / Message */}
            <div className="space-y-1.5 text-xs">
              <span className="text-on-surface-variant font-bold text-[11px] uppercase tracking-wider">
                Application Message / Query Notes
              </span>
              <div className="p-3 bg-surface-container rounded-xl text-on-surface whitespace-pre-wrap font-sans text-xs leading-relaxed max-h-48 overflow-y-auto">
                {activeEnquiry.message || 'No additional note provided.'}
              </div>
            </div>

            {/* Status Change & Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="text-xs text-on-surface-variant">Status:</span>
                {getStatusBadge(activeEnquiry.status)}
              </div>

              <div className="flex items-center gap-2">
                {isEditor && (
                  <>
                    {activeEnquiry.status !== 'contacted' && (
                      <button
                        onClick={() => handleStatusUpdate(activeEnquiry.id, 'contacted')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 transition-colors"
                      >
                        Mark Contacted
                      </button>
                    )}
                    {activeEnquiry.status !== 'closed' && (
                      <button
                        onClick={() => handleStatusUpdate(activeEnquiry.id, 'closed')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 transition-colors"
                      >
                        Mark Enrolled / Closed
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={() => setActiveEnquiry(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container hover:bg-surface-container-high transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalAdmissionsSection;
