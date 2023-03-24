import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

type FormData = {
  amount: number;
}

const FundAccount = () => {

  const { user, fundAccount } = useAppContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();


  if (!user) return null;

  let profileColorCache = "";

  const  getRandomColor=()=> {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      if (profileColorCache) {
        return profileColorCache;
      }
      profileColorCache = color;
      return color;
    }


    const getInitials = (name: string) => {
      let initials;
      const nameSplit = name.split(" ");
      const nameLength = nameSplit.length;
      if (nameLength > 1) {
          initials =
              nameSplit[0].substring(0, 1) +
              nameSplit[nameLength - 1].substring(0, 1);
      } else if (nameLength === 1) {
          initials = nameSplit[0].substring(0, 1);
      } else return "A";

      return initials.toUpperCase();
    };


    const createImageFromInitials = (size: number, name: string, color: string) => {
      if (name == null) return;
      name = getInitials(name)

      const canvas = document.createElement('canvas')
      const context=canvas.getContext('2d')
      canvas.width=canvas.height=size
      if (context == null) return;
      context.fillStyle="#ffffff"
      context.fillRect(0,0,size,size)

      context.fillStyle=`${color}50`
      context.fillRect(0,0,size,size)

      context.fillStyle=color;
      context.textBaseline='middle'
      context.textAlign='center'
      context.font =`${size/2}px Roboto`
      context.fillText(name,(size/2),(size/2))

      return canvas.toDataURL()
    };

  const submitForm = (data: FormData) => {
    try {
      fundAccount(data.amount);
      toast.success('Account funded successfully');
    } catch (error) {
      toast.error('An error occurred while funding your account');
    }
  };

  return (
    <div className="h-fit max-w-lg bg-white border border-primary rounded-lg shadow-md">
      <div className="flex flex-row items-center px-5 py-2">
        <img
          className="w-30 h-24 rounded"
          src={createImageFromInitials(
            500,
            `${user.firstName} ${user.lastName}`,
            getRandomColor()
          )}
          alt="Avatar"
        />
        <div className="flex flex-col p-4">
          <h5 className="mb-1 text-xl font-medium text-gray capitalize">
            {user.firstName} {user.lastName}
          </h5>
          <div className="flex flex-col">
            <span className="capitalize mt-2 font-semibold mb-4 overflow-scroll text-sm text-gray">
              {' '}
              {'Account NUmber: '} {user.account.number}
            </span>
            <span className="capitalize font-semibold mb-4 overflow-scroll text-sm text-gray">
              {' '}
              {'Account Balance: '} {user.account.balance}
            </span>
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
                placeholder="Amount to Fund"
                {...register('amount', { required: true,
                    valueAsNumber: true,
                    validate: (value) => value > 0
                  })}
                aria-invalid={errors.amount ? 'true' : 'false'}
              />
              {errors.amount && (
                <p className="text-sm text-red">
                  Amount to Fund is required
                </p>
              )}
            </div>
            <button
              type="submit"
              className="capitalize text-primary bg-cream border border-primary hover:bg-primary hover:text-cream focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
            >
              Fund
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FundAccount