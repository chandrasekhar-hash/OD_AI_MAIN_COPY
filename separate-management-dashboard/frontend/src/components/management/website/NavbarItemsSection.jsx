import React, { useState, useEffect } from 'react';
import { websiteAdminApi } from '../../../api/websiteAdminApi';

const NavbarItemsSection = ({ isEditor, isAdmin, setToast }) => {
  const [items, setItems] = useState([]);
  const [pillars, setPillars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const [filterVisible, setFilterVisible] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await websiteAdminApi.getNavbarItems();
      setItems(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch navbar items', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchPillars = async () => {
    try {
      const data = await websiteAdminApi.getPillars({ status: 'published' });
      setPillars(data);
    } catch (err) {
      console.warn('Could not load pillars for linking:', err);
      setPillars([]);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchPillars();
  }, []);

  const handleCreate = () => {
    setEditingItem({
      label: '',
      url: '#',
      display_order: items.length + 1,
      is_visible: true,
      pillar_id: null,
    });
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
  };

  const handleDelete = async (id, label) => {
    if (!window.confirm(`Are you sure you want to delete "${label}"? This cannot be undone.`)) return;
    try {
      await websiteAdminApi.deleteNavbarItem(id);
      setToast({ message: 'Navbar item deleted', type: 'success' });
      fetchItems();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to delete navbar item', type: 'error' });
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        label: editingItem.label,
        url: editingItem.url,
        display_order: Number(editingItem.display_order),
        is_visible: editingItem.is_visible,
        pillar_id: editingItem.pillar_id ? Number(editingItem.pillar_id) : null,
      };
      if (editingItem.id) {
        await websiteAdminApi.updateNavbarItem(editingItem.id, data);
      } else {
        await websiteAdminApi.createNavbarItem(data);
      }
      setToast({ message: editingItem.id ? 'Navbar item updated successfully' : 'Navbar item created successfully', type: 'success' });
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      console.error(err);
      setToast({ message: editingItem.id ? 'Failed to update navbar item' : 'Failed to create navbar item', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = !searchTerm || (item.label || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVisible =
      filterVisible === '' ||
      (filterVisible === 'visible' && item.is_visible) ||
      (filterVisible === 'hidden' && !item.is_visible);
    return matchesSearch && matchesVisible;
  });

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface">Navbar Items</h2>
          <p className="text-xs text-on-surface-variant">
            Manage the main navigation links displayed in the website header.
          </p>
        </div>
        {isEditor && (
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Item
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 text-xs font-medium">
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Visibility</label>
          <select
            value={filterVisible}
            onChange={(e) => setFilterVisible(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          >
            <option value="">All Items</option>
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by label..."
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-on-surface-variant">Loading navbar items...</div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant/60">menu</span>
          <p className="font-semibold">No navbar items found</p>
          <p className="text-xs text-on-surface-variant/80 mt-1">Click "Add Item" to create the first one.</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-on-surface-variant font-label text-xs uppercase tracking-wider">
                  <th className="p-4">Order</th>
                  <th className="p-4">Label</th>
                  <th className="p-4">URL</th>
                  <th className="p-4">Linked Pillar</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body text-sm">
                {filteredItems
                  .slice()
                  .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-md bg-surface-container text-on-surface-variant font-label text-xs">
                          {item.display_order ?? 0}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-on-surface">{item.label}</td>
                      <td className="p-4 text-on-surface-variant break-all">{item.url}</td>
                      <td className="p-4 text-xs text-on-surface-variant">
                        {item.pillar ? (
                          <span className="px-2 py-1 rounded-md bg-primary/15 text-primary font-bold">
                            {item.pillar.name}
                          </span>
                        ) : (
                          <span className="text-on-surface-variant/60">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md font-bold text-xs ${
                          item.is_visible ? 'bg-emerald-500/15 text-emerald-700' : 'bg-gray-500/15 text-gray-700'
                        }`}>
                          {item.is_visible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {isEditor && (
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(item.id, item.label)}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Navbar Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full border border-outline-variant/30 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">menu</span>
              {editingItem.id ? `Edit Item: ${editingItem.label}` : 'Add New Navbar Item'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs font-body">
              <div>
                <label className="block font-semibold mb-1">Label <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingItem.label || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  placeholder="e.g. Academy"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">URL <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingItem.url || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  placeholder="e.g. /academy or https://..."
                  required
                />
                <p className="text-[10px] text-on-surface-variant mt-1">
                  Use a relative path like <code className="font-mono">/academy</code> for internal pages, or a full URL for external links.
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-1">Linked Pillar (optional)</label>
                <select
                  value={editingItem.pillar_id || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, pillar_id: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                >
                  <option value="">No pillar (custom link)</option>
                  {pillars.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingItem.display_order || 0}
                    onChange={(e) => setEditingItem({ ...editingItem, display_order: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={editingItem.is_visible}
                      onChange={(e) => setEditingItem({ ...editingItem, is_visible: e.target.checked })}
                      className="w-4 h-4 rounded text-primary"
                    />
                    Visible in navbar
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingItem.id ? 'Save Changes' : 'Create Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarItemsSection;
