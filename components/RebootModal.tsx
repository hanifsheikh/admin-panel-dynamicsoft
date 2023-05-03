import { Inter } from 'next/font/google'
import Image from 'next/image';
import { useState } from 'react';
const inter = Inter({
  subsets:['latin'], 
  variable: '--inter-font',
})
type Props = {
    toggleModal: Function
  };
  
const RebootModal = ({toggleModal}: Props) => {
     const rebootVPS = async () => {
      setIsRebooting(() => true);
      await fetch('/api/reboot', {
        method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({}),
        }) 
        .then(response => {              
            setIsRebooting(() => false);           
            toggleModal();
            return response.json()
          }).then(response => {
            if(response.error){
            setIsRebooting(() => false);  
            throw new Error(response.error)
          }
        })
      }
 
     
    const [isRebooting, setIsRebooting] = useState<boolean>(false);    
    const [captcha] = useState<string>(Math.random().toString(36).slice(7));         
    const [captchaMatched, setCaptchaMached] = useState<boolean>(false);     
    return (  
    <div className="fixed top-0 left-0 bg-[#000]/30 w-full h-full backdrop-blur z-40">
     <div className="flex items-center justify-center h-full">
        <div className="flex flex-col bg-white w-[800px] p-3 px-5 rounded-xl shadow-3xl">
        <div className="flex border-b justify-between items-center border-[#e1e1e1] pb-1 w-full font-bold">
           <div className="flex items-center space-x-2">
           <Image draggable="false" className='flex w-5 h-5 select-none' src={'/icons/reboot.png'} alt="reboot.png" height={32} width={32}/>
             <span className='flex'>Reboot VPS</span>
             </div>
           {
            isRebooting ? <div className="cursor-wait flex text-center h-4 w-4 bg-gray-300 text-white rounded-full"></div>
            :<div onClick={()=>toggleModal()} className="cursor-pointer flex text-center h-4 w-4 bg-red-500 text-white rounded-full"></div>
           }
        </div>
     {
      isRebooting ? <div className="py-20 flex flex-col space-y-3 justify-center items-center">
        <p className='flex flex-row space-x-1 items-center text-blue-500 font-bold'>
          <div className='loading flex'></div>
          <span className='flex'> Rebooting...</span>
           </p>        
      </div> :
      <>
      <div className="flex items-center flex-col space-y-3 justify-center space-x-2 mt-10">
      <p className='flex'><b className='font-bold tracking-widest text-2xl ml-1 text-slate-500 select-none' draggable="false"> {captcha} </b> </p>
 
      <input type="text" 
      autoFocus
      onChange={(e) => {        
        if(e.target.value === captcha){
          setCaptchaMached(() => true)
        }else {            
          setCaptchaMached(() => false)
        }
    }
    } 
        className="flex text-center w-32 font-bold text-base text-slate-500 border-b-2 focus:border-b-2 border-slate-500/10 focus:border-[#0070f3]  outline-none px-3 py-1 transition duration-100 ease-in-out"
        placeholder='Enter captcha'        
      />      
      </div>
      <div className="flex items-center justify-center mt-10">
   {
    captchaMatched ? <>
     <button onClick={()=>rebootVPS()} className="mb-5 flex items-center space-x-2 px-5 py-2 rounded-lg bg-[#FF6A63] hover:drop-shadow-[0_4px_14px_rgba(255,106,99,0.40)] transition duration-300 ease-in-out border border-red-500 drop-shadow-[0_4px_8px_rgba(255,106,99,0.40)]">
         <span className={`flex ${inter.className} font-medium mt-0.5 text-white text-sm`}> Reboot VPS</span>
    </button> 
    </>:
     <button  className="mb-5 flex items-center space-x-2 px-5 py-2 opacity-10 rounded-lg bg-[#FF6A63] hover:drop-shadow-[0_4px_14px_rgba(255,106,99,0.40)] transition duration-300 ease-in-out border border-red-500 drop-shadow-[0_4px_8px_rgba(255,106,99,0.40)]">
     <span className={`flex ${inter.className} font-medium mt-0.5 text-white text-sm`}> Reboot VPS</span>
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
 
export default RebootModal;