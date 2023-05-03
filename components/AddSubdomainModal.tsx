import { Inter } from 'next/font/google'
import { useState } from 'react';
 
const inter = Inter({
  subsets:['latin'], 
  variable: '--inter-font',
})
type Props = {
    toggleModal: Function, 
    refreshTable: Function, 
  };

  
const AddSubdomainModal = ({toggleModal, refreshTable}: Props) => {
  const create_nginx_config = async () => {
    setIsCreatingNGINXConfig(() => true);
    await fetch('/api/subdomain/create_nginx_config', {
      method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({prefix}),
      }) 
      .then(response => {
        if(response.status !== 200){
          setNGINXConfigFailed(() => true)
          setNGINXConfigCreated(() => false);    
          setIsCreatingNGINXConfig(() => false);     
        }
        else {
          setNGINXConfigCreated(() => true);        
          setIsCreatingNGINXConfig(() => false);        
        } 
        return response.json()
      }).then(response => {
        if(response.error){
          throw new Error(response.error)
        }
      })
    }
  
    const create_database = async () => {
      setIsCreatingDatabase(() => true);
      await fetch('/api/subdomain/create_database', {
        method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({prefix}),
        }) 
        .then(response => {
          if(response.status !== 200){
            setDatabaseFailed(() => true)
            setDatabaseCreated(() => false);    
            setIsCreatingDatabase(() => false);     
          }
          else {
            setDatabaseCreated(() => true);        
            setIsCreatingDatabase(() => false);        
          } 
          return response.json()
        }).then(response => {
          if(response.error){
            throw new Error(response.error)
          }
        })
      }
    const create_crontab = async () => {
      setIsCreatingCrontab(() => true);
      await fetch('/api/subdomain/create_crontab', {
        method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({prefix}),
        }) 
        .then(response => {
          if(response.status !== 200){
            setCrontabFailed(() => true)
            setCrontabCreated(() => false);    
            setIsCreatingCrontab(() => false);     
          }
          else {
            setCrontabCreated(() => true);        
            setIsCreatingCrontab(() => false);        
          } 
          return response.json()
        }).then(response => {
          if(response.error){
            throw new Error(response.error)
          }
        })
      }
    const install_application = async () => {
      setIsInstallingApplication(() => true);
      await fetch('/api/subdomain/install_application', {
        method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({prefix}),
        }) 
        .then(response => {
          if(response.status !== 200){
            setApplicationInstallationFailed(() => true)
            setApplicationInstalled(() => false);    
            setIsInstallingApplication(() => false);     
          }
          else {
            setApplicationInstalled(() => true);        
            setIsInstallingApplication(() => false);        
          } 
          return response.json()
        }).then(response => {
          if(response.error){
            throw new Error(response.error)
          }
        })
      }
    const setup_application = async () => {
      setIsSettingUpApplication(() => true);
      await fetch('/api/subdomain/setup_application', {
        method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({prefix}),
        })
        .then(response => {
          if(response.status !== 200){
            setApplicationSetupFailed(() => true)
            setApplicationSetupDone(() => false);    
            setIsSettingUpApplication(() => false);     
          }
          else {             
              setApplicationSetupDone(() => true);        
              setIsSettingUpApplication(() => false);
            } 
          return response.json()
        }).then(response => {
          if(response.error){
            throw new Error(response.error)
          }
        })
      }
    const setup_ssl = async () => {
      setIsSettingUpSSL(() => true);
      setTimeout(async () => {
       await fetch('/api/subdomain/setup_ssl', {
          method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({prefix}),
          }) 
          .then(response => {
            if(response.status !== 200){
              setSSLSetupFailed(() => true)
              setSSLSetupDone(() => false);    
              setIsSettingUpSSL(() => false);     
            }
            else {
              setSSLSetupDone(() => true);        
              setIsSettingUpSSL(() => false);        
              toggleModal();
              setIsCreating(() => false); 
              refreshTable();
            } 
            return response.json()
          }).then(response => {
            if(response.error){
              throw new Error(response.error)
            }
          })
      }, 5000);
      }
 
    const [prefix, setPrefix] = useState<string>('');
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [isCreatingNGINXConfig, setIsCreatingNGINXConfig] = useState<boolean>(false);
    const [NGINXConfigCreated, setNGINXConfigCreated] = useState<boolean>(false);
    const [NGINXConfigFailed, setNGINXConfigFailed] = useState<boolean>(false);
    const [isCreatingDatabase, setIsCreatingDatabase] = useState<boolean>(false);
    const [DatabaseCreated, setDatabaseCreated] = useState<boolean>(false);
    const [DatabaseFailed, setDatabaseFailed] = useState<boolean>(false);
    const [isCreatingCrontab, setIsCreatingCrontab] = useState<boolean>(false);
    const [CrontabCreated, setCrontabCreated] = useState<boolean>(false);
    const [CrontabFailed, setCrontabFailed] = useState<boolean>(false);
    const [isInstallingApplication, setIsInstallingApplication] = useState<boolean>(false);
    const [ApplicationInstalled, setApplicationInstalled] = useState<boolean>(false);
    const [ApplicationInstallationFailed, setApplicationInstallationFailed] = useState<boolean>(false);
    const [isSettingUpApplication, setIsSettingUpApplication] = useState<boolean>(false);
    const [ApplicationSetupDone, setApplicationSetupDone] = useState<boolean>(false);
    const [ApplicationSetupFailed, setApplicationSetupFailed] = useState<boolean>(false);
    const [isSettingUpSSL, setIsSettingUpSSL] = useState<boolean>(false);
    const [SSLSetupDone, setSSLSetupDone] = useState<boolean>(false);
    const [SSLSetupFailed, setSSLSetupFailed] = useState<boolean>(false);
    const createSubdomain = async ()=>{ 
      setIsCreating(() => true);      
      try {
        await create_nginx_config();      
        await create_database();   
        await create_crontab();   
        await install_application();   
        await setup_application();           
        await setup_ssl();         
      }catch(e){
        console.log(e)
        return
      }     
    
      }
    return ( <>
    <div className="fixed top-0 left-0 bg-[#000]/30 w-full h-full backdrop-blur z-40">
     <div className="flex items-center justify-center h-full">
        <div className="flex flex-col bg-white w-[800px] p-3 px-5 rounded-xl shadow-3xl">
        <div className="flex border-b justify-between items-center border-[#e1e1e1] pb-1 w-full font-bold">
           <div className="flex"> Create A New Subdomain</div>
           {
            isCreating ?            
            <div className="cursor-wait flex text-center h-4 w-4 bg-gray-300 text-white rounded-full"></div>
            :
           <div onClick={()=>toggleModal()} className="cursor-pointer flex text-center h-4 w-4 bg-red-500 text-white rounded-full"></div>
           }
        </div>
      {
        isCreating ? <><div className="flex items-center justify-center space-x-2 mt-10">
        Creating subdomain: 
       <p className="font-bold ml-1">{prefix}.dynamicsoft.tech</p>
       </div>
  <div className="flex flex-row items-center justify-center">
  <div className="flex flex-col space-y-3 items-start justify-center my-10">
    <p className={`text-sm ${isCreatingNGINXConfig ? 'text-[#000000]' : 'text-gray-400'} ${NGINXConfigCreated ? 'text-[#4CAA98]' : 'text-gray-400'} ${NGINXConfigFailed ? 'text-[#ff0000]' : 'text-gray-400'}`}> 
    {!isCreatingNGINXConfig && !NGINXConfigCreated && !NGINXConfigFailed && <span className='text-lg align-middle mr-1.5'>&#8226;</span>}
    {isCreatingNGINXConfig && <span className='loading'></span>}
    {NGINXConfigCreated && <span className='text-[#4CAA98] text-lg align-middle mr-1.5'>&#10003;</span>} 
    {NGINXConfigFailed && <span className='text-[#ff0000] text-lg align-middle mr-1.5'>&times;</span>} 
    Create NGINX config</p>
    <p className={`text-sm ${isCreatingDatabase ? 'text-[#000000]' : 'text-gray-400'} ${DatabaseCreated ? 'text-[#4CAA98]' : 'text-gray-400'} ${DatabaseFailed ? 'text-[#ff0000]' : 'text-gray-400'}`}> 
    {!isCreatingDatabase && !DatabaseCreated && !DatabaseFailed && <span className='text-lg align-middle mr-1.5'>&#8226;</span>}
    {isCreatingDatabase && <span className='loading'></span>}
    {DatabaseCreated && <span className='text-[#4CAA98] text-lg align-middle mr-1.5'>&#10003;</span>} 
    {DatabaseFailed && <span className='text-[#ff0000] text-lg align-middle mr-1.5'>&times;</span>}  Create database</p>
    <p className={`text-sm ${isCreatingCrontab ? 'text-[#000000]' : 'text-gray-400'} ${CrontabCreated ? 'text-[#4CAA98]' : 'text-gray-400'} ${CrontabFailed ? 'text-[#ff0000]' : 'text-gray-400'}`}> 
    {!isCreatingCrontab && !CrontabCreated && !CrontabFailed && <span className='text-lg align-middle mr-1.5'>&#8226;</span>}
    {isCreatingCrontab && <span className='loading'></span>}
    {CrontabCreated && <span className='text-[#4CAA98] text-lg align-middle mr-1.5'>&#10003;</span>} 
    {CrontabFailed && <span className='text-[#ff0000] text-lg align-middle mr-1.5'>&times;</span>} Create crontab entry</p>
    <p className={`text-sm ${isInstallingApplication ? 'text-[#000000]' : 'text-gray-400'} ${ApplicationInstalled ? 'text-[#4CAA98]' : 'text-gray-400'} ${ApplicationInstallationFailed ? 'text-[#ff0000]' : 'text-gray-400'}`}> 
    {!isInstallingApplication && !ApplicationInstalled && !ApplicationInstallationFailed && <span className='text-lg align-middle mr-1.5'>&#8226;</span>}
    {isInstallingApplication && <span className='loading'></span>}
    {ApplicationInstalled && <span className='text-[#4CAA98] text-lg align-middle mr-1.5'>&#10003;</span>} 
    {ApplicationInstallationFailed && <span className='text-[#ff0000] text-lg align-middle mr-1.5'>&times;</span>} Install application</p>
    <p className={`text-sm ${isSettingUpApplication ? 'text-[#000000]' : 'text-gray-400'} ${ApplicationSetupDone ? 'text-[#4CAA98]' : 'text-gray-400'} ${ApplicationSetupFailed ? 'text-[#ff0000]' : 'text-gray-400'}`}> 
    {!isSettingUpApplication && !ApplicationSetupDone && !ApplicationSetupFailed && <span className='text-lg align-middle mr-1.5'>&#8226;</span>}
    {isSettingUpApplication && <span className='loading'></span>}
    {ApplicationSetupDone && <span className='text-[#4CAA98] text-lg align-middle mr-1.5'>&#10003;</span>} 
    {ApplicationSetupFailed && <span className='text-[#ff0000] text-lg align-middle mr-1.5'>&times;</span>} Setup application</p>
    <p className={`text-sm ${isSettingUpSSL ? 'text-[#000000]' : 'text-gray-400'} ${SSLSetupDone ? 'text-[#4CAA98]' : 'text-gray-400'} ${SSLSetupFailed ? 'text-[#ff0000]' : 'text-gray-400'}`}> 
    {!isSettingUpSSL && !SSLSetupDone && !SSLSetupFailed && <span className='text-lg align-middle mr-1.5'>&#8226;</span>}
    {isSettingUpSSL && <span className='loading'></span>}
    {SSLSetupDone && <span className='text-[#4CAA98] text-lg align-middle mr-1.5'>&#10003;</span>} 
    {SSLSetupFailed && <span className='text-[#ff0000] text-lg align-middle mr-1.5'>&times;</span>} Setup SSL</p>
  </div>
  </div></> : <><div className="flex items-center justify-center space-x-2 mt-10">
        <input type="text" autoFocus
        onChange={e => setPrefix(() => e.target.value)} 
          className="flex text-right w-48 border-b-2 focus:border-b-2 border-slate-500/10 focus:border-[#0070f3]  outline-none px-3 py-1 transition duration-100 ease-in-out"
          placeholder='subdomain prefix'        
        />
        <p className="font-bold">.dynamicsoft.tech</p>
        </div>
        <div className="flex items-center justify-center mt-10">
          {!prefix ?           
      <button className="cursor-not-allowed mb-5 flex items-center space-x-2 px-5 py-2 rounded-lg bg-[#0070f3] border border-[#0070f3] drop-shadow-[0_2px_4px_rgba(0,118,255,0.40)] opacity-20">
           <span className={`flex ${inter.className} font-medium mt-0.5 text-white text-sm`}> Create Subdomain</span>
      </button> 
      :
      <button onClick={()=>createSubdomain()} className="mb-5 flex items-center space-x-2 px-5 py-2 rounded-lg bg-[#0070f3] hover:drop-shadow-[0_4px_14px_rgba(0,118,255,0.40)] transition duration-300 ease-in-out border border-[#0070f3] drop-shadow-[0_4px_8px_rgba(0,118,255,0.40)]">
           <span className={`flex ${inter.className} font-medium mt-0.5 text-white text-sm`}> Create Subdomain</span>
      </button> 
        }
        </div>
        </>
      }
        </div>
     </div>
    </div>
    </> );
}
 
export default AddSubdomainModal;