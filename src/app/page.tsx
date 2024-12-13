"use client"
import Image from "next/image";
import { useEffect, useState } from "react"
import { FormEvent } from 'react';

const apiEndpoint = "http://localhost:3000"

interface docObject {
  _id: string,
  address: string
}

export default function Home() {


  const [ca, setCa] = useState<docObject[]>([])
  const[loading, setLoading] = useState(true)
  const [input, setInput] = useState<string>("")
  const [session, setSession] = useState<string[]>([])

  useEffect(() => {
    async function get() {
      const response = await fetch("/api/fetch", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const body = await response.json()
      console.log(body)
      setLoading(false)
      setCa(body)
    }
    get()
  }, [])

  async function sendToApi(e:FormEvent<HTMLFormElement>, contractAddress: string) {
    e.preventDefault()
    const randoTemp = Math.floor(Math.random() * 20)
    try {
      console.log(contractAddress)
      const response = await fetch("https://alphaboxbackend-production.up.railway.app/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify( contractAddress )
      })
      const body = await response.json()
      console.log("Success", body)
      setCa((prev: docObject[]) => [...prev, {_id: randoTemp.toString(), address: contractAddress}])
      setInput("")
      //setCa((prev) => [...prev, body])
    } catch (error) {
      console.error("Error: ", error)
    }
  }

  return (
    <main className="w-full h-screen bg-zinc-100 flex flex-col text-black items-center justify-center gap-20">
      <header className="absolute w-full h-[6%] top-0">
        <h1 className="m-4 font-semibold">The Alpha Box</h1>
      </header>
      <div className="flex justify-center items-center rounded-md p-6 bg-zinc-200 border-[1px] border-zinc-500 w-[65%] md:w-[700px] h-[30%]">
        <form className="flex flex-col justify-center gap-2 w-full" onSubmit={(e) => sendToApi(e, input)}>
          <h1>Enter a wallet address you want to track:</h1>
          <input className="rounded-md p-2" placeholder="Contract address" onChange={(e) => setInput(e.target.value)}></input>
          <button className="p-2 bg-blue-400 rounded-md border-[1px] border-blue-500 transition ease-in-out delay-150 hover:border-blue-800">Submit</button>
        </form>
      </div>
      <div className="flex flex-col gap-4 w-[65%] md:w-[700px] h-[35%] overflow-scroll">
        <h1 className="text-left text-md px-2">Wallets being tracked</h1>
        <div className="flex flex-col gap-2 rounded-md border-[1px] border-zinc-500 w-full h-full p-2" key="test">
        <div className={`${loading ? "mx-auto my-auto" : "hidden"}`}>Loading...</div>
        {
          ca?.map((e:docObject) => 
            <div className="w-full p-2 rounded-md border-[0px] border-zinc-500 bg-zinc-200 text-center transition ease-in-out delay-150 hover:bg-zinc-300 break-all" key={e._id}>{e.address}</div>
          )
        }
        </div>
      </div>
      <h1 className="text-xs">Disclaimer: Only submit wallets that have made multiple profitable returns and no trolling, we're all trying to make money here.</h1>
    </main>
  );
}
