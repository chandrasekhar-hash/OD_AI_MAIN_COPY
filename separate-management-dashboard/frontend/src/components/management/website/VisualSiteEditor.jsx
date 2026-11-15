import React, { useState, useEffect, useRef } from 'react';
import { websiteAdminApi } from '../../../api/websiteAdminApi';
import {
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Upload,
  RefreshCw,
  Palette,
  Type,
  Image as ImageIcon,
  ZoomIn,
  Sliders,
  Sparkles,
  ExternalLink,
  Layers,
  ChevronRight
} from 'lucide-react';

const SECTIONS = [
  { key: 'home_hero', label: 'Home Page Hero' },
  { key: 'academy', label: 'Academy Section' },
  { key: 'technologies', label: 'Technologies Section' },
  { key: 'innovation_lab', label: 'Innovation Lab Section' },
  { key: 'startups', label: 'Startups Section' },
  { key: 'for_business', label: 'For Business Section' },
  { key: 'for_institutions', label: 'For Institutions Section' },
  { key: 'events', label: 'Events Section' },
  { key: 'success_stories', label: 'Success Stories Section' },
  { key: 'about', label: 'About Section' },
  { key: 'blog', label: 'Blog Section' }
];

const COMBO_PRESETS = [
  { label: 'Royal Blue & Sapphire', c1: '#0F2D55', c2: '#2563EB', angle: '135deg' },
  { label: 'Emerald & Mint', c1: '#064E3B', c2: '#10B981', angle: '135deg' },
  { label: 'Deep Amethyst & Pink', c1: '#581C87', c2: '#EC4899', angle: '135deg' },
  { label: 'Warm Amber & Gold', c1: '#78350F', c2: '#F59E0B', angle: '135deg' },
  { label: 'Crimson Ember & Rose', c1: '#881337', c2: '#E11D48', angle: '135deg' },
  { label: 'Midnight AI Cyber', c1: '#0B132B', c2: '#1C2541', angle: '180deg' }
];

const FONTS = [
  { label: 'Cormorant Garamond (Editorial)', value: "'Cormorant Garamond', Georgia, serif" },
  { label: 'Inter (Modern Tech)', value: "'Inter', sans-serif" },
  { label: 'Outfit (Clean Geometric)', value: "'Outfit', sans-serif" },
  { label: 'Cinzel (Royal & Classic)', value: "'Cinzel', serif" },
  { label: 'Space Grotesk (AI Futuristic)', value: "'Space Grotesk', sans-serif" },
  { label: 'Montserrat (Bold Corporate)', value: "'Montserrat', sans-serif" }
];

