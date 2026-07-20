import { useState } from 'react';
import { User, Calendar, Weight, Ruler, Droplet, AlertTriangle, ClipboardList, Save, Edit, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { calculateAge, calculateBMI, getBMIStatus } from '../utils/helpers.js';

export default function ChildProfile() {
  const { child, setChild, showToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...child });
  const [allergyInput, setAllergyInput] = useState('');

  const age = calculateAge(child.dob);
  const bmi = calculateBMI(child.weight, child.height);
  const bmiStatus = getBMIStatus(bmi);

  const handleSave = async () => {
    try {
      const response = await fetch(`https://grownest-backend-5xa2.onrender.com/api/children/${child.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (response.ok) {
        setChild(form);
        setEditing(false);
        showToast('Profile updated successfully!', 'success');
      } else {
        showToast('Failed to update profile', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to server', 'error');
    }
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !form.allergies.includes(allergyInput.trim())) {
      setForm(p => ({ ...p, allergies: [...p.allergies, allergyInput.trim()] }));
      setAllergyInput('');
    }
  };

  const removeAllergy = (a) => {
    setForm(p => ({ ...p, allergies: p.allergies.filter(x => x !== a) }));
  };

  const data = editing ? form : child;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Child Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Manage your child's personal and health information</p>
        </div>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          className={editing ? 'btn-primary' : 'btn-secondary'}
        >
          {editing ? <><Save className="w-4 h-4" /> Save Changes</> : <><Edit className="w-4 h-4" /> Edit Profile</>}
        </button>
      </div>

      {/* Profile header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center text-white text-2xl font-black shadow-lg flex-shrink-0">
            {child.name.charAt(0)}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">{child.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{child.gender} • {age} old</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className={`badge ${bmiStatus.bg} ${bmiStatus.color}`}>BMI {bmi} — {bmiStatus.label}</span>
              <span className="badge badge-info">{child.bloodGroup} Blood</span>
              {child.allergies.map(a => (
                <span key={a} className="badge badge-warning">{a}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="card p-6 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-primary-600" /> Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Child's Name</label>
              {editing ? (
                <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              ) : (
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 py-2">{child.name}</p>
              )}
            </div>
            <div>
              <label className="label">Date of Birth</label>
              {editing ? (
                <input type="date" className="input" value={form.dob} onChange={e => setForm(p => ({ ...p, dob: e.target.value }))} />
              ) : (
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 py-2 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" /> {child.dob}
                </p>
              )}
            </div>
            <div>
              <label className="label">Gender</label>
              {editing ? (
                <select className="input" value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}>
                  <option>Female</option><option>Male</option><option>Other</option>
                </select>
              ) : (
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 py-2">{child.gender}</p>
              )}
            </div>
            <div>
              <label className="label">Age</label>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 py-2">{age}</p>
            </div>
          </div>
        </div>

        {/* Health Information */}
        <div className="card p-6 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-teal-600" /> Health Metrics
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Height (cm)</label>
              {editing ? (
                <input type="number" className="input" value={form.height} onChange={e => setForm(p => ({ ...p, height: +e.target.value }))} />
              ) : (
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 py-2 flex items-center gap-2">
                  <Ruler className="w-3.5 h-3.5 text-gray-400" /> {child.height} cm
                </p>
              )}
            </div>
            <div>
              <label className="label">Weight (kg)</label>
              {editing ? (
                <input type="number" step="0.1" className="input" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: +e.target.value }))} />
              ) : (
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 py-2 flex items-center gap-2">
                  <Weight className="w-3.5 h-3.5 text-gray-400" /> {child.weight} kg
                </p>
              )}
            </div>
            <div>
              <label className="label">Blood Group</label>
              {editing ? (
                <select className="input" value={form.bloodGroup} onChange={e => setForm(p => ({ ...p, bloodGroup: e.target.value }))}>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g}>{g}</option>)}
                </select>
              ) : (
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 py-2 flex items-center gap-2">
                  <Droplet className="w-3.5 h-3.5 text-red-400" /> {child.bloodGroup}
                </p>
              )}
            </div>
            <div>
              <label className="label">BMI</label>
              <p className={`text-sm font-bold mt-1 py-2 ${bmiStatus.color}`}>{bmi} — {bmiStatus.label}</p>
            </div>
          </div>
        </div>

        {/* Allergies */}
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Allergies
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {(editing ? form.allergies : child.allergies).map(a => (
              <span key={a} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium">
                {a}
                {editing && (
                  <button onClick={() => removeAllergy(a)} className="text-amber-500 hover:text-amber-700">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            {(editing ? form.allergies : child.allergies).length === 0 && (
              <p className="text-sm text-gray-400">No allergies recorded</p>
            )}
          </div>
          {editing && (
            <div className="flex gap-2">
              <input
                type="text"
                value={allergyInput}
                onChange={e => setAllergyInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addAllergy()}
                placeholder="Add allergy..."
                className="input flex-1"
              />
              <button onClick={addAllergy} className="btn-secondary px-4">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Medical History */}
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <ClipboardList className="w-4 h-4 text-purple-600" /> Medical History
          </h3>
          {editing ? (
            <textarea
              className="input min-h-[100px] resize-none"
              value={form.medicalHistory}
              onChange={e => setForm(p => ({ ...p, medicalHistory: e.target.value }))}
              placeholder="Enter relevant medical history..."
            />
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {child.medicalHistory || 'No significant medical history recorded.'}
            </p>
          )}
        </div>
      </div>

      {editing && (
        <div className="flex gap-3">
          <button onClick={handleSave} className="btn-primary">
            <Save className="w-4 h-4" /> Save Changes
          </button>
          <button onClick={() => { setForm({ ...child }); setEditing(false); }} className="btn-outline">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
