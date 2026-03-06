"use client"

import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import team from "../../team.json"

export default function QRScanner() {
  const scannerRef = useRef<Html5Qrcode | null>(null)

  const [result, setResult] = useState("")
  const [scanning, setScanning] = useState(false)
  const [permissionError, setPermissionError] = useState("")

  const startScanner = async () => {
    setPermissionError("")
    try {
      await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    } catch (err: any) {
      setPermissionError(
        err.name === "NotAllowedError"
          ? "Camera permission denied. Please allow access in browser settings."
          : "Camera unavailable: " + err.message
      )
      return
    }

    try {
      const html5QrCode = new Html5Qrcode("qr-reader")
      scannerRef.current = html5QrCode

      // ✅ Responsive qrbox — 70% of screen width, max 300px
      const qrboxSize = Math.min(Math.floor(window.innerWidth * 0.7), 300)

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: qrboxSize, height: qrboxSize } },
        (decodedText) => {
          setResult(decodedText)
          stopScanner()
        },
        (error) => console.warn(error)
      )

      setScanning(true)
    } catch (err: any) {
      setPermissionError("Failed to start scanner: " + err.message)
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current.clear()
      } catch (e) {
        console.warn(e)
      }
      scannerRef.current = null
    }
    setScanning(false)
  }

  const scanNewUser = async () => {
    setResult("")
    await startScanner()
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
        scannerRef.current.stop().catch(() => {}).then(() => scannerRef.current?.clear())
      }
    }
  }, [])

  return (
    <div className="flex font-sans w-full justify-center items-center flex-col bg-green-100 min-h-screen px-4 py-8 gap-3">

      <Toaster />

      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center leading-tight">
        MIND INSTALLERS HACKATHON 4.0
      </h1>

      <p className="text-sm sm:text-base lg:text-xl font-bold text-center">
        SCAN THE QR CODE AND VERIFY THE PARTICIPANT
      </p>

      <Card className="w-full max-w-sm sm:max-w-md lg:max-w-xl bg-black">
        <CardContent className="space-y-4 p-4 sm:p-6">

          <h2 className="text-base sm:text-xl font-semibold text-center text-gray-100">
            QR Code Scanner
          </h2>

          <div
            id="qr-reader"
            className="w-full border border-green-500 rounded-lg overflow-hidden"
          />

          {!scanning && !result && (
            <div className="w-full h-12 sm:h-16 flex items-center justify-center text-gray-400 text-xs sm:text-sm">
              Press "Start Scan" to activate camera
            </div>
          )}

          {permissionError && (
            <div className="p-3 bg-red-100 rounded text-center">
              <p className="text-red-700 text-xs sm:text-sm">{permissionError}</p>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            {!scanning && !result && (
              <Button className="text-sm sm:text-base px-4 sm:px-6" onClick={startScanner}>
                Start Scan
              </Button>
            )}
            {scanning && (
              <Button variant="destructive" className="text-sm sm:text-base px-4 sm:px-6" onClick={stopScanner}>
                Stop Scan
              </Button>
            )}
            {result && (
              <Button onClick={scanNewUser} className="bg-green-500 text-sm sm:text-base px-4 sm:px-6">
                Scan New User
              </Button>
            )}
          </div>

          {result && (
            <div className="p-3 bg-green-100 rounded text-center">
              <p className="text-xs sm:text-sm font-medium">Scanned Result:</p>
              <p className="text-green-700 break-all text-sm sm:text-base">{result}</p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}