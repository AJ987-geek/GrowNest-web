import { useState, useEffect } from 'react';
import { Shield, CheckCircle, Clock, AlertCircle, Download, Calendar, X } from 'lucide-react';
import VaccineCard from '../components/VaccineCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Vaccination() {
  const { child, showToast } = useApp();
  const [vaccineData, setVaccineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Modal State
  const [logModal, setLogModal] = useState({ isOpen: false, vaccine: null });
  const [logForm, setLogForm] = useState({ actual_date: new Date().toISOString().split('T')[0], batch_number: '', clinic: '', notes: '' });

  const fetchVaccines = async () => {
    try {
      const response = await fetch(`https://grownest-backend-5xa2.onrender.com/api/children/${child.id}/vaccinations`);
      if (response.ok) {
        const data = await response.json();
        const mappedData = data.map(v => ({ ...v, dueAge: v.due_age }));
        setVaccineData(mappedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (child) fetchVaccines();
  }, [child]);

  const handleLogDoseSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://grownest-backend-5xa2.onrender.com/api/vaccinations/${logModal.vaccine.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'completed',
          actual_date: logForm.actual_date,
          batch_number: logForm.batch_number,
          clinic: logForm.clinic,
          notes: logForm.notes
        })
      });
      if (response.ok) {
        showToast('Vaccine dose logged!', 'success');
        setLogModal({ isOpen: false, vaccine: null });
        fetchVaccines(); // Refresh to get recalculated downstream dates
      }
    } catch (err) {
      console.error(err);
      showToast('Error logging dose', 'error');
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Vaccination Summary', 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Patient: ${child.name}`, 14, 32);
    doc.text(`DOB: ${new Date(child.dob).toLocaleDateString()}`, 14, 38);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 44);

    const tableData = vaccineData
      .filter(v => v.status === 'completed')
      .map(v => [
        v.name,
        v.actual_date ? new Date(v.actual_date).toLocaleDateString() : (v.date ? new Date(v.date).toLocaleDateString() : 'N/A'),
        v.batch_number || '-',
        v.clinic || '-',
        v.notes || '-'
      ]);

    autoTable(doc, {
      startY: 50,
      head: [['Vaccine', 'Date Given', 'Batch No.', 'Clinic', 'Notes']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [13, 148, 136] }
    });

    const upcomingData = vaccineData
      .filter(v => v.status !== 'completed')
      .map(v => [
        v.name,
        v.dueAge,
        new Date(v.date).toLocaleDateString(),
      ]);
      
    if (upcomingData.length > 0) {
      doc.text('Upcoming / Overdue Schedule', 14, doc.lastAutoTable.finalY + 15);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Vaccine', 'Scheduled Age', 'Target Date']],
        body: upcomingData,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [71, 85, 105] }
      });
    }

    doc.setFontSize(9);
    doc.text('Generated via growNest Clinical Systems', 14, doc.internal.pageSize.height - 10);
    
    doc.save(`${child.name.replace(/\s+/g, '_')}_Vaccination_Summary.pdf`);
  };

  const completed = vaccineData.filter(v => v.status === 'completed');
  const upcoming = vaccineData.filter(v => v.status === 'upcoming');
  const missed = vaccineData.filter(v => v.status === 'missed');

  const filtered = filter === 'all' ? vaccineData : vaccineData.filter(v => v.status === filter);

  const groupedVaccines = filtered.reduce((groups, vaccine) => {
    const ageGroup = vaccine.dueAge || 'Other';
    if (!groups[ageGroup]) groups[ageGroup] = [];
    groups[ageGroup].push(vaccine);
    return groups;
  }, {});

  const tabs = [
    { key: 'all', label: 'All', count: vaccineData.length, icon: Shield },
    { key: 'completed', label: 'Completed', count: completed.length, icon: CheckCircle },
    { key: 'upcoming', label: 'Upcoming', count: upcoming.length, icon: Clock },
    { key: 'missed', label: 'Missed', count: missed.length, icon: AlertCircle },
  ];

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading clinical schedule...</div>;

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Vaccination Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">National Immunization Schedule (NIS)</p>
        </div>
        <button onClick={exportPDF} className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Summary
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Completed', value: completed.length, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800', icon: CheckCircle },
          { label: 'Upcoming', value: upcoming.length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800', icon: Clock },
          { label: 'Missed', value: missed.length, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800', icon: AlertCircle },
          { label: 'Completion', value: `${vaccineData.length ? Math.round((completed.length / vaccineData.length) * 100) : 0}%`, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800', icon: Shield },
        ].map(s => (
          <div key={s.label} className={`card border ${s.bg} p-4`}>
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === tab.key
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
              }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {Object.entries(groupedVaccines).map(([ageGroup, vaccinesInGroup]) => (
          <div key={ageGroup} className="card p-6 border-t-4 border-primary-500">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              Schedule: {ageGroup}
            </h3>
            <div className="space-y-0">
              {vaccinesInGroup.map((vaccine, i) => (
                <VaccineCard
                  key={vaccine.id}
                  vaccine={vaccine}
                  isLast={i === vaccinesInGroup.length - 1}
                  onLogDose={(v) => {
                    setLogForm({ actual_date: new Date().toISOString().split('T')[0], batch_number: '', clinic: '', notes: '' });
                    setLogModal({ isOpen: true, vaccine: v });
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* LOG DOSE MODAL */}
      {logModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-500" />
                Log Dose: {logModal.vaccine?.name}
              </h2>
              <button onClick={() => setLogModal({ isOpen: false, vaccine: null })} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleLogDoseSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Date Given</label>
                <input 
                  type="date" 
                  className="input w-full" 
                  value={logForm.actual_date} 
                  onChange={(e) => setLogForm({...logForm, actual_date: e.target.value})} 
                  required 
                />
                {new Date(logForm.actual_date) < new Date(logModal.vaccine?.date) && (
                  <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded border border-amber-200 flex items-start gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    This is earlier than the recommended minimum gap since the last dose. Please confirm with your doctor.
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Batch / Lot Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                <input 
                  type="text" 
                  className="input w-full" 
                  placeholder="e.g. BATCH-8472" 
                  value={logForm.batch_number} 
                  onChange={(e) => setLogForm({...logForm, batch_number: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Administered By / Clinic <span className="text-gray-400 font-normal">(Optional)</span></label>
                <input 
                  type="text" 
                  className="input w-full" 
                  placeholder="e.g. Dr. Smith, City Hospital" 
                  value={logForm.clinic} 
                  onChange={(e) => setLogForm({...logForm, clinic: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Reaction Notes <span className="text-gray-400 font-normal">(Optional)</span></label>
                <textarea 
                  className="input w-full min-h-[80px]" 
                  placeholder="e.g. Mild fever for 24 hours" 
                  value={logForm.notes} 
                  onChange={(e) => setLogForm({...logForm, notes: e.target.value})} 
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setLogModal({ isOpen: false, vaccine: null })} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}