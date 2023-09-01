import "~style.css"

import React, { useState } from 'react';

interface IDisplayLocInfo {
  city: string,
  country: string
}

function DisplayLocInfo({city, country}: IDisplayLocInfo) {
  /*
   display nothing if
   either of city or country
   are not set
  */
  if(city === null || country === null) return <></>
  if(city === "" || country === "") return <></>

  return (
    <div className="">
      Your country is ${country} and your city is ${city}.
    </div>
  )
}

function IndexPopup() {
  // api
  // ipify
  const IPIFY_API_URL: string = 'https://api.ipify.org?format=json'
  
  //ipinfo
  const IPINFO_API_URL: (arg0: string) => string = (ip) => 'https://ipinfo.io/${ip}'
  const IPINFO_ACCESS_TOKEN = process.env.PLASMO_PUBLIC_IPINFO_ACCESS_TOKEN
  
  // state
  const [errorMsg, setErrorMsg] = useState<string | any>(null)
  const [IP, setIP] = useState<string | null>(null)
  const [country, setCountry] = useState<string | null>(null)
  const [city, setCity] = useState<string | null>(null)  

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

  // get location
  const getLoc = async () => {
    const headers = {
      Authorization: `Bearer ${IPINFO_ACCESS_TOKEN}`,
    }

    const response = await fetch(IPINFO_API_URL(IP), { headers })

    if(response.ok){
      const {t_country, t_city} = await response.json()
      setCountry(t_country)
      setCity(t_city)
    } else {
      const errorMessage = `Failed to get IP location: ${response.status}`
      setErrorMsg(errorMessage)
    } 
  }
  
  return (
    <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-h-[500px] plasmo-w-[500px]">
		<DisplayLocInfo
			city={city}
			country={country}
		/>
		<button>
			Show My Location0
		</button>
    </div>
  )
}

export default IndexPopup
