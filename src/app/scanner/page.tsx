"use client"

import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import teamsData from "../../team.json"

// ── JWT decode (no verify, browser-safe) ─────────────────────────────────────
function decodeJWT(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split(".")[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface TeamPayload {
  "Team Name": string
  "Team Leader Name": string
  "Team Lead Email ID": string
  "Team Lead Contact No.": string | number
  "Team Member 2 Name": string
  "Team Member 3 Name": string
  "Team Member 4 Name": string
  "College Name": string
}

export default function QRScanner() {
  const scannerRef = useRef<Html5Qrcode | null>(null)

  const [rawResult, setRawResult] = useState("")
  const [scanning, setScanning] = useState(false)
  const [permissionError, setPermissionError] = useState("")
  const [teamInfo, setTeamInfo] = useState<TeamPayload | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<"verified" | "invalid" | null>(null)

  // ── Scanner controls ────────────────────────────────────────────────────────
  const startScanner = async () => {
    setPermissionError("")
    setTeamInfo(null)
    setVerificationStatus(null)

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
      const qrboxSize = Math.min(Math.floor(window.innerWidth * 0.7), 300)

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: qrboxSize, height: qrboxSize } },
        (decodedText) => {
          setRawResult(decodedText)
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
    setRawResult("")
    setTeamInfo(null)
    setVerificationStatus(null)
    await startScanner()
  }

  // ── Verify on scan ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!rawResult) return

    const payload = decodeJWT(rawResult)

    if (!payload) {
      toast.error("Invalid QR — could not decode token")
      setVerificationStatus("invalid")
      return
    }

    const scannedName  = (payload["Team Name"] ?? "").toString().trim().toUpperCase()
    const scannedEmail = (payload["Team Lead Email ID"] ?? "").toString().trim().toUpperCase()

    const match = (teamsData as any[]).find(
      (t) =>
        t["Team Name"].trim().toUpperCase() === scannedName &&
        t["Team Lead Email ID"].trim().toUpperCase() === scannedEmail
    )

    if (match) {
      setTeamInfo(payload as TeamPayload)
      setVerificationStatus("verified")
      toast.success("Team successfully verified!")
    } else {
      setTeamInfo(payload as TeamPayload)
      setVerificationStatus("invalid")
      toast.error("QR code not recognised in records")
    }
  }, [rawResult])

  // ── Cleanup on unmount ──────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {}).then(() => scannerRef.current?.clear())
      }
    }
  }, [])

  // ── Helper ──────────────────────────────────────────────────────────────────
  const members = teamInfo
    ? [
        teamInfo["Team Member 2 Name"],
        teamInfo["Team Member 3 Name"],
        teamInfo["Team Member 4 Name"],
      ].filter((m) => m && m.trim() !== "" && m.trim() !== "-")
    : []

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="text-white flex font-sans w-full justify-center items-center flex-col min-h-screen px-4 py-8 gap-4">
      <Toaster />

      <h1 className="border border-green-500 px-10 py-2 text-2xl sm:text-4xl lg:text-5xl font-bold text-center rounded-full leading-tight">
        MIND INSTALLERS HACKATHON <span className="text-red-500">4.0</span>
      </h1>

      <p className="text-sm sm:text-base lg:text-xl font-bold text-center">
        SCAN THE QR CODE AND VERIFY THE PARTICIPANT
      </p>

      <Card className="w-full max-w-sm sm:max-w-md lg:max-w-xl bg-black border border-gray-800">
        <CardContent className="space-y-4 p-4 sm:p-6">

          <h2 className="text-base sm:text-xl font-semibold text-center text-gray-100">
            QR Code Scanner
          </h2>

          {/* Camera viewport */}
          <div id="qr-reader" className="w-full border border-green-500 rounded-lg overflow-hidden" />

          {!scanning && !rawResult && (
            <div className="w-full h-12 sm:h-16 flex items-center justify-center text-gray-400 text-xs sm:text-sm">
              Press "Start Scan" to activate camera
            </div>
          )}

          {permissionError && (
            <div className="p-3 bg-red-950 border border-red-700 rounded text-center">
              <p className="text-red-400 text-xs sm:text-sm">{permissionError}</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3 justify-center">
            {!scanning && !rawResult && (
              <Button onClick={startScanner}>Start Scan</Button>
            )}
            {scanning && (
              <Button variant="destructive" onClick={stopScanner}>Stop Scan</Button>
            )}
            {rawResult && (
              <Button onClick={scanNewUser} className="bg-green-600 hover:bg-green-700">
                Scan New User
              </Button>
            )}
          </div>

          {/* Result card */}
          {rawResult && teamInfo && (
            <div
              className={`rounded-lg border p-4 space-y-3 ${
                verificationStatus === "verified"
                  ? "bg-green-950 border-green-600"
                  : "bg-red-950 border-red-600"
              }`}
            >
              {/* Status badge */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    verificationStatus === "verified" ? "bg-green-400" : "bg-red-400"
                  }`}
                />
                <span
                  className={`text-sm font-bold tracking-widest ${
                    verificationStatus === "verified" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {verificationStatus === "verified" ? "VERIFIED" : "NOT VERIFIED"}
                </span>
              </div>

              {/* Team details grid */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-black/40 rounded-md p-3">
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Team Name</p>
                  <p className="text-gray-100 font-medium">{teamInfo["Team Name"]}</p>
                </div>

                <div className="bg-black/40 rounded-md p-3">
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">College</p>
                  <p className="text-gray-100 font-medium text-xs leading-tight">{teamInfo["College Name"] || "—"}</p>
                </div>

                <div className="bg-black/40 rounded-md p-3 col-span-2">
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Team Leader</p>
                  <p className="text-gray-100 font-medium">{teamInfo["Team Leader Name"]}</p>
                  <p className="text-green-400 text-xs mt-0.5">{teamInfo["Team Lead Email ID"]}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{teamInfo["Team Lead Contact No."]}</p>
                </div>

                {members.length > 0 && (
                  <div className="bg-black/40 rounded-md p-3 col-span-2">
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Members</p>
                    <div className="flex flex-wrap gap-2">
                      {members.map((m, i) => (
                        <span
                          key={i}
                          className="bg-green-900/50 text-green-300 text-xs rounded px-2 py-1"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fallback: QR decoded but JWT was malformed */}
          {rawResult && !teamInfo && verificationStatus === "invalid" && (
            <div className="p-3 bg-red-950 border border-red-700 rounded text-center">
              <p className="text-red-400 text-sm font-semibold">Invalid QR Code</p>
              <p className="text-red-500 text-xs mt-1 break-all">{rawResult}</p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}