import { useState, useEffect } from 'react';
import { Upload, Search, FolderOpen, FileText, Image } from 'lucide-react';
import FileCard from '../components/FileCard.jsx';
import { useApp } from '../context/AppContext.jsx';

const CATEGORIES = ['All', 'Birth Records', 'Vaccination', 'Reports', 'Prescription'];

export default function MedicalRecords() {
  const { child, showToast } = useApp();
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch live records from MySQL
  useEffect(() => {
    if (!child) return;
    const fetchRecords = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/children/${child.id}/records`);
        if (response.ok) {
          const data = await response.json();
          setRecords(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [child]);

  const filtered = records.filter(r => {
    const matchCat = category === 'All' || r.category === category;
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/records/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setRecords(prev => prev.filter(r => r.id !== id));
        showToast('File deleted', 'success');
      }
    } catch (err) {
      showToast('Error deleting file', 'error');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setDragging(false);
    
    if (!child) {
        showToast('No child selected', 'error');
        return;
    }

    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (!file) return;

    setUploading(true);
    
    // Create FormData to send the physical file across the internet
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('category', 'Reports'); 

    try {
      const response = await fetch(`http://localhost:5000/api/children/${child.id}/records`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        showToast('File uploaded successfully!', 'success');
        const fetchRes = await fetch(`http://localhost:5000/api/children/${child.id}/records`);
        const data = await fetchRes.json();
        setRecords(data);
      } else {
        showToast('Upload failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Upload error', 'error');
    } finally {
      setUploading(false);
    }
  };

  const stats = [
    { label: 'Total Files', value: records.length, icon: FolderOpen, color: 'text-primary-600' },
    { label: 'Reports', value: records.filter(r => r.category === 'Reports').length, icon: FileText, color: 'text-emerald-600' },
    { label: 'Prescriptions', value: records.filter(r => r.category === 'Prescription').length, icon: FileText, color: 'text-blue-600' },
    { label: 'Images', value: records.filter(r => r.file_type === 'image').length, icon: Image, color: 'text-purple-600' },
  ];

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading records...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Medical Records</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Securely store and manage all health documents</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="card p-4">
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${uploading ? 'opacity-50 cursor-wait' : 'cursor-pointer'} ${dragging
          ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        onDragOver={e => { e.preventDefault(); if(!uploading) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={!uploading ? handleUpload : undefined}
        onClick={() => !uploading && document.getElementById('file-input').click()}
      >
        <input id="file-input" type="file" className="hidden" onChange={handleUpload} accept=".pdf,.jpg,.jpeg,.png" />
        <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-3">
          <Upload className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
          {uploading ? 'Uploading securely to server...' : (dragging ? 'Drop your file here!' : 'Drag & drop files here, or click to browse')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search records..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-9 text-sm" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${category === cat
              ? 'gradient-bg text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
              }`}>
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-400 text-sm">No records found. Upload your first document!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(file => (
            <FileCard key={file.id} file={file} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
