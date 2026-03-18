import { useEffect, useState, useMemo } from 'react';
import { API_BASE_URL } from '../config';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
  vehicle_id?: number;
}

interface ContactInquiriesProps {
  token: string;
}

export default function ContactInquiries({ token }: ContactInquiriesProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');

  useEffect(() => {
    fetch(`${API_BASE_URL}/contact-inquiries`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInquiries(data);
        } else {
          console.error('Expected array of inquiries, got:', data);
          setInquiries([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await fetch(`${API_BASE_URL}/contact-inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/contact-inquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setInquiries(inquiries.filter(i => i.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(i => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        i.name.toLowerCase().includes(searchLower) ||
        i.email.toLowerCase().includes(searchLower) ||
        i.message.toLowerCase().includes(searchLower)
      );
      const matchesStatus = statusFilter === 'all' || i.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchTerm, statusFilter]);

  return (
    <div className="bg-white shadow-sm rounded-[2rem] border border-zinc-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-zinc-900 tracking-tighter uppercase">Leads & Inquiries</h2>
          <p className="text-xs text-zinc-400 font-medium mt-1">
            {filteredInquiries.length} records matching criteria
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex bg-zinc-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${statusFilter === 'all' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('new')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${statusFilter === 'new' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              New
            </button>
            <button
              onClick={() => setStatusFilter('contacted')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${statusFilter === 'contacted' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              Contacted
            </button>
            <button
              onClick={() => setStatusFilter('closed')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${statusFilter === 'closed' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              Closed
            </button>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-zinc-50 border-none rounded-xl px-4 py-2 text-sm w-full md:w-64 focus:ring-2 focus:ring-zinc-800 transition-all outline-none"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-100">
          <thead className="bg-zinc-50/50">
            <tr>
              <th className="px-8 py-4 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Date</th>
              <th className="px-8 py-4 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Contact</th>
              <th className="px-8 py-4 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Message</th>
              <th className="px-8 py-4 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-4 text-right text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zinc-50">
            {loading ? (
              <tr><td colSpan={5} className="px-8 py-10 text-center italic text-zinc-400">Loading inquiries...</td></tr>
            ) : filteredInquiries.length === 0 ? (
              <tr><td colSpan={5} className="px-8 py-10 text-center italic text-zinc-400">No inquiries found.</td></tr>
            ) : (
              filteredInquiries.map(inquiry => (
                <tr key={inquiry.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-8 py-5 whitespace-nowrap text-xs text-zinc-500 font-medium">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-zinc-900 tracking-tight">{inquiry.name}</div>
                    <div className="text-xs text-zinc-500">{inquiry.email}</div>
                    <div className="text-xs text-zinc-400">{inquiry.phone}</div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs text-zinc-600 line-clamp-2 max-w-xs font-medium">{inquiry.message}</p>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className={`px-3 py-1.5 text-[9px] font-black rounded-md uppercase tracking-widest ${
                      inquiry.status === 'new' ? 'bg-red-50 text-red-600 border border-red-100' :
                      inquiry.status === 'contacted' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                      'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right flex items-center justify-end gap-3 h-full min-h-[5rem]">
                    <select 
                      value={inquiry.status}
                      onChange={(e) => handleUpdateStatus(inquiry.id, e.target.value)}
                      className="bg-white border border-zinc-200 rounded-lg px-2 py-1.5 focus:ring-zinc-800 focus:border-zinc-800 text-[10px] font-bold uppercase cursor-pointer"
                    >
                      <option value="new">NEW</option>
                      <option value="contacted">CONTACTED</option>
                      <option value="closed">CLOSED</option>
                    </select>
                    <button 
                      onClick={() => handleDelete(inquiry.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Lead"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
