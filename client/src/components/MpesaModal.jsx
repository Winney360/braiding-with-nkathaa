import React, { useState } from 'react';
import { Smartphone, CheckCircle, Loader2, X, ShieldAlert, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function MpesaModal({ booking, isOpen, onClose, onPaymentSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState(booking?.customerPhone || '');
  const [step, setStep] = useState('prompt'); // 'prompt', 'sending', 'pin_waiting', 'success', 'error'
  const [loading, setLoading] = useState(false);
  const [mpesaReceipt, setMpesaReceipt] = useState('');
  const { success, error } = useToast();

  if (!isOpen || !booking) return null;

  const depositAmount = booking.depositAmount || 1000;

  const handleInitiateStk = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 9) {
      error('Please enter a valid M-Pesa phone number');
      return;
    }

    setLoading(true);
    setStep('sending');

    // Simulate STK push trigger
    setTimeout(() => {
      setStep('pin_waiting');

      // Simulate PIN entry and confirmation
      setTimeout(async () => {
        try {
          const res = await api.simulateMpesa(booking._id, {
            phoneNumber,
            amount: depositAmount
          });

          if (res.success) {
            setMpesaReceipt(res.data.receiptNumber);
            setStep('success');
            success(`M-Pesa payment received! Receipt: ${res.data.receiptNumber}`);

            // Trigger confetti
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 }
            });

            if (onPaymentSuccess) {
              onPaymentSuccess(res.data);
            }
          }
        } catch (err) {
          setStep('error');
          error(err.message || 'Payment simulation failed');
        } finally {
          setLoading(false);
        }
      }, 3000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-lavender/60">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-dark-text p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xl">
            M
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-dark-text">
              Lipa na M-Pesa Online
            </h3>
            <p className="text-xs text-gray-500">
              Instant Appointment Deposit Confirmation
            </p>
          </div>
        </div>

        {/* Step: Prompt */}
        {step === 'prompt' && (
          <form onSubmit={handleInitiateStk}>
            <div className="bg-gray-50 p-4 rounded-2xl mb-5 border border-gray-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Booking Style:</span>
                <span className="font-bold text-dark-text">{booking.hairstyleName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Scheduled Date:</span>
                <span className="font-medium text-dark-text">{booking.date} at {booking.timeSlot}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-200 font-bold">
                <span>Commitment Deposit:</span>
                <span className="text-emerald-700">KES {depositAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                M-Pesa Mobile Number
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 0712 345 678"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-lavender text-sm"
                  required
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-gray-400" />
                An instant STK Push prompt will be sent to your Safaricom line.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Pay KES {depositAmount.toLocaleString()} Deposit</span>
            </button>
          </form>
        )}

        {/* Step: Sending STK */}
        {step === 'sending' && (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
            <h4 className="font-heading font-bold text-base text-dark-text mb-1">
              Sending M-Pesa STK Push...
            </h4>
            <p className="text-xs text-gray-500">
              Requesting Safaricom payment gateway for {phoneNumber}
            </p>
          </div>
        )}

        {/* Step: Waiting for PIN */}
        {step === 'pin_waiting' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Smartphone className="w-8 h-8" />
            </div>
            <h4 className="font-heading font-bold text-base text-dark-text mb-1">
              Check Your Phone Screen
            </h4>
            <p className="text-xs text-gray-600 mb-4 max-w-xs mx-auto">
              A prompt has appeared on your phone. Enter your 4-digit M-Pesa PIN to authorize <strong>KES {depositAmount.toLocaleString()}</strong> to Braiding with Nkathaa.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying authorization...</span>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#D4FF3F] text-dark-text flex items-center justify-center mx-auto mb-4 shadow-glow-chartreuse">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-heading font-bold text-xl text-dark-text mb-1">
              Deposit Confirmed!
            </h4>
            <p className="text-xs text-gray-600 mb-4">
              Your appointment slot is now officially <strong>CONFIRMED</strong> in our schedule.
            </p>

            <div className="bg-gray-50 p-4 rounded-2xl mb-6 text-xs text-left space-y-1.5 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">M-Pesa Receipt:</span>
                <span className="font-mono font-bold text-emerald-700">{mpesaReceipt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount Paid:</span>
                <span className="font-bold">KES {depositAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                  Deposit Paid
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-dark-text hover:bg-black text-white font-medium text-sm transition-all"
            >
              Done & Return
            </button>
          </div>
        )}

        {/* Step: Error */}
        {step === 'error' && (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-tomato/10 text-tomato flex items-center justify-center mx-auto mb-4">
              <X className="w-7 h-7" />
            </div>
            <h4 className="font-heading font-bold text-base text-dark-text mb-1">
              Transaction Not Completed
            </h4>
            <p className="text-xs text-gray-600 mb-6">
              The M-Pesa transaction was cancelled or timed out. You may retry or pay upon arrival at the salon.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setStep('prompt')}
                className="flex-1 py-2.5 rounded-full bg-[#CBB3E8] text-dark-text font-medium text-xs"
              >
                Retry M-Pesa
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-full bg-gray-100 text-gray-700 font-medium text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
