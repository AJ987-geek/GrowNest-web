import { useState, useMemo, useEffect } from 'react';
import { Baby, Activity, Scale, Heart, Calendar, ArrowRight, User, AlertCircle, FileText, Droplet } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { calculateBMI, getBMIStatus } from '../utils/helpers.js';

export default function AddChild() {
    const { activeUserId, showToast } = useApp();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        dob: '',
        gender: 'Male',
        height: '',
        weight: '',
        bloodGroup: 'A+',
        allergies: '',
        medicalHistory: ''
    });

    // Instantly calculate BMI whenever height or weight changes!
    const [apiBmi, setApiBmi] = useState(0);
    const [apiStatus, setApiStatus] = useState('');

    // Calculate age as they type DOB
    const ageInYears = useMemo(() => {
        if (!form.dob) return 0;
        const ageDate = new Date(Date.now() - new Date(form.dob).getTime());
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }, [form.dob]);

    // Fetch from RapidAPI whenever height, weight, or age changes!
    // Fetch from RapidAPI whenever height, weight, or age changes!
    useEffect(() => {
        const fetchExternalBmi = async () => {
            if (form.weight && form.height) {
                try {
                    // 1. Convert centimeters to meters for the API
                    const heightInMeters = (parseFloat(form.height) / 100).toFixed(2);

                    // 2. Build the URL
                    const url = `https://body-mass-index-bmi-calculator.p.rapidapi.com/metric?weight=${form.weight}&height=${heightInMeters}`;

                    // 3. Add your exact headers
                    const options = {
                        method: 'GET',
                        headers: {
                            'x-rapidapi-key': 'd16b4296e9msh001c141084e0beap1f834ejsnc9dbd43109c8',
                            'x-rapidapi-host': 'body-mass-index-bmi-calculator.p.rapidapi.com',
                            'Content-Type': 'application/json'
                        }
                    };

                    const response = await fetch(url, options);

                    if (response.ok) {
                        // RapidAPI returns a JSON object like { bmi: 44.8, weight: 150, height: 1.83 }
                        const result = await response.json();

                        // 4. Save the exact API math result to state
                        setApiBmi(result.bmi);

                        // 5. Use our local helper to generate the word "Healthy", "Obese", etc based on age!
                        setApiStatus(getBMIStatus(result.bmi, ageInYears).label);
                    }
                } catch (error) {
                    console.error("API Error:", error);
                }
            } else {
                setApiBmi(0);
            }
        };

        // 500ms delay to prevent sending 10 requests while you type "14.5"
        const timeoutId = setTimeout(fetchExternalBmi, 500);
        return () => clearTimeout(timeoutId);
    }, [form.weight, form.height, ageInYears]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.dob || !form.height || !form.weight) {
            showToast('Please fill out all required fields', 'error');
            return;
        }

        setLoading(true);
        try {
            // Split comma-separated allergies into an array
            const allergiesArray = form.allergies
                .split(',')
                .map(a => a.trim())
                .filter(a => a.length > 0);

            const response = await fetch('http://localhost:5000/api/children', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: activeUserId,
                    name: form.name,
                    dob: form.dob,
                    gender: form.gender,
                    height: parseFloat(form.height),
                    weight: parseFloat(form.weight),
                    blood_group: form.bloodGroup,
                    allergies: allergiesArray,
                    medical_history: form.medicalHistory || 'None provided'
                }),
            });

            if (response.ok) {
                showToast('Child profile added successfully!', 'success');
                // Force the global state to fetch the new child from MySQL!
                window.location.href = '/dashboard';
            } else {
                const data = await response.json();
                showToast(data.error || 'Failed to save child', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Network error while saving', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center py-10 px-4">
            <div className="text-center mb-8 animate-fade-in mt-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
                    <Baby className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white">Let's set up your child's profile! 🎈</h1>
                <p className="text-gray-500 mt-2">Enter their complete health details for better AI insights.</p>
            </div>

            <div className="card max-w-2xl w-full p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-800 animate-slide-up mb-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="md:col-span-2">
                            <label className="label">Child's Name *</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="text" className="input pl-10" placeholder="e.g. Emma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                            </div>
                        </div>

                        <div>
                            <label className="label">Date of Birth *</label>
                            <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="date" className="input pl-10" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} required />
                            </div>
                        </div>

                        <div>
                            <label className="label">Gender</label>
                            <select className="input" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                                <option value="Male">Boy</option>
                                <option value="Female">Girl</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">Height (cm) *</label>
                            <div className="relative">
                                <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="number" step="0.1" className="input pl-10" placeholder="e.g. 95" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} required />
                            </div>
                        </div>

                        <div>
                            <label className="label">Weight (kg) *</label>
                            <div className="relative">
                                <Scale className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="number" step="0.1" className="input pl-10" placeholder="e.g. 14.5" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} required />
                            </div>
                        </div>

                        <div>
                            <label className="label">Blood Group</label>
                            <div className="relative">
                                <Droplet className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                                <select className="input pl-10" value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="label">Allergies</label>
                            <div className="relative">
                                <AlertCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                                <input type="text" className="input pl-10" placeholder="e.g. Peanuts, Dust (comma separated)" value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="label">Medical History</label>
                            <div className="relative">
                                <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                                <textarea
                                    className="input pl-10 py-3 min-h-[100px]"
                                    placeholder="Any previous illnesses, surgeries, or conditions we should know about..."
                                    value={form.medicalHistory}
                                    onChange={e => setForm({ ...form, medicalHistory: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dynamic External API Preview Block */}
                    {apiBmi > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">Live API Preview</p>
                                <h4 className="text-lg font-black text-gray-900 dark:text-white">Estimated BMI: <span className="text-primary-600">{apiBmi}</span></h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Status: {apiStatus}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${apiStatus === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                                <Heart className="w-6 h-6" />
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base mt-4 shadow-lg shadow-primary-500/30">
                        {loading ? 'Saving Profile...' : 'Complete Setup & Go to Dashboard'}
                        {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
                    </button>
                </form>
            </div>
        </div>
    );
}