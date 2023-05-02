 import Head from 'next/head'  
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
const inter = Inter({ subsets: ['latin'],variable: '--inter-font', })
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form'; 

export default function Login() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      router.push(redirect || '/dashboard');
    }
  }, [router, session, redirect]);  
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
 
  return (
   <>
   <Head>
    <title>Admin Panel - DynamicSoft</title>
   </Head>
   <div className="container mx-auto">
    <div className="flex justify-center w-full my-10">
      <div className="flex items-center flex-col bg-white shadow-md p-10">   
     <form onSubmit={handleSubmit(submitHandler)}>
    <input type="email"
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter valid email',
              },
            })}
            {...errors.email && (
              <div className="text-red-500">{errors.email.message}</div>
            )}
      className={`flex ${inter.className} w-full outline-none border border-[#e1e1e1] px-3 py-2 text-lg text-[#e7e7e7]`}/>
    <input type="password"
            {...register('password', {
              required: 'Please enter password',
              minLength: { value: 6, message: 'password is more than 5 chars' },
            })}
          className='flex font-bold outline-none border border-[#e1e1e1] px-3 py-2 text-3xl text-[#e7e7e7]'/>
    <input type="submit" hidden />
     </form>
      </div>
    </div>
   </div>
   </>
  )
}