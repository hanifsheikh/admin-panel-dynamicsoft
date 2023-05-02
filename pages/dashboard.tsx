import { Inter } from 'next/font/google'
import Head from 'next/head'
import Image from 'next/image' 
import {useRouter} from 'next/router'
import { signOut } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import AddSubdomainModal from '@/components/AddSubdomainModal'
import DeleteSubdomainModal from '@/components/DeleteSubdomainModal'
import RebootModal from '@/components/RebootModal'
 
const inter = Inter({
  subsets:['latin'], 
  variable: '--inter-font',
})

type Subdomain = {
  subdomain:string,
  automatic_update:boolean,
}
 
export default function Dashboard() {
  const router = useRouter();
 
  const [showModal, setShowModal] = useState<Boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<Boolean>(false);
  const [showRebootModal, setShowRebootModal] = useState<Boolean>(false);
  const [domainToDelete, setDomainToDelete] = useState<string>('');
  const [dataFetched, setDataFetched] = useState<Boolean>(false);
  const [php_version, setPHPVersion] = useState<String>("");
  const [node_version, setNodeVersion] = useState<String>("");
  const [storage_info, setStorageInfo] = useState<String>("");
  const [storage_percentage, setStoragePercentage] = useState<String>("");
  const [memory_info, setMemoryInfo] = useState<String>("");
  const [subdomains_count, setSubdomainsCount] = useState<number>(0);
  const [subdomains, setSubdomains] = useState<Subdomain[]>([]);
  const getData = useCallback(async () => {
    const res = await fetch('/api/system_info',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },      
      next: { revalidate: 1 } 
}) 
    const data  = await res.json();
    setPHPVersion(() => data.php_version)
    setNodeVersion(() => data.node_version)
    setStorageInfo(() => data.storage_info)
    setMemoryInfo(() => data.memory_info)
    setStoragePercentage(() => data.storage_percentage)
    setSubdomains(() => data.subdomains.sort((a:Subdomain,b:Subdomain) => (a.subdomain > b.subdomain) ? 1 : -1))
    setSubdomainsCount(() => data.subdomains_count)
    setDataFetched(() => true)
  }, []);

  const logoutClickHandler = () => {  
    signOut({ callbackUrl: '/' });
  };
  const toggleModal = ()=>{
    setShowModal((oldVal) => !oldVal); 
  }
  const toggleRebootModal = ()=>{
    setShowRebootModal((oldVal) => !oldVal); 
  }
  const toggleDeleteModal = (subdomain:string)=>{
    setShowDeleteModal((oldVal) => !oldVal); 
    setDomainToDelete(() => subdomain); 
  }
  const refreshTable = ()=>{
    getData();
    setTimeout(() => {
      getData();      
    }, 2000);
  }
  useEffect(()=> {   
    if(!dataFetched){
      getData();
      setInterval(() => {
        getData();
      }, 3000)
    }        
  }, [dataFetched, getData]);

  const handleAutomaticUpdateStatus = async (subdomain:string, value:boolean)=>{ 
    await fetch('/api/update_automatic_update_status', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({subdomain, value}),
    });
  }

  return dataFetched && (
   <>
   <Head>
    <title>Admin Panel - DynamicSoft</title>
   </Head>
  {showModal &&  <AddSubdomainModal toggleModal={toggleModal} refreshTable={refreshTable} />}  
  {showDeleteModal &&  <DeleteSubdomainModal toggleModal={toggleDeleteModal} refreshTable={refreshTable} domainToDelete={domainToDelete}/>}  
  {showRebootModal &&  <RebootModal toggleModal={toggleRebootModal} />}  
   <div className="container mx-auto">
  <div className="relative">
  <div className="flex justify-between my-5">
      <button onClick={()=>toggleModal()} className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-[#0070f3] hover:drop-shadow-[0_4px_14px_rgba(0,118,255,0.40)] transition duration-300 ease-in-out border border-[#0070f3] drop-shadow-[0_4px_8px_rgba(0,118,255,0.40)]">
        <span className="flex text-[18pt] leading-none text-white">+</span>
        <span className={`flex ${inter.className} font-medium mt-0.5 text-white text-sm`}> Add Subdomain</span>
      </button>
 <div className="flex space-x-2">
 <button onClick={() => toggleRebootModal()} className="flex items-center space-x-2 px-5 py-1  rounded-lg bg-white hover:drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] transition duration-100 ease-in-out border border-[#F7F7F7] drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
        <Image draggable="false" className='flex w-4 h-4 select-none' src={'/icons/reboot.png'} alt="reboot.png" height={32} width={32}/>
        <span className={`flex ${inter.className} font-medium mt-[1px] text-[#292929] text-sm`}>Reboot</span>
      </button>
      <button onClick={logoutClickHandler} className="flex items-center space-x-2 px-5 py-1  rounded-lg bg-white hover:drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] transition duration-100 ease-in-out border border-[#F7F7F7] drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
        <Image draggable="false" className='flex w-4 h-4 select-none' src={'/icons/logout.png'} alt="logout.png" height={32} width={32}/>
        <span className={`flex ${inter.className} font-medium mt-[1px] text-[#292929] text-sm`}>Logout</span>
      </button>
 </div>
    </div>
    <div className="py-5"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-10 xl:gap-15 2xl:gap-[5rem] text-white">
      <div className="flex justify-between items-center space-x-5 col-span-1 bg-[#424242] rounded-3xl py-7 px-10 drop-shadow-[0_15px_20px_rgba(66,66,66,0.50)]">      
      <div className="flex space-x-5 items-center">
      <Image draggable="false" className='w-14 h-14 select-none' src={'/icons/storage_icon.png'} alt="storage_icon.png" height={72} width={72}/>
        <div className="flex flex-col">
          <strong className={`flex ${inter.className} font-semibold text-base lg:text-lg drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]`}>Storage</strong>
          <p className={`flex ${inter.className} font-light text-xs lg:text-sm`}>{storage_info} </p>
        </div>
      </div>
        <div className="flex">
        <strong className='font-bold text-lg'>({storage_percentage})</strong>
        </div>
      </div>
      <div className="flex items-center space-x-5 col-span-1 bg-[#FF6A63] rounded-3xl py-7 px-10 drop-shadow-[0_15px_20px_rgba(255,106,99,0.50)]">      
        <Image draggable="false" className='w-14 h-14 select-none' src={'/icons/subdomains.png'} alt="subdomains.png" height={72} width={72}/>
        <div className="flex flex-col">
          <strong className={`flex ${inter.className} font-semibold text-base lg:text-lg drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]`}>Total Domains</strong>
          <p className={`flex ${inter.className} font-light text-xs lg:text-sm`}>
            <>            
            {subdomains_count} {subdomains_count > 1 ? 'Domains' : 'Domain' } running on NGINX server 
            </>
            </p>
        </div>
      </div>
      <div className="flex items-center space-x-5 col-span-1 bg-[#4CAA98] rounded-3xl py-7 px-10 drop-shadow-[0_15px_20px_rgba(76,170,152,0.50)]">      
        <Image draggable="false" className='w-14 h-14 select-none' src={'/icons/cpu.png'} alt="cpu.png" height={72} width={72}/>
        <div className="flex flex-col">
          <strong className={`flex ${inter.className} font-semibold text-base lg:text-lg drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]`}>System Information</strong>
          <p className={`flex ${inter.className} font-light text-xs lg:text-sm`}>PHP: {php_version} | NodeJS: {node_version}</p>
          <p className={`flex ${inter.className} font-light text-xs lg:text-sm`}>RAM: {memory_info}</p>
        </div>
      </div>        
    </div>
   <div className="card bg-white p-5 mt-10 rounded-2xl shadow">
     <div className={`${inter.className} flex text-2xl font-light`}>
      Subdomain List
    </div>
    <div className="w-full mt-2.5 border-b border-[#F7F7F7]"></div>
    <table className={`w-full ${inter.className}`}>
      <thead>
        <tr className='grid grid-cols-3 gap-5 border-b border-[#e1e1e1] py-2'>
          <th className='col-span-1 text-left font-semibold text-base'>Full Domain Name</th>
          <th className='flex col-span-1 justify-center font-semibold text-base'>Automatic Update</th>
          <th className='col-span-1 text-center font-semibold text-base'>Action</th>
        </tr>
      </thead>
      <tbody>
        {subdomains.map((subdomain,index) => {            
    return <React.Fragment key={index+1}>
      <tr className='grid grid-cols-3 gap-5 border-b border-[#e1e1e1] py-2'>
      <td className='flex col-span-1 items-center text-left font-normal text-base'>
        <a target={'blank'} href={`https://${subdomain.subdomain}`} className='hover:text-[#0070f3] transition duration-200 ease-in-out'>{subdomain.subdomain}</a>
      </td>
      <td className='flex items-center col-span-1 justify-center font-normal text-base'>
        <input type="checkbox" name={subdomain.subdomain} defaultChecked={subdomain.automatic_update} onChange={e => handleAutomaticUpdateStatus(e.target.name, e.target.checked)} />
      </td>
      <td className='col-span-1 text-center font-normal text-base'>
        <div className="flex justify-center items-center space-x-3">        
          <button className='text-white bg-[#424242] py-1.5 px-2 rounded-lg text-sm shadow-lg hover:shadow transition duration-300 ease-in-out border border-white'>
                Backup
          </button>
          <button onClick={()=>toggleDeleteModal(subdomain.subdomain)} className='text-white bg-[#FF6A63] py-1.5 px-2 rounded-lg text-sm shadow-lg hover:shadow transition duration-300 ease-in-out border border-white'>
              Delete
          </button>
        </div>
      </td>
    </tr>
    </React.Fragment>
     })}      
      </tbody>
    </table>
   </div>
  </div>
  </div> 
   </>
  )
}
 