import "~style.css"

import React, { useState } from 'react';

interface IDisplayLocInfo {
  city: string,
  country: string,
  flag: string
}

function DisplayLocInfo({
  city,
  country,
  flag,
}: IDisplayLocInfo) {
  /*
   display nothing if
   either of city or country
   are not set
  */
  if(city === null || country === null) return <></>
  if(city === "" || country === "") return <></>

  let flagEmoji = "";

  if (flag !== "" && flag !== null) {
    flagEmoji = `${flag} `;
  }

  return (
    <div className="">
      Your country is ${flagEmoji}${country} and your city is ${city}.
    </div>
  )
}

function IndexPopup() {
  // api
  // ipify
  const IPIFY_API_URL: string = 'https://api.ipify.org?format=json'
  
  //ipdata
  const IPDATA_ACCESS_TOKEN = process.env.PLASMO_PUBLIC_IPDATA_ACCESS_TOKEN
  const IPDATA_API_URL: (arg0: string) => string = (ip) => `https://api.ipdata.co/${ip}?api-key=${IPDATA_ACCESS_TOKEN}`
  
  // state
  const [errorMsg, setErrorMsg] = useState<string | any>(null)
  const [IP, setIP] = useState<string | null>(null)
  const [country, setCountry] = useState<string | null>(null)
  const [city, setCity] = useState<string | null>(null)
  const [flag, setFlag] = useState<string | null>(null)

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
    const response = await fetch(IPDATA_API_URL(IP), { method: 'GET'})

    if(response.ok){
      const {country_name, t_city, emoji_flag} = await response.json()
      setCountry(country_name)
      setCity(t_city)
      setFlag(emoji_flag)
    } else {
      const errorMessage = `Failed to get IP location: ${response.status}`
      setErrorMsg(errorMessage)
    } 
  }
  
  return (
    <div className="
		plasmo-flex plasmo-items-center plasmo-justify-center
		plasmo-h-[500px] plasmo-w-[500px]
    ">
		<DisplayLocInfo
			city={city}
			country={country}
      flag={flag}
		/>
		<button className="
      plasmo-w-60 plasmo-h-20
			plasmo-border-solid plasmo-border-2 plasmo-border-indigo-600
      plasmo-bg-indigo-600
      plasmo-duration-500 plasmo-ease-out
      hover:plasmo-border-blue-600
      hover:plasmo-bg-blue-600
      hover:plasmo-shadow-lg hover:plasmo-shadow-blue-500/50 
      plasmo-p-5
      plasmo-rounded-md
      plasmo-text-xl plasmo-text-white
		">
			Show My Location
		</button>
		{errorMsg && <div>ERROR: {`${errorMsg}`}</div>}
    </div>
  )
}

export default IndexPopup
