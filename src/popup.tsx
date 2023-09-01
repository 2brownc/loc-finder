import { CountButton } from "~features/count-button"

import "~style.css"



function IndexPopup() {
  // api
  // ipify
  const IPIFY_API_URL: string = 'https://api.ipify.org?format=json'
  
  // state
  const [errorMsg, setErrorMsg] = useState<string | any>(null)
  const [IP, setIP] = useState<string | null>(null)
  

  // get IP address
  const getIP = async () => {
    const response = await fetch(IPIFY_API_URL, {method: 'GET'})

    if(response.ok){
      const { ip } = await response.json()
      setIP(ip)
    } else {
      const errorMessage = `Failed to get IP: ${response.status}`
      setErrorMsg(errorMessage)
    }
  }  
  
  return (
    <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-h-16 plasmo-w-40">
      <CountButton />
    </div>
  )
}

export default IndexPopup
