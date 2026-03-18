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
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; leadId: number | null }>({
    isOpen: false,
    leadId: null,
  });

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

  const openDeleteModal = (id: number) => {
    setDeleteModal({ isOpen: true, leadId: id });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, leadId: null });
  };

  const confirmDelete = async () => {
    if (!deleteModal.leadId) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/contact-inquiries/${deleteModal.leadId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setInquiries(inquiries.filter(i => i.id !== deleteModal.leadId));
        closeDeleteModal();
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
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeDeleteModal}></div>
          <div className="relative bg-white w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 border border-zinc-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 border border-red-100">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-zinc-900 tracking-tighter uppercase">Purge Lead?</h3>
              <p className="text-xs text-zinc-400 mt-2 font-bold uppercase tracking-wider leading-relaxed text-center">This operation is permanent and cannot be reversed from the records.</p>
              
              <div className="grid grid-cols-2 gap-4 w-full mt-10">
                <button 
                  onClick={closeDeleteModal}
                  className="px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-red-600 transition-all shadow-xl shadow-zinc-900/10"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm rounded-[2.5rem] border border-zinc-100 overflow-hidden">
        <div className="px-8 py-8 border-b border-zinc-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase">Leads & Inquiries</h2>
            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">
              {filteredInquiries.length} active records detected
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200">
              {['all', 'new', 'contacted', 'closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    statusFilter === status ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-3.5 text-xs font-bold w-full md:w-72 focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all outline-none"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-100">
            <thead className="bg-zinc-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-8 py-5 text-left text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Contact</th>
                <th className="px-8 py-5 text-left text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Dispatch Message</th>
                <th className="px-8 py-5 text-left text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-right text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Command</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-50">
              {loading ? (
                <tr><td colSpan={5} className="px-8 py-16 text-center text-[10px] font-black uppercase tracking-widest text-zinc-300 italic">Syncing communication channels...</td></tr>
              ) : filteredInquiries.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-16 text-center text-[10px] font-black uppercase tracking-widest text-zinc-300 italic">No communication history found.</td></tr>
              ) : (
                filteredInquiries.map(inquiry => (
                  <tr key={inquiry.id} className="hover:bg-zinc-50/30 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      {new Date(inquiry.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-black text-zinc-900 tracking-tight uppercase">{inquiry.name}</div>
                      <div className="text-[10px] text-zinc-500 font-medium">{inquiry.email}</div>
                      <div className="text-[9px] text-zinc-400 font-bold mt-0.5 tracking-tighter">{inquiry.phone}</div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs text-zinc-600 line-clamp-2 max-w-sm font-medium leading-relaxed">"{inquiry.message}"</p>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="relative inline-block">
                        <select 
                          value={inquiry.status}
                          onChange={(e) => handleUpdateStatus(inquiry.id, e.target.value)}
                          className={`appearance-none bg-white border border-zinc-200 rounded-xl px-4 py-2 pr-10 focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${
                            inquiry.status === 'new' ? 'text-red-600' :
                            inquiry.status === 'contacted' ? 'text-yellow-600' :
                            'text-emerald-600'
                          }`}
                        >
                          <option value="new" className="text-zinc-900 bg-white font-bold">NEW</option>
                          <option value="contacted" className="text-zinc-900 bg-white font-bold">CONTACTED</option>
                          <option value="closed" className="text-zinc-900 bg-white font-bold">CLOSED</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                      <button 
                        onClick={() => openDeleteModal(inquiry.id)}
                        className="p-3 bg-white text-zinc-300 hover:text-red-600 hover:bg-red-50 border border-zinc-200 rounded-xl transition-all duration-300 shadow-sm"
                        title="Purge Record"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
