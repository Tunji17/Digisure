import React from 'react'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const submitForm = (data: FormData) => {
    console.log(data);
  }

  return (
    <section className="h-screen">
      <div className="px-6 h-full text-black m-auto">
        <div
          className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6"
        >
          <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
            <form onSubmit={handleSubmit((data) => {
                  submitForm(data);
              })}>

              <div className="mb-6 flex space-x-4">
                <div className='flex flex-col w-1/2'>
                  <input
                    type="text"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray bg-white bg-clip-padding border border-primary-light rounded transition ease-in-out m-0 focus:text-gray focus:bg-white focus:border-primary focus:outline-none"
                    placeholder={'First Name'}
                    {...register('firstName', { required: true })}
                    aria-invalid={errors.firstName ? "true" : "false"}
                  />
                  {errors.email && <p className='text-sm text-red'>First Name is required.</p>}
                </div>
                <div className='flex flex-col w-1/2'>
                  <input
                    type="text"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray bg-white bg-clip-padding border border-primary-light rounded transition ease-in-out m-0 focus:text-gray focus:bg-white focus:border-primary focus:outline-none"
                    placeholder={'Last Name'}
                    {...register('lastName', { required: true })}
                    aria-invalid={errors.lastName ? "true" : "false"}
                  />
                  {errors.email && <p className='text-sm text-red'>Last Name is required.</p>}
                </div>
              </div>

              <div className="mb-6 flex space-x-4">
              <div className='flex flex-col w-1/2'>
                  <input
                    type="email"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray bg-white bg-clip-padding border border-primary-light rounded transition ease-in-out m-0 focus:text-gray focus:bg-white focus:border-primary focus:outline-none"
                    placeholder={'Email'}
                    {...register('email', { required: true })}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email && <p className='text-sm text-red'>email is required.</p>}
                </div>
                 <div className='flex flex-col w-1/2'>
                  <input
                    type="password"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray bg-white bg-clip-padding border border-primary-light rounded transition ease-in-out m-0 focus:text-gray focus:bg-white focus:border-primary focus:outline-none"
                    placeholder={'Password'}
                    {...register('password', { required: "Password is required" })}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                {errors.password && <p className='text-sm text-red' role="alert">{errors.password?.message || "Password is required"}</p>}
                </div>

              </div>

              <Link to="/" className="text-sm text-primary">
                Already have an account? Login
              </Link>

              <div className="text-center lg:text-left">
                <button
                  type="submit"
                  className="inline-block px-7 py-3 bg-primary text-cream font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-primary hover:shadow-lg focus:bg-primary focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary active:shadow-lg transition duration-150 ease-in-out"
                >
                  login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Signup