"use client"
import { useEffect, useState } from "react"
import { FormEvent } from 'react';
import Link from "next/link";

interface docObject {
  _id: string,
  address: string
}

export default function Home() {


  const [ca, setCa] = useState<docObject[]>([])
  const[loading, setLoading] = useState(true)
  const [loadingText, setLoadingText] = useState<string>("Loading")
  const [input, setInput] = useState<string>("")

  useEffect(() => {
    async function get() {
      const interval = setInterval(() => {
        let count = 0
        if (count > 3) {
          setLoadingText("Loading")
          count = 0
        } else {
          setLoadingText((prev) => prev + ".")
          count++
        }
      }, 500)
      try {
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
      } catch (error) {
        console.error(error)
      } finally {
        clearInterval(interval)
      }
    }
    get()
  }, [])

  async function sendToApi(e:FormEvent<HTMLFormElement>, contractAddress: string) {
    e.preventDefault()
    const randoTemp = Math.floor(Math.random() * 20)
    async function store() {
      const response = await fetch("/api/fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(contractAddress)
      })
      const body = await response.json()
      console.log(body)
    }
    try {
      console.log(contractAddress)
      setCa((prev: docObject[]) => [...prev, {_id: randoTemp.toString(), address: contractAddress}])
      setInput("")
      await store()
      const response = await fetch("https://alphaboxbackend-production.up.railway.app/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify( contractAddress )
      })
      const body = await response.json()
      console.log("Success", body)
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
      <div className="flex justify-center items-center rounded-md p-6 mt-20 border-[1px] border-zinc-300 w-[65%] md:w-[500px] h-[30%]">
        <form className="flex flex-col justify-center gap-2 w-full" onSubmit={(e) => sendToApi(e, input)}>
          <h1 className="text-sm text-zinc-400">Enter a wallet address you want to track</h1>
          <input className="rounded-md p-2" placeholder="Contract address" onChange={(e) => setInput(e.target.value)}></input>
          <button className="p-2 bg-blue-400 rounded-md border-[1px] border-blue-500 transition ease-in-out delay-150 hover:border-blue-800">Submit</button>
        </form>
      </div>
      <div className="flex flex-col gap-4 w-[65%] md:w-[500px] h-[35%]">
        <h1 className="text-left text-sm text-zinc-400">Wallets being tracked</h1>
        <div className="flex flex-col gap-2 rounded-md border-[1px] border-zinc-300 bg-zinc-200 w-full h-full p-2 overflow-scroll" key="test">
        <div className={`${loading ? "mx-auto my-auto" : "hidden"}`}>{loadingText}</div>
        {
          ca?.map((e:docObject) => 
            <Link href={`https://solscan.io/account/${e.address}`} target="_blank" className="w-full p-2 rounded-md border-[0px] border-zinc-500 bg-zinc-200 text-center transition ease-in-out delay-150 hover:bg-zinc-300 break-all" key={e._id}>{e.address}</Link>
          )
        }
        </div>
      </div>
      <h1 className="text-xs w-[250px] md:w-[450px] text-center">Disclaimer: Only submit wallets that have made multiple profitable returns and no trolling, We&apos;re all trying to make money here.</h1>
    </main>
  );
}
