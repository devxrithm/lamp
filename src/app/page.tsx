"use client"

import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useEffect, useRef, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import team from "../team.json"

export default function QRScanner() {

  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  const [result, setResult] = useState("")
  const [scanning, setScanning] = useState(false)

  const startScanner = () => {
    if (scannerRef.current) return

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250
      },
      false
    )

    scanner.render(
      (decodedText) => {

        setResult(decodedText)

        scanner.clear()
        scannerRef.current = null
        setScanning(false)

      },
      (error) => {
        console.warn(error)
      }
    )

    scannerRef.current = scanner
    setScanning(true)
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.clear()
      scannerRef.current = null
      setScanning(false)
    }
  }

  // ✅ Reset for new scan
  const scanNewUser = () => {
    setResult("")
    startScanner()
  }

  useEffect(() => {

    if (!result) return

    const verifiedUser = team.participants.find(
      (data: any) => data.name.toUpperCase() === result.toUpperCase()
    )

    if (verifiedUser) {
      toast.success("USER SUCCESSFULLY VERIFIED")
    } else {
      toast.error("USER NOT VERIFIED")
    }

  }, [result])

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
      }
    }
  }, [])

  return (
    <div className="flex font-sans w-full justify-center items-center flex-col bg-green-100 min-h-screen">

      <Toaster />

      <h1 className="text-3xl font-bold text-center mt-10">
        SCAN THE QR CODE AND VERIFY THE PARTICIPANT
      </h1>

      <Card className="w-full max-w-xl mx-auto mt-10 bg-black">
        <CardContent className="space-y-4 p-6">

          <h2 className="text-xl font-semibold text-center text-gray-100">
            QR Code Scanner
          </h2>

          <div
            id="qr-reader"
            className="w-full border border-green-500 p-10 rounded-lg overflow-hidden"
          />

          <div className="flex gap-4 justify-center">

            {!scanning && !result && (
              <Button onClick={startScanner}>
                Start Scan
              </Button>
            )}

            {scanning && (
              <Button variant="destructive" onClick={stopScanner}>
                Stop Scan
              </Button>
            )}

            {result && (
              <Button onClick={scanNewUser} className="bg-green-500">
                Scan New User
              </Button>
            )}

          </div>

          {result && (
            <div className="p-3 bg-green-100 rounded text-center">
              <p className="text-sm font-medium">
                Scanned Result:
              </p>
              <p className="text-green-700 break-all">
                {result}
              </p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}