const VisualSiteEditor = ({ isEditor, isAdmin, setToast }) => {
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeInspectorTab, setActiveInspectorTab] = useState('logo'); // 'logo' | 'section' | 'colors' | 'typography'
  const [selectedSection, setSelectedSection] = useState('home_hero');

  const iframeRef = useRef(null);

  const [customization, setCustomization] = useState({
    theme_mode: 'light',
    logo_url: '/website/images/od_ai_hub_logo_circle.png',
    logo_size: 42,
    font_display: "'Cormorant Garamond', Georgia, serif",
    font_body: "'Inter', sans-serif",
    backgrounds: {
      home_hero: '',
      academy: '/website/images/Academy.png',
      technologies: '/website/images/Techno.png',
      innovation_lab: '/website/images/Innovation.png',
      startups: '/website/images/Strtups.png',
      for_business: '/website/images/Business.png',
      for_institutions: '/website/images/Institutions.png',
      events: '/website/images/Events.png',
      success_stories: '/website/images/Sucess Stories.png',
      about: '/website/images/About.png',
      blog: '/website/images/River City at Blue Hour.png'
    },
    combos: {
      home_hero: { color1: '#0F2D55', color2: '#2563EB', angle: '135deg' },
      academy: { color1: '#0A192F', color2: '#1D4ED8', angle: '135deg' },
      technologies: { color1: '#022C22', color2: '#059669', angle: '135deg' },
      innovation_lab: { color1: '#1E1035', color2: '#7C3AED', angle: '135deg' },
      startups: { color1: '#2D0F07', color2: '#EA580C', angle: '135deg' },
      for_business: { color1: '#0F1D4A', color2: '#2563EB', angle: '135deg' },
      for_institutions: { color1: '#064E3B', color2: '#0D9488', angle: '135deg' },
      events: { color1: '#312E81', color2: '#6366F1', angle: '135deg' },
      success_stories: { color1: '#581C87', color2: '#BE185D', angle: '135deg' },
      about: { color1: '#0A192F', color2: '#1D4ED8', angle: '135deg' },
      blog: { color1: '#1E293B', color2: '#0F172A', angle: '135deg' }
    },
    text_colors: {
      heading: '#FFFFFF',
      subheading: '#F8CB58',
      body: '#FAF7F2'
    },
    text_content: {
      hero_title: 'A stronger Odisha<br><em>through AI.</em>',
      hero_tagline: 'OD AI HUB • EMPOWERING TALENT & INNOVATION'
    }
  });

  // Load current settings from backend
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await websiteAdminApi.getCustomization();
      if (data && typeof data === 'object') {
        setCustomization(prev => ({
          ...prev,
          ...data,
          logo_size: data.logo_size || 42,
          backgrounds: { ...prev.backgrounds, ...(data.backgrounds || {}) },
          combos: { ...prev.combos, ...(data.combos || {}) },
          text_colors: { ...prev.text_colors, ...(data.text_colors || {}) },
          text_content: { ...prev.text_content, ...(data.text_content || {}) }
        }));
      }
    } catch (e) {
      console.warn('Customization API fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  // Sync state to iframe live
  const broadcastToIframe = (newCustomization) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'ODAI_CUSTOMIZATION_UPDATE',
          payload: newCustomization
        },
        '*'
      );
    }
  };

  const updateState = (updater) => {
    setCustomization(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      broadcastToIframe(next);
      return next;
    });
  };

  // Listen for click-to-inspect events from public website iframe
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'ODAI_ELEMENT_SELECTED') {
        const { element, section } = e.data.payload || {};
        if (element === 'logo') {
          setActiveInspectorTab('logo');
        } else if (element === 'hero') {
          setActiveInspectorTab('section');
          if (section && SECTIONS.some(s => s.key === section)) {
            setSelectedSection(section);
          }
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    try {
      await websiteAdminApi.saveCustomization(customization);
      broadcastToIframe(customization);
      if (setToast) {
        setToast({ message: '✨ Customization saved and live on public site!', type: 'success' });
      }
    } catch (err) {
      console.error(err);
      if (setToast) setToast({ message: 'Failed to save customization', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Handle Image Upload
  const handleFileUpload = async (e, targetKey) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await websiteAdminApi.uploadCustomizationAsset(formData);
      if (res && res.url) {
        if (targetKey === 'logo') {
          updateState(prev => ({ ...prev, logo_url: res.url }));
        } else {
          updateState(prev => ({
            ...prev,
            backgrounds: {
              ...prev.backgrounds,
              [targetKey]: res.url
            }
          }));
        }
        if (setToast) setToast({ message: `Image uploaded successfully for ${targetKey}!`, type: 'success' });
      }
    } catch (err) {
      console.error(err);
      if (setToast) setToast({ message: 'Upload failed', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  // Viewport sizes
  const viewportStyles = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '900px', margin: '0 auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' },
    mobile: { width: '390px', height: '844px', margin: '0 auto', boxShadow: '0 25px 60px rgba(0,0,0,0.35)', borderRadius: '40px', border: '10px solid #1E293B' }
  };

  const currentCombo = customization.combos?.[selectedSection] || { color1: '#0F2D55', color2: '#2563EB', angle: '135deg' };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white gap-4 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Sliders className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              2D Visual Site Customizer
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Live 2-Way Sync
              </span>
            </h2>
            <p className="text-xs text-slate-400">Click preview elements to inspect &amp; edit instantly</p>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewport === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewport === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet (768px)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewport === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile (390px)</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="http://localhost:5050"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Tab</span>
          </a>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save &amp; Publish</span>
          </button>
        </div>
      </div>

      {/* Main Workspace (Left Inspector + Right 2D Live Preview) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Inspector Sidebar */}
        <div className="w-96 flex-shrink-0 bg-slate-950/95 border-r border-slate-800 flex flex-col text-slate-200 z-10 overflow-y-auto">
          {/* Sub-Tabs */}
          <div className="flex border-b border-slate-800 p-2 gap-1 bg-slate-900/60 sticky top-0 z-10">
            <button
              type="button"
              onClick={() => setActiveInspectorTab('logo')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeInspectorTab === 'logo' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Logo</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveInspectorTab('section')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeInspectorTab === 'section' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sections</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveInspectorTab('colors')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeInspectorTab === 'colors' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Combos</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveInspectorTab('typography')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeInspectorTab === 'typography' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Fonts</span>
            </button>
          </div>

          <div className="p-5 space-y-6">
            {/* ─── TAB 1: LOGO ZOOM & IMAGE ─── */}
            {activeInspectorTab === 'logo' && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-blue-400 font-semibold text-xs tracking-wider uppercase">
                  <ZoomIn className="w-4 h-4" />
                  <span>Logo Zoom &amp; Branding</span>
                </div>

                {/* Live Logo Preview Box */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3">
                  <div
                    className="flex items-center justify-center bg-white/10 rounded-2xl p-2 border border-white/20 transition-all"
                    style={{ width: `${customization.logo_size}px`, height: `${customization.logo_size}px` }}
                  >
                    <img
                      src={customization.logo_url}
                      alt="Logo Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Current Size: {customization.logo_size}px
                  </span>
                </div>

                {/* Zoom Slider */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                    <span>Click &amp; Drag Logo Zoom</span>
                    <span className="text-blue-400 font-bold">{customization.logo_size}px</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="140"
                    step="2"
                    value={customization.logo_size}
                    onChange={(e) => updateState({ logo_size: parseInt(e.target.value, 10) })}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Compact (30px)</span>
                    <span>Default (42px)</span>
                    <span>Jumbo (140px)</span>
                  </div>
                </div>

                {/* Upload Logo Replacement */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Replace Logo Image (PNG / SVG)
                  </label>
                  <label className="flex items-center justify-center gap-2 p-3 bg-slate-900 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-blue-500 rounded-xl cursor-pointer text-xs font-medium text-slate-300 transition">
                    <Upload className="w-4 h-4 text-blue-400" />
                    <span>{uploading ? 'Uploading...' : 'Choose new logo PNG'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logo')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* ─── TAB 2: SECTIONS & ARTWORK ─── */}
            {activeInspectorTab === 'section' && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-blue-400 font-semibold text-xs tracking-wider uppercase">
                  <ImageIcon className="w-4 h-4" />
                  <span>Section Artwork &amp; Theme</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Select Section to Customize
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {SECTIONS.map(s => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* Current Image preview */}
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-2">Active Artwork</span>
                  <div className="h-28 rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden border border-slate-800 relative">
                    {customization.backgrounds?.[selectedSection] ? (
                      <img
                        src={customization.backgrounds[selectedSection]}
                        alt={selectedSection}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-slate-500">Theme gradient active (No custom PNG)</span>
                    )}
                  </div>
                </div>

                {/* Upload Image for this section */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Upload Section PNG / JPG
                  </label>
                  <label className="flex items-center justify-center gap-2 p-3 bg-slate-900 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-blue-500 rounded-xl cursor-pointer text-xs font-medium text-slate-300 transition">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Upload &amp; Sync with Section</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, selectedSection)}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Automatically syncs with {SECTIONS.find(s => s.key === selectedSection)?.label} on the public site.
                  </p>
                </div>
              </div>
            )}

            {/* ─── TAB 3: 2-COLOR COMBOS & PALETTES ─── */}
            {activeInspectorTab === 'colors' && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-blue-400 font-semibold text-xs tracking-wider uppercase">
                  <Palette className="w-4 h-4" />
                  <span>2-Color Combo Gradients</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Target Section
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    {SECTIONS.map(s => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* Combo Color Inputs */}
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">Color 1 (Primary)</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentCombo.color1}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateState(prev => ({
                            ...prev,
                            combos: {
                              ...prev.combos,
                              [selectedSection]: { ...currentCombo, color1: val }
                            }
                          }));
                        }}
                        className="w-7 h-7 rounded-lg border-0 bg-transparent cursor-pointer"
                      />
                      <span className="text-xs font-mono text-slate-400">{currentCombo.color1}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">Color 2 (Secondary)</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentCombo.color2}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateState(prev => ({
                            ...prev,
                            combos: {
                              ...prev.combos,
                              [selectedSection]: { ...currentCombo, color2: val }
                            }
                          }));
                        }}
                        className="w-7 h-7 rounded-lg border-0 bg-transparent cursor-pointer"
                      />
                      <span className="text-xs font-mono text-slate-400">{currentCombo.color2}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Gradient Direction</label>
                    <select
                      value={currentCombo.angle || '135deg'}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateState(prev => ({
                          ...prev,
                          combos: {
                            ...prev.combos,
                            [selectedSection]: { ...currentCombo, angle: val }
                          }
                        }));
                      }}
                      className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                    >
                      <option value="90deg">Left to Right (90°)</option>
                      <option value="135deg">Diagonal (135°)</option>
                      <option value="180deg">Top to Bottom (180°)</option>
                      <option value="45deg">Up-Right (45°)</option>
                    </select>
                  </div>

                  {/* Gradient Preview Pill */}
                  <div
                    className="h-9 rounded-xl border border-white/20 shadow-inner mt-2 flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      background: `linear-gradient(${currentCombo.angle || '135deg'}, ${currentCombo.color1} 0%, ${currentCombo.color2} 100%)`
                    }}
                  >
                    Active Live Gradient
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-2">
                    Quick Preset Color Combos:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {COMBO_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          updateState(prev => ({
                            ...prev,
                            combos: {
                              ...prev.combos,
                              [selectedSection]: { color1: p.c1, color2: p.c2, angle: p.angle }
                            }
                          }));
                        }}
                        className="p-2 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 flex items-center gap-2 text-left transition"
                      >
                        <div
                          className="w-5 h-5 rounded-md flex-shrink-0 border border-white/20"
                          style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}
                        />
                        <span className="text-[11px] font-medium text-slate-300 truncate">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 4: TYPOGRAPHY & TEXT ─── */}
            {activeInspectorTab === 'typography' && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-blue-400 font-semibold text-xs tracking-wider uppercase">
                  <Type className="w-4 h-4" />
                  <span>Typography &amp; Text Content</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Headline Font Family
                  </label>
                  <select
                    value={customization.font_display}
                    onChange={(e) => updateState({ font_display: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    {FONTS.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Body Font Family
                  </label>
                  <select
                    value={customization.font_body}
                    onChange={(e) => updateState({ font_body: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    {FONTS.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>

                {/* Editable Text Content */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Hero Headline Text (HTML allowed)
                    </label>
                    <input
                      type="text"
                      value={customization.text_content?.hero_title || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateState(prev => ({
                          ...prev,
                          text_content: { ...prev.text_content, hero_title: val }
                        }));
                      }}
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Hero Tagline Text
                    </label>
                    <input
                      type="text"
                      value={customization.text_content?.hero_tagline || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateState(prev => ({
                          ...prev,
                          text_content: { ...prev.text_content, hero_tagline: val }
                        }));
                      }}
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 2D Interactive Preview Pane */}
        <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden relative">
          <div
            className="transition-all duration-300 bg-white rounded-2xl overflow-hidden shadow-2xl relative"
            style={viewportStyles[viewport]}
          >
            <iframe
              ref={iframeRef}
              src="http://localhost:5050"
              title="2D Interactive Website Preview"
              className="w-full h-full border-0"
              onLoad={() => {
                // Once loaded, broadcast current customization
                broadcastToIframe(customization);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualSiteEditor;
