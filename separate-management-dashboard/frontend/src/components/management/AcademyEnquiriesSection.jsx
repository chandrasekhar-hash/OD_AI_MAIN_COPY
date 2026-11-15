import React, { useState, useEffect } from 'react';
import { academyAdminApi } from '../../api/academyAdminApi';

const AcademyEnquiriesSection = ({ isEditor, setToast }) => {
  const canEdit = isEditor !== false;
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeEnquiry, setActiveEnquiry] = useState(null);
  const [editingEnquiry, setEditingEnquiry] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};
      const data = await academyAdminApi.getEnquiries(params);
      setEnquiries(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch enquiries', type: 'error' });
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
      setToast({ message: `Status marked as ${newStatus}`, type: 'success' });
      fetchEnquiries();
      if (activeEnquiry && activeEnquiry.id === id) {
        setActiveEnquiry(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  const handleEdit = (enq) => {
    setEditingEnquiry({
      id: enq.id,
      name: enq.name || '',
      phone: enq.phone || '',
      email: enq.email || '',
      class_or_degree: enq.class_or_degree || '',
      course_title: enq.course_title || '',
      message: enq.message || '',
      status: enq.status || 'new'
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingEnquiry) return;
    setSavingEdit(true);
    try {
      await academyAdminApi.updateEnquiry(editingEnquiry.id, {
        name: editingEnquiry.name,
        phone: editingEnquiry.phone,
        email: editingEnquiry.email,
        class_or_degree: editingEnquiry.class_or_degree,
        status: editingEnquiry.status,
        message: editingEnquiry.message
      });
      setToast({ message: `Enquiry #${editingEnquiry.id} updated and saved successfully!`, type: 'success' });
      setEditingEnquiry(null);
      if (activeEnquiry && activeEnquiry.id === editingEnquiry.id) {
        setActiveEnquiry(editingEnquiry);
      }
      fetchEnquiries();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to save enquiry changes', type: 'error' });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently delete enquiry #${id} for "${name}"?`)) return;
    try {
      await academyAdminApi.deleteEnquiry(id);
      setToast({ message: `Enquiry #${id} deleted successfully`, type: 'success' });
      if (activeEnquiry && activeEnquiry.id === id) setActiveEnquiry(null);
      if (editingEnquiry && editingEnquiry.id === id) setEditingEnquiry(null);
      fetchEnquiries();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to delete enquiry', type: 'error' });
    }
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      await academyAdminApi.downloadEnquiriesCsv(selectedStatus);
      setToast({ message: 'Enquiries CSV exported successfully', type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to export CSV', type: 'error' });
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-terracotta/15 text-terracotta border border-terracotta/30">New</span>;
      case 'contacted':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 border border-amber-500/30">Contacted</span>;
      case 'closed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">Closed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters and Export */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">contact_mail</span>
            Learner & Student Enquiries
          </h2>
          <p className="text-xs text-on-surface-variant">
            Track inquiries submitted through the OD AI Academy and website forms.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Filter Tabs */}
          <div className="flex bg-surface-container rounded-xl p-1 text-xs font-semibold">
            {['all', 'new', 'contacted', 'closed'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  selectedStatus === st ? 'bg-surface text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            disabled={exporting}
            className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base">download</span>
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Enquiries Table */}
      {loading ? (
        <div className="py-16 text-center text-on-surface-variant">Loading enquiries...</div>
      ) : enquiries.length === 0 ? (
        <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant/60">inbox</span>
          <p className="font-semibold">No enquiries found</p>
          <p className="text-xs text-on-surface-variant/80 mt-1">There are no inquiries matching "{selectedStatus}".</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-surface-container-high/50 border-b border-outline-variant/20 text-on-surface-variant font-label uppercase">
                <tr>
                  <th className="px-5 py-3.5">Learner Name</th>
                  <th className="px-4 py-3.5">Contact</th>
                  <th className="px-4 py-3.5">Class / Degree</th>
                  <th className="px-4 py-3.5">Program / Course</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-on-surface text-sm">{enq.name}</div>
                      {enq.message && (
                        <div className="text-xs text-on-surface-variant truncate max-w-xs" title={enq.message}>
                          "{enq.message}"
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-on-surface">{enq.phone}</div>
                      {enq.email && <div className="text-xs text-on-surface-variant">{enq.email}</div>}
                    </td>
                    <td className="px-4 py-3.5 text-on-surface-variant font-medium">
                      {enq.class_or_degree || '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 rounded bg-primary/10 text-primary font-semibold text-xs">
                        {enq.course_title || 'General Academy'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-on-surface-variant">
                      {enq.created_at ? new Date(enq.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      {getStatusBadge(enq.status)}
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setActiveEnquiry(enq)}
                        className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-semibold"
                        title="View Details"
                      >
                        Details
                      </button>

                      {canEdit && (
                        <>
                          <button
                            onClick={() => handleEdit(enq)}
                            className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-semibold"
                            title="Edit Record"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(enq.id, enq.name)}
                            className="px-2 py-1 rounded-lg bg-error/10 text-error hover:bg-error/20 font-semibold"
                            title="Delete Record"
                          >
                            <span className="material-symbols-outlined text-sm align-middle">delete</span>
                          </button>

                          {enq.status === 'new' && (
                            <button
                              onClick={() => handleStatusUpdate(enq.id, 'contacted')}
                              className="px-2 py-1 rounded-lg bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 font-semibold"
                            >
                              Contacted
                            </button>
                          )}
                          {enq.status !== 'closed' && (
                            <button
                              onClick={() => handleStatusUpdate(enq.id, 'closed')}
                              className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 font-semibold"
                            >
                              Close
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enquiry Details Modal */}
      {activeEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full border border-outline-variant/30 shadow-2xl p-6 text-sm">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <h3 className="font-headline font-bold text-lg text-on-surface">Enquiry Details #{activeEnquiry.id}</h3>
              <button
                onClick={() => setActiveEnquiry(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container-high"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <span className="text-xs font-semibold text-on-surface-variant block">Learner Name</span>
                <span className="font-bold text-base text-on-surface">{activeEnquiry.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs font-semibold text-on-surface-variant block">Phone</span>
                  <a href={`tel:${activeEnquiry.phone}`} className="font-medium text-primary hover:underline">
                    {activeEnquiry.phone}
                  </a>
                </div>
                <div>
                  <span className="text-xs font-semibold text-on-surface-variant block">Email</span>
                  <a href={`mailto:${activeEnquiry.email}`} className="font-medium text-primary hover:underline">
                    {activeEnquiry.email || 'None provided'}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs font-semibold text-on-surface-variant block">Class / Degree</span>
                  <span className="font-medium text-on-surface">{activeEnquiry.class_or_degree || '—'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-on-surface-variant block">Target Program</span>
                  <span className="font-medium text-primary">{activeEnquiry.course_title || 'General Academy'}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-on-surface-variant block">Message</span>
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface mt-1 whitespace-pre-wrap">
                  {activeEnquiry.message || 'No additional message.'}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-on-surface-variant">
                  Received: {activeEnquiry.created_at ? new Date(activeEnquiry.created_at).toLocaleString() : '—'}
                </span>
                <div>{getStatusBadge(activeEnquiry.status)}</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/20">
              {canEdit && (
                <>
                  <button
                    onClick={() => {
                      const item = activeEnquiry;
                      setActiveEnquiry(null);
                      handleEdit(item);
                    }}
                    className="px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold text-xs hover:bg-primary/90 transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">edit</span>
                    Edit Record
                  </button>
                  <button
                    onClick={() => handleDelete(activeEnquiry.id, activeEnquiry.name)}
                    className="px-4 py-2 rounded-xl bg-error/15 text-error font-semibold text-xs hover:bg-error/25 transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">delete</span>
                    Delete
                  </button>
                  {activeEnquiry.status !== 'closed' && (
                    <button
                      onClick={() => handleStatusUpdate(activeEnquiry.id, 'closed')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                    >
                      Mark as Closed
                    </button>
                  )}
                </>
              )}
              <button
                onClick={() => setActiveEnquiry(null)}
                className="px-4 py-2 rounded-xl border border-outline-variant font-semibold text-xs text-on-surface-variant hover:bg-surface-container-high"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit & Save Enquiry Modal */}
      {editingEnquiry && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditingEnquiry(null)}
        >
          <div
            className="bg-surface-container-lowest max-w-lg w-full rounded-2xl border border-outline-variant/30 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
                  Edit Enquiry #{editingEnquiry.id}
                </span>
                <h3 className="font-headline text-lg font-bold text-on-surface mt-1">
                  Edit Learner Information
                </h3>
              </div>
              <button
                onClick={() => setEditingEnquiry(null)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-on-surface">Learner Name *</label>
                <input
                  type="text"
                  required
                  value={editingEnquiry.name}
                  onChange={(e) => setEditingEnquiry({ ...editingEnquiry, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-on-surface">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={editingEnquiry.phone}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-on-surface">Email Address</label>
                  <input
                    type="email"
                    value={editingEnquiry.email}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-on-surface">Course / Target Program</label>
                  <input
                    type="text"
                    value={editingEnquiry.course_title}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, course_title: e.target.value })}
                    placeholder="e.g. AI & Robotics Masterclass"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-on-surface">Class / Degree</label>
                  <input
                    type="text"
                    value={editingEnquiry.class_or_degree}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, class_or_degree: e.target.value })}
                    placeholder="e.g. Class 11, B.Tech, Working Pro"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-on-surface">Status</label>
                <select
                  value={editingEnquiry.status}
                  onChange={(e) => setEditingEnquiry({ ...editingEnquiry, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-on-surface">Message / Enquiry Notes</label>
                <textarea
                  rows={3}
                  value={editingEnquiry.message}
                  onChange={(e) => setEditingEnquiry({ ...editingEnquiry, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingEnquiry(null)}
                  className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm hover:bg-primary/90 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  {savingEdit ? 'Saving...' : 'Save & Update Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademyEnquiriesSection;
