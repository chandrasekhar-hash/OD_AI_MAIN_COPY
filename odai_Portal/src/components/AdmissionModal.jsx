import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, Send, GraduationCap, Phone, Mail, User, AlertCircle } from 'lucide-react';
import { submitAdmissionEnquiry } from '../api/admissionsApi';

export default function AdmissionModal({ isOpen, onClose, initialProgram = '', initialMode = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    program: initialProgram || 'B.Tech in Artificial Intelligence & Computer Science (4-Year)',
    examMode: initialMode || 'Online Proctored (ODAT)',
    qualification: 'Class 12 (Science / PCM)',
    intake: 'January 2027 Intake',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [refId, setRefId] = useState(null);

  // Sync if initial props change
  React.useEffect(() => {
    if (initialProgram) {
      setFormData(prev => ({ ...prev, program: initialProgram }));
    }
    if (initialMode) {
      setFormData(prev => ({ ...prev, examMode: initialMode }));
    }
  }, [initialProgram, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await submitAdmissionEnquiry(formData);
      setSubmitted(true);
      if (res?.data?.id) {
        setRefId(res.data.id);
      }
    } catch (err) {
      console.error('Admission submit error:', err);
      setError(err.message || 'Failed to submit application. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setError(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      program: 'B.Tech in Artificial Intelligence & Computer Science (4-Year)',
      examMode: 'Online Proctored (ODAT)',
      qualification: 'Class 12 (Science / PCM)',
      intake: 'January 2027 Intake',
      notes: '',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#03081D] via-[#0B1842] to-[#1949D8] p-5 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30 mb-2">
            <Sparkles className="w-3 h-3 text-blue-300" />
            Admissions 2026-2027
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Apply to OD AI HUB
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/80 mt-1">
            Submit your application to secure early scholarship eligibility & ODAT test access.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#0B1842]">
                  Application Submitted Successfully!
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Thank you, <strong className="text-slate-900">{formData.name}</strong>. Your enquiry has been received and saved into our management portal.
                </p>
                {refId && (
                  <p className="text-xs text-blue-600 font-mono mt-1 font-semibold">
                    Reference ID: #{refId}
                  </p>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-1.5 text-slate-700">
                <p><strong className="text-slate-900">Program:</strong> {formData.program}</p>
                <p><strong className="text-slate-900">Exam Mode:</strong> {formData.examMode}</p>
                <p><strong className="text-slate-900">Phone:</strong> {formData.phone}</p>
                <p><strong className="text-slate-900">Email:</strong> {formData.email}</p>
              </div>

              <p className="text-xs text-slate-500">
                Our admissions and counselling team will contact you via WhatsApp / Call within 24 hours with your test slot details.
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-[#1949D8] text-white hover:bg-[#153ca8] transition-colors"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Program Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Academic Program *
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1949D8] focus:border-transparent outline-none transition-all"
                    required
                  >
                    <option value="B.Tech in Artificial Intelligence & Computer Science (4-Year)">
                      B.Tech in Artificial Intelligence & Computer Science (4-Year)
                    </option>
                    <option value="ODAT (Odisha Domain & Aptitude Test) Track">
                      ODAT (Domain & Aptitude Test Track)
                    </option>
                    <option value="Coding ODAT (Advanced Competitive Track)">
                      Coding ODAT (Advanced Competitive Track)
                    </option>
                    <option value="Executive AI & ML Certification">
                      Executive AI & ML Certification
                    </option>
                    <option value="Junior AI & Robotics Foundation (School)">
                      Junior AI & Robotics Foundation (School)
                    </option>
                  </select>
                </div>
              </div>

              {/* Row: Mode & Intake */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Examination Mode
                  </label>
                  <select
                    value={formData.examMode}
                    onChange={(e) => setFormData({ ...formData, examMode: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1949D8] outline-none transition-all"
                  >
                    <option value="Online Proctored (ODAT)">Online Proctored (From Home)</option>
                    <option value="Offline Campus Test (Center)">Offline Campus Test (Center)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Intake
                  </label>
                  <select
                    value={formData.intake}
                    onChange={(e) => setFormData({ ...formData, intake: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1949D8] outline-none transition-all"
                  >
                    <option value="January 2027 Intake">January 2027 Intake</option>
                    <option value="Immediate Fast-Track Batch">Immediate Fast-Track Batch</option>
                  </select>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Subham Kumar Patnaik"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1949D8] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row: Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1949D8] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. subham@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1949D8] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Current Qualification */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Qualification / Background
                </label>
                <select
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1949D8] outline-none transition-all"
                >
                  <option value="Class 12 (Science / PCM)">Class 12 (Science / PCM)</option>
                  <option value="Class 12 (Appearing)">Class 12 (Appearing 2026-2027)</option>
                  <option value="Diploma in Engineering">Diploma in Engineering / Poly</option>
                  <option value="Undergraduate (B.Tech / B.Sc / BCA)">Undergraduate (B.Tech / B.Sc / BCA)</option>
                  <option value="Working Professional / Other">Working Professional / Other</option>
                </select>
              </div>

              {/* Questions / Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Questions / Message (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Ask about scholarships, syllabus, hostel facilities..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1949D8] outline-none transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-5 rounded-xl text-sm font-bold bg-[#1949D8] hover:bg-[#153ca8] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? (
                  <span>Submitting Application...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Application & Access ODAT</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                🔒 Your information is secure. No spam, guaranteed.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

