import React, { useState, useEffect } from 'react';
import { websiteAdminApi } from '../../../api/websiteAdminApi';

const DEFAULT_SECTIONS = [
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
  { key: 'blog', label: 'Blog Section' },
];

const HOME_PILLARS = [
  { name: 'OD AI Academy', defaultColor: '#A65A3A' },
  { name: 'OD AI Technologies', defaultColor: '#68705A' },
  { name: 'OD AI Innovation Lab', defaultColor: '#8C684B' },
  { name: 'OD AI Startup Ecosystem', defaultColor: '#8F4A2D' },
  { name: 'For Business', defaultColor: '#2563EB' },
];

const ACADEMY_CATEGORIES = [
  { name: 'School Programs', defaultColor: '#A65A3A' },
  { name: 'Diploma Programs', defaultColor: '#0D9488' },
  { name: 'College Programs', defaultColor: '#4F46E5' },
  { name: 'Non-Tech Programs', defaultColor: '#8F4A2D' },
  { name: 'Internship Programs', defaultColor: '#059669' },
  { name: 'Career & Placement', defaultColor: '#D97706' },
];

const SiteCustomizerSection = ({ isEditor, isAdmin, setToast }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingSection, setUploadingSection] = useState(null);

  const [customization, setCustomization] = useState({
    theme_mode: 'light',
    logo_url: '/website/images/od_ai_hub_logo_circle.png',
    backgrounds: {
      home_hero: '/website/images/Home page.png',
      academy: '/website/images/Academy.png',
      technologies: '/website/images/Techno.png',
      innovation_lab: '/website/images/Lab.png',
      startups: '/website/images/Start-up.png',
      for_business: '/website/images/For Business.png',
      for_institutions: '/website/images/For Inistitute.png',
      events: '/website/images/Event.png',
      success_stories: '/website/images/Success.png',
      about: '/website/images/River City at Blue Hour.png',
      blog: '/website/images/River City at Blue Hour.png'
    },
    ring_colors: {
      home: ['#A65A3A', '#68705A', '#8C684B', '#8F4A2D', '#2563EB'],
      academy: ['#A65A3A', '#0D9488', '#4F46E5', '#8F4A2D', '#059669', '#D97706']
    },
    text_colors: {
      heading: '#FFFFFF',
      subheading: '#F8CB58',
      body: '#FAF7F2'
    }
  });

  useEffect(() => {
    fetchCustomization();
  }, []);

  const fetchCustomization = async () => {
    setLoading(true);
    try {
      const data = await websiteAdminApi.getCustomization();
      if (data && typeof data === 'object') {
        setCustomization(prev => ({
          ...prev,
          ...data,
          backgrounds: { ...prev.backgrounds, ...(data.backgrounds || {}) },
          ring_colors: {
            home: data.ring_colors?.home || prev.ring_colors.home,
            academy: data.ring_colors?.academy || prev.ring_colors.academy,
          },
          text_colors: { ...prev.text_colors, ...(data.text_colors || {}) }
        }));
      }
    } catch (err) {
      console.warn("Using default customization:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await websiteAdminApi.saveCustomization(customization);
      setToast({ message: "Site customization updated successfully! Public site will reflect changes.", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to save customization", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e, sectionKey) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingSection(sectionKey);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await websiteAdminApi.uploadCustomizationAsset(formData);
      if (res && res.url) {
        if (sectionKey === 'logo') {
          setCustomization(prev => ({ ...prev, logo_url: res.url }));
        } else {
          setCustomization(prev => ({
            ...prev,
            backgrounds: {
              ...prev.backgrounds,
              [sectionKey]: res.url
            }
          }));
        }
        setToast({ message: `Image uploaded successfully for ${sectionKey}!`, type: 'success' });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Upload failed', type: 'error' });
    } finally {
      setUploadingSection(null);
    }
  };

  const updateHomeColor = (index, color) => {
    const next = [...customization.ring_colors.home];
    next[index] = color;
    setCustomization(prev => ({
      ...prev,
      ring_colors: { ...prev.ring_colors, home: next }
    }));
  };

  const updateAcademyColor = (index, color) => {
    const next = [...customization.ring_colors.academy];
    next[index] = color;
    setCustomization(prev => ({
      ...prev,
      ring_colors: { ...prev.ring_colors, academy: next }
    }));
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-on-surface-variant font-medium">
        Loading Site Customizer settings...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">palette</span>
            Public Site Customizer
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Customize section backgrounds, ring card colors, logo, theme mode, and contrast typography for the public website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCustomization}
            className="px-4 py-2 rounded-xl border border-outline-variant/50 hover:bg-surface-container text-xs font-semibold transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !isEditor}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-semibold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            {saving ? 'Saving Changes...' : 'Save & Publish to Public Site'}
          </button>
        </div>
      </div>

      {/* 1. Theme Mode & Brand Logo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
          <h3 className="font-headline font-bold text-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">contrast</span>
            Default Theme Mode
          </h3>
          <p className="text-xs text-on-surface-variant">
            Choose whether the site opens in Warm Luxury (Light) or Dark Blue (Dark) by default.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => setCustomization(prev => ({ ...prev, theme_mode: 'light' }))}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                customization.theme_mode === 'light'
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-outline-variant/30 hover:border-outline-variant/70'
              }`}
            >
              <span className="text-2xl">☀️</span>
              <span className="text-xs font-bold text-on-surface">Light Luxury Mode</span>
              <span className="text-[10px] text-on-surface-variant">Cream &amp; Gold Editorial</span>
            </button>
            <button
              type="button"
              onClick={() => setCustomization(prev => ({ ...prev, theme_mode: 'dark' }))}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                customization.theme_mode === 'dark'
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-outline-variant/30 hover:border-outline-variant/70'
              }`}
            >
              <span className="text-2xl">🌙</span>
              <span className="text-xs font-bold text-on-surface">Dark Blue Mode</span>
              <span className="text-[10px] text-on-surface-variant">Deep Navy &amp; Cobalt</span>
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
          <h3 className="font-headline font-bold text-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">image</span>
            Website Logo Badge
          </h3>
          <p className="text-xs text-on-surface-variant">
            Upload the primary circular badge displayed in the navigation and 3D rings.
          </p>
          <div className="flex items-center gap-5 pt-2">
            <div className="w-16 h-16 rounded-full border-2 border-primary/40 p-1 flex-shrink-0 bg-white shadow-sm flex items-center justify-center overflow-hidden">
              <img
                src={customization.logo_url}
                alt="Logo Preview"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => { e.target.src = '/website/images/od_ai_hub_logo_circle.png'; }}
              />
            </div>
            <div className="space-y-2 flex-1">
              <input
                type="text"
                value={customization.logo_url || ''}
                onChange={(e) => setCustomization(prev => ({ ...prev, logo_url: e.target.value }))}
                placeholder="/website/images/od_ai_hub_logo_circle.png"
                className="w-full px-3 py-1.5 rounded-lg border border-outline-variant/50 text-xs text-on-surface bg-surface"
              />
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold cursor-pointer border border-outline-variant/40">
                <span className="material-symbols-outlined text-xs">upload</span>
                {uploadingSection === 'logo' ? 'Uploading...' : 'Upload Logo'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'logo')}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Ring Card Unique Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Home Ring 5 Businesses */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
          <div className="border-b border-outline-variant/20 pb-3">
            <h3 className="font-headline font-bold text-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">rotate_right</span>
              Home Ring Unique Card Colors (5 Businesses)
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Each card in the Home 3D ring has a unique accent color.
            </p>
          </div>
          <div className="space-y-3 pt-1">
            {HOME_PILLARS.map((p, idx) => {
              const currentColor = customization.ring_colors.home[idx] || p.defaultColor;
              return (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-surface/50 border border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 rounded-lg border border-black/10 shadow-xs flex-shrink-0"
                      style={{ backgroundColor: currentColor }}
                    />
                    <span className="text-xs font-semibold text-on-surface">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentColor}
                      onChange={(e) => updateHomeColor(idx, e.target.value)}
                      className="w-7 h-7 rounded border-0 p-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentColor}
                      onChange={(e) => updateHomeColor(idx, e.target.value)}
                      className="w-20 px-2 py-1 rounded text-[11px] font-mono border border-outline-variant/40 bg-surface text-on-surface text-center uppercase"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academy Ring 6 Categories */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
          <div className="border-b border-outline-variant/20 pb-3">
            <h3 className="font-headline font-bold text-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">school</span>
              Academy Ring Unique Card Colors (6 Categories)
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              These colors also apply as the full background of cards on the course page.
            </p>
          </div>
          <div className="space-y-3 pt-1">
            {ACADEMY_CATEGORIES.map((c, idx) => {
              const currentColor = customization.ring_colors.academy[idx] || c.defaultColor;
              return (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-surface/50 border border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 rounded-lg border border-black/10 shadow-xs flex-shrink-0"
                      style={{ backgroundColor: currentColor }}
                    />
                    <span className="text-xs font-semibold text-on-surface">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentColor}
                      onChange={(e) => updateAcademyColor(idx, e.target.value)}
                      className="w-7 h-7 rounded border-0 p-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentColor}
                      onChange={(e) => updateAcademyColor(idx, e.target.value)}
                      className="w-20 px-2 py-1 rounded text-[11px] font-mono border border-outline-variant/40 bg-surface text-on-surface text-center uppercase"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Section Background Images */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6">
        <div>
          <h3 className="font-headline font-bold text-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">wallpaper</span>
            Section Background Images (HD Resolution)
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Upload or change high-resolution background images for any section across the public site.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEFAULT_SECTIONS.map((sec) => {
            const currentImg = customization.backgrounds?.[sec.key] || '';
            const isUploading = uploadingSection === sec.key;
            return (
              <div
                key={sec.key}
                className="bg-surface rounded-xl border border-outline-variant/30 overflow-hidden flex flex-col justify-between shadow-2xs"
              >
                <div className="relative aspect-video bg-black/10 overflow-hidden">
                  {currentImg ? (
                    <img
                      src={currentImg}
                      alt={sec.label}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-on-surface-variant">
                      No image
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-semibold text-white backdrop-blur-xs">
                    {sec.label}
                  </span>
                </div>

                <div className="p-3.5 space-y-2.5">
                  <input
                    type="text"
                    value={currentImg}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomization(prev => ({
                        ...prev,
                        backgrounds: { ...prev.backgrounds, [sec.key]: val }
                      }));
                    }}
                    placeholder="/website/images/..."
                    className="w-full px-2.5 py-1 text-[11px] rounded border border-outline-variant/40 bg-surface-container-lowest text-on-surface"
                  />
                  <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold cursor-pointer border border-outline-variant/40 transition-colors">
                      <span className="material-symbols-outlined text-xs">upload</span>
                      {isUploading ? 'Uploading...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, sec.key)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SiteCustomizerSection;
