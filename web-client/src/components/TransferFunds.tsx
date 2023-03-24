import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

type FormData = {
  amount: number;
  to: string;
}

const TransferFunds = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const submitForm = async (data: FormData) => {
    console.log(data);
    toast.success('Funds Transfered');
  };

  return (
    <div className="h-fit max-w-lg bg-white border border-primary rounded-lg shadow-md">
      <div className="flex flex-row items-center px-5 py-2">
        <div className="flex flex-col p-4">
        <div className='w-full p-4'>
          <h2 className="text-xl text-left font-semibold text-gray capitalize">Transfer Funds</h2>
        </div>
          <form
            onSubmit={handleSubmit((data) => {
              submitForm(data);
            })}
          >
            <div className="flex flex-col mb-2">
              <input
                className="px-4 py-2 text-sm text-black  border border-primary rounded-lg focus:border-blue-500 focus:outline-none focus:ring"
                id="amount"
                type="number"
                placeholder="Amount to Transfer"
                {...register('amount', { required: true,
                    valueAsNumber: true,
                    validate: (value) => value > 0
                  })}
                aria-invalid={errors.amount ? 'true' : 'false'}
              />
              {errors.amount && (
                <p className="text-sm text-red">
                  Amount to Transfer is required
                </p>
              )}
            </div>

            <div className="flex flex-col mb-2">
              <input
                className="px-4 py-2 text-sm text-black  border border-primary rounded-lg focus:border-blue-500 focus:outline-none focus:ring"
                id="to"
                type="number"
                placeholder="Account Number"
                {...register('to', { required: true,
                    valueAsNumber: true,
                  })}
                aria-invalid={errors.to ? 'true' : 'false'}
              />
              {errors.to && (
                <p className="text-sm text-red">
                  Account Number is required
                </p>
              )}
            </div>
            <button
              type="submit"
              className="capitalize text-primary bg-cream border border-primary hover:bg-primary hover:text-cream focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
            >
              Transfer
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TransferFunds