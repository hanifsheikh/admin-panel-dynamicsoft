import { Inter } from 'next/font/google'
import { useState } from 'react';
 
const inter = Inter({
  subsets:['latin'], 
  variable: '--inter-font',
})
type Props = {
    toggleModal: Function, 
    refreshTable: Function, 
    domainToDelete: string, 
  };

  
  
const DeleteSubdomainModal = ({toggleModal, refreshTable, domainToDelete}: Props) => {
     const deleteSubdomain = async () => {
      setIsDeleting(() => true);
      await fetch('/api/subdomain/delete', {
        method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({domain_name, domainToDelete}),
        }) 
        .then(response => {              
            setIsDeleting(() => false);  
            refreshTable();
            toggleModal();
            return response.json()
          }).then(response => {
            if(response.error){
            setIsDeleting(() => false);  
            throw new Error(response.error)
          }
        })
      }
 
  
    const [domain_name, setDomainName] = useState<string>('');    
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [subdomainTextMatched, setSubdomainTextMatched] = useState<boolean>(false);
 
    return (  
    <div className="fixed top-0 left-0 bg-[#000]/30 w-full h-full backdrop-blur z-40">
     <div className="flex items-center justify-center h-full">
        <div className="flex flex-col bg-white w-[800px] p-3 px-5 rounded-xl shadow-3xl">
        <div className="flex border-b justify-between items-center border-[#e1e1e1] pb-1 w-full font-bold">
           <div className="flex"> Delete subdomain</div>
           {
            isDeleting ? <div className="cursor-wait flex text-center h-4 w-4 bg-gray-300 text-white rounded-full"></div>
            :<div onClick={()=>toggleModal()} className="cursor-pointer flex text-center h-4 w-4 bg-red-500 text-white rounded-full"></div>
           }
        </div>
     {
      isDeleting ? <div className="py-20 flex flex-col space-y-3 justify-center items-center">
        <p className='flex flex-row space-x-1 items-center text-red-500 font-bold'>
          <div className='loading-danger flex'></div>
          <span className='flex'> Deleting...</span>
           </p>
        <p className='text-slate-500 font-bold'> {domainToDelete} </p>
      </div> :
      <>
      <div className="flex items-center flex-col space-y-3 justify-center space-x-2 mt-10">
      <p className='flex'>Write full domain name <b className='font-bold ml-1 text-red-500'> {domainToDelete} </b></p>
      <input type="text" 
      onChange={e => {
        setDomainName(() => e.target.value);
        if(e.target.value === domainToDelete){
          setSubdomainTextMatched(() => true)
        }else {            
          setSubdomainTextMatched(() => false)
        }
      }} 
        className="flex text-center w-96 border-b-2 focus:border-b-2 border-slate-500/10 focus:border-[#0070f3]  outline-none px-3 py-1 transition duration-100 ease-in-out"
        placeholder='Enter full domain name'        
      />      
      </div>
      <div className="flex items-center justify-center mt-10">
   {
    subdomainTextMatched ? <>
     <button onClick={()=>deleteSubdomain()} className="mb-5 flex items-center space-x-2 px-5 py-2 rounded-lg bg-[#FF6A63] hover:drop-shadow-[0_4px_14px_rgba(255,106,99,0.40)] transition duration-300 ease-in-out border border-red-500 drop-shadow-[0_4px_8px_rgba(255,106,99,0.40)]">
         <span className={`flex ${inter.className} font-medium mt-0.5 text-white text-sm`}> Delete Subdomain</span>
    </button> 
    </>:
     <button   className="mb-5 flex items-center space-x-2 px-5 py-2 opacity-10 rounded-lg bg-[#FF6A63] hover:drop-shadow-[0_4px_14px_rgba(255,106,99,0.40)] transition duration-300 ease-in-out border border-red-500 drop-shadow-[0_4px_8px_rgba(255,106,99,0.40)]">
     <span className={`flex ${inter.className} font-medium mt-0.5 text-white text-sm`}> Delete Subdomain</span>
</button> 
   }
      </div>
      </>
     }
         </div>
     </div>
    </div>
  );
}
 
export default DeleteSubdomainModal;