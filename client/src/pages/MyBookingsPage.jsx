import React, { useState } from 'react';
import { Search, Calendar, Clock, CreditCard, MessageCircle, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import MpesaModal from '../components/MpesaModal';

export default function MyBookingsPage() {
  const [query, setQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mpesa modal
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);

  const { error, success } = useToast();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || query.trim().length < 3) {
      error('Please enter your phone number or email address');
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      const res = await api.getMyBookings(query.trim());
      if (res.success) {
        setBookings(res.data);
        if (res.data.length === 0) {
          success('No bookings found matching your search. Try another email or phone.');
        }
      }
    } catch (err) {
      error(err.message || 'Error looking up appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">Confirmed</span>;
      case 'Pending':
        return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">Pending Review</span>;
      case 'Completed':
        return <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">Completed</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#CBB3E8] text-dark-text text-xs font-bold uppercase tracking-wider mb-2">
            Client Self-Service
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#333333]">
            My Appointment Status
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Look up your appointment details, check confirmation status, or complete your deposit using your phone number or email.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-lavender/40 mb-10">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Enter your phone (e.g. 0712345678) or email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-8 rounded-2xl bg-[#E34234] hover:bg-[#CC3326] text-white font-bold text-sm shadow-glow-tomato transition-all"
            >
              {loading ? 'Searching...' : 'Find Appointments'}
            </button>
          </form>
          <p className="text-[11px] text-gray-400 mt-2">
            Try searching: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">sharon.otieno@gmail.com</code> or <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">+254 712 345 678</code>
          </p>
        </div>

        {/* Results */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-6">
            <h3 className="font-heading font-bold text-lg text-dark-text">
              Found {bookings.length} {bookings.length === 1 ? 'Appointment' : 'Appointments'}
            </h3>

            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100 hover:border-[#CBB3E8] transition-all"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block mb-1">
                      Appointment #{b._id.slice(-6).toUpperCase()}
                    </span>
                    <h4 className="font-heading font-bold text-xl text-dark-text">
                      {b.hairstyleName}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Client: <strong>{b.customerName}</strong> ({b.customerPhone})
                    </p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-1.5">
                    {getStatusBadge(b.status)}
                    <span className="text-xs font-bold text-dark-text">
                      KES {b.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-6 text-gray-600">
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl">
                    <Calendar className="w-4 h-4 text-[#CBB3E8]" />
                    <span><strong>Date:</strong> {b.date}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl">
                    <Clock className="w-4 h-4 text-[#D4FF3F]" />
                    <span><strong>Slot:</strong> {b.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl">
                    <CreditCard className="w-4 h-4 text-emerald-500" />
                    <span>
                      <strong>Deposit:</strong> {b.depositPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="text-xs text-gray-500 space-y-1 mb-6">
                  {b.preferredHairColor && (
                    <p><strong>Hair Color:</strong> {b.preferredHairColor}</p>
                  )}
                  {b.mpesaReference && (
                    <p><strong>M-Pesa Reference:</strong> <span className="font-mono text-emerald-700 font-bold">{b.mpesaReference}</span></p>
                  )}
                  {b.additionalNotes && (
                    <p><strong>Notes:</strong> {b.additionalNotes}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {!b.depositPaid && b.status !== 'Cancelled' && (
                    <button
                      onClick={() => setSelectedBookingForPayment(b)}
                      className="py-2.5 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay KES {b.depositAmount?.toLocaleString()} Deposit via M-Pesa</span>
                    </button>
                  )}

                  <a
                    href={`https://wa.me/254712345678?text=${encodeURIComponent(
                      `Hello Nkathaa, I am checking on my booking for ${b.hairstyleName} on ${b.date} at ${b.timeSlot}. My reference is #${b._id.slice(-6).toUpperCase()}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-5 rounded-full bg-[#CBB3E8] hover:bg-[#A88BD4] text-dark-text font-semibold text-xs transition-all flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : hasSearched ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-soft max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="font-heading font-bold text-base text-dark-text mb-1">
              No Appointments Found
            </h4>
            <p className="text-xs text-gray-500 mb-6">
              We couldn't find any appointments linked to "{query}". Please double-check your phone number or email address.
            </p>
            <a
              href="/book"
              className="py-2.5 px-6 rounded-full bg-[#E34234] text-white font-bold text-xs shadow-glow-tomato"
            >
              Book New Appointment
            </a>
          </div>
        ) : null}
      </div>

      {/* M-Pesa Modal */}
      {selectedBookingForPayment && (
        <MpesaModal
          booking={selectedBookingForPayment}
          isOpen={!!selectedBookingForPayment}
          onClose={() => setSelectedBookingForPayment(null)}
          onPaymentSuccess={(updated) => {
            setBookings(prev => prev.map(b => b._id === selectedBookingForPayment._id ? {
              ...b,
              depositPaid: true,
              paymentStatus: 'Deposit_Paid',
              mpesaReference: updated.receiptNumber,
              status: 'Confirmed'
            } : b));
          }}
        />
      )}
    </div>
  );
}
