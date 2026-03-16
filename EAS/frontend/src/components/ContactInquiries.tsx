import { useEffect, useState } from 'react';

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

  useEffect(() => {
    fetch('http://localhost:3000/api/contact-inquiries', {
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
      await fetch(`http://localhost:3000/api/contact-inquiries/${id}`, {
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

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-100">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Leads & Inquiries</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center italic text-gray-500">Loading inquiries...</td></tr>
            ) : inquiries.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center italic text-gray-500">No inquiries yet.</td></tr>
            ) : (
              inquiries.map(inquiry => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{inquiry.name}</div>
                    <div className="text-xs text-gray-500">{inquiry.email}</div>
                    <div className="text-xs text-gray-500">{inquiry.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-gray-600 line-clamp-2 max-w-xs">{inquiry.message}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${
                      inquiry.status === 'new' ? 'bg-red-50 text-red-600 border border-red-100' :
                      inquiry.status === 'contacted' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                      'bg-green-50 text-green-600 border border-green-100'
                    }`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                    <select 
                      value={inquiry.status}
                      onChange={(e) => handleUpdateStatus(inquiry.id, e.target.value)}
                      className="bg-white border border-gray-300 rounded px-2 py-1 focus:ring-black focus:border-black text-[10px] font-bold"
                    >
                      <option value="new">NEW</option>
                      <option value="contacted">CONTACTED</option>
                      <option value="closed">CLOSED</option>
                    </select>
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
