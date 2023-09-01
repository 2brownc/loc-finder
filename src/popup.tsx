import "~style.css"

import React, { useState, useEffect } from 'react';

interface IDisplayLocInfo {
  city: string,
  country: string,
}

function DisplayLocInfo({
  city,
  country,
}: IDisplayLocInfo) {
  /*
   display nothing if
   either of city or country
   are not set
  */
  if(city === null || country === null) return <></>
  if(city === "" || country === "") return <></>

  return (
    <div className="plasmo-text-2xl">
      <span>Your country is </span>
      <span className="plasmo-text-green-700">{country}</span>
      <span> and your city is </span>
      <span className="plasmo-text-green-700">{city}</span>.
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

  /*
    if loadLocInfo is true
    IP, city and country info
    will be loaded
  */
  const [loadLocInfo, setLoadLocInfo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // get IP address
  const getIP = async () => {
    const response = await fetch(IPIFY_API_URL, {method: 'GET'})

    if(response.ok){
      const { ip } = await response.json()
      setIP(ip)
    } else {
      const errorMessage = `Failed to get IP address: ${response.status}`
      setErrorMsg(errorMessage)
    }
  }  

  // get location
  const getLoc = async () => {
    const response = await fetch(IPDATA_API_URL(IP), { method: 'GET'})

    if(response.ok){
      const {country_name, city, emoji_flag} = await response.json()
      setCountry(country_name)
      setCity(city)
      setFlag(emoji_flag)
    } else {
      const errorMessage = `Failed to get IP location: ${response.status}`
      setErrorMsg(errorMessage)
    } 
  }

  useEffect(() => {
    if(loadLocInfo) {
      /*
        reset any previous results
      */
      setIP(null)
      setCity(null)
      setCountry(null)

      setLoading(true)
      getIP()
    }
  }, [loadLocInfo])

  /*
    once the IP is retrived
    city and country information
    will be retrived
  */
  useEffect(() => {      
    if(IP !== null){
      setLoading(true)
      getLoc()
    }
  }, [IP])

  /*
    update "loading status" 
  */
  useEffect(() => {
    const IPSet = IP !== null
    const CountrySet = country !== null
    const CitySet = city !== null
    if(
        IPSet &&
        CountrySet &&
        CitySet
      ){
        /*
          all the information is loaded
          the state is no longer "loading"
        */
      setLoading(false)
      setLoadLocInfo(false)
    }
  }, [IP, country, city])
  
  return (
    <div className="
		  plasmo-h-[500px] plasmo-w-[500px]
      plasmo-grid plasmo-grid-cols-1 plasmo-place-content-center
      plasmo-gap-4
      plasmo-bg-gradient-to-l plasmo-from-red plasmo-to-blue
    ">
    <div className="
      plasmo-absolute
      plasmo-top-8
      plasmo-text-center
    ">
      <DisplayLocInfo
        city={city}
        country={country}
      />
    </div>
		<button
      onClick={() => setLoadLocInfo(true)}
      className="
        plasmo-place-self-center
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
			{loading && <span>Loading...</span> || <span>Show My Location</span>}
		</button>

    {/* show any errors */}
    <div className="
      plasmo-absolute
      plasmo-bottom-8
      plasmo-text-center
      plasmo-p-4
    ">
		{errorMsg && <span>ERROR: {`${errorMsg}`}</span>}
    </div>

    </div>
  )
}

export default IndexPopup
