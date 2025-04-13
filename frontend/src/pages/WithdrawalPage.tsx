import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../store/auth-context';
import { walletApi } from '../lib/api';
import Button from '../components/ui/Button';

type PaymentMethod = 'phonePe' | 'googlePay' | 'paytm' | 'paypal' | 'bank';

interface WithdrawalFormData {
  amount: number;
  paymentMethod: PaymentMethod;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  email?: string;
}

const paymentMethods = [
  {
    id: 'phonePe',
    name: 'PhonePe',
    icon: '📱',
    fields: [{ name: 'upiId', label: 'UPI ID', type: 'text' }],
  },
  {
    id: 'googlePay',
    name: 'Google Pay',
    icon: '💳',
    fields: [{ name: 'upiId', label: 'UPI ID', type: 'text' }],
  },
  {
    id: 'paytm',
    name: 'Paytm',
    icon: '💰',
    fields: [{ name: 'upiId', label: 'UPI ID', type: 'text' }],
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '🌐',
    fields: [{ name: 'email', label: 'PayPal Email', type: 'email' }],
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: '🏦',
    fields: [
      { name: 'accountNumber', label: 'Account Number', type: 'text' },
      { name: 'ifscCode', label: 'IFSC Code', type: 'text' },
    ],
  },
];

const WithdrawalPage = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<WithdrawalFormData>();

  const selectedMethod = watch('paymentMethod');
  const selectedMethodConfig = paymentMethods.find(
    (m) => m.id === selectedMethod
  );

  const onSubmit = async (data: WithdrawalFormData) => {
    if (!user) return;

    if (data.amount > user.wallet.balance) {
      toast.error('Insufficient balance');
      return;
    }

    if (data.amount < 100) {
      toast.error('Minimum withdrawal amount is ₹100');
      return;
    }

    try {
      setIsSubmitting(true);
      await walletApi.requestWithdrawal(data.amount, {
        method: data.paymentMethod,
        details: {
          ...(data.accountNumber && { accountNumber: data.accountNumber }),
          ...(data.ifscCode && { ifscCode: data.ifscCode }),
          ...(data.upiId && { upiId: data.upiId }),
          ...(data.email && { email: data.email }),
        },
      });

      toast.success('Withdrawal request submitted successfully');
    } catch (error) {
      console.error('Withdrawal error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Balance Card */}
        <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Available Balance</h2>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            ₹{user?.wallet.balance.toFixed(2)}
          </p>
        </div>

        {/* Withdrawal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Amount Input */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Withdrawal Amount
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="amount"
                {...register('amount', {
                  required: 'Amount is required',
                  min: {
                    value: 100,
                    message: 'Minimum withdrawal amount is ₹100',
                  },
                  max: {
                    value: user?.wallet.balance || 0,
                    message: 'Amount exceeds available balance',
                  },
                })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Enter amount"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.amount.message}
                </p>
              )}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {paymentMethods.map((method) => (
                <div key={method.id}>
                  <input
                    type="radio"
                    id={method.id}
                    value={method.id}
                    {...register('paymentMethod', {
                      required: 'Please select a payment method',
                    })}
                    className="peer hidden"
                  />
                  <label
                    htmlFor={method.id}
                    className="flex cursor-pointer flex-col items-center rounded-lg border p-4 text-center peer-checked:border-primary-500 peer-checked:bg-primary-50"
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <span className="mt-2 text-sm font-medium">
                      {method.name}
                    </span>
                  </label>
                </div>
              ))}
            </div>
            {errors.paymentMethod && (
              <p className="mt-1 text-sm text-red-600">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          {/* Payment Details Fields */}
          {selectedMethodConfig && (
            <div className="space-y-4">
              {selectedMethodConfig.fields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>
                  <div className="mt-1">
                    <input
                      type={field.type}
                      id={field.name}
                      {...register(field.name as keyof WithdrawalFormData, {
                        required: `${field.label} is required`,
                      })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors[field.name as keyof WithdrawalFormData] && (
                      <p className="mt-1 text-sm text-red-600">
                        {
                          errors[field.name as keyof WithdrawalFormData]
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            fullWidth
          >
            Request Withdrawal
          </Button>
        </form>

        {/* Information Card */}
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-xl">ℹ️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Withdrawal Information
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc space-y-1 pl-5">
                  <li>Minimum withdrawal amount is ₹100</li>
                  <li>Withdrawals are processed within 24-48 hours</li>
                  <li>
                    Make sure to double-check your payment details before
                    submitting
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WithdrawalPage; 