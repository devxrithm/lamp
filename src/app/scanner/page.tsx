"use client"

import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import * as jose from "jose"
import registeredTeams from "../../team.json"  // your csvjson.json renamed/copied here

const JWT_SECRET = "your_secret_key_change_me"

interface TeamData {
  "Team Name": string
  "Team Leader Name": string
  "Team Lead Email ID": string
  "Team Lead Contact No.": string | number
  "Team Member 2 Name": string
  "Team Member 3 Name": string
  "Team Member 4 Name": string
  "College Name": string
}

type ScanState = "idle" | "scanning" | "verified" | "failed"

// Normalise strings for comparison — trim + lowercase
const norm = (s: unknown) => String(s ?? "").trim().toLowerCase()

function findTeamInRegistry(decoded: TeamData): TeamData | null {
  // Cast the imported JSON — it's a plain array
  const list = registeredTeams as TeamData[]

  return (
    list.find(
      (t) =>
        norm(t["Team Name"]) === norm(decoded["Team Name"]) &&
        norm(t["Team Lead Email ID"]) === norm(decoded["Team Lead Email ID"])
    ) ?? null
  )
}

export default function QRScanner() {
  const scannerRef = useRef<Html5Qrcode | null>(null)

  const [scanState, setScanState] = useState<ScanState>("idle")
  const [teamData, setTeamData] = useState<TeamData | null>(null)
  const [failReason, setFailReason] = useState("")
  const [permissionError, setPermissionError] = useState("")

  const verifyJWT = async (token: string) => {
    // Step 1 — verify JWT signature
    let decoded: TeamData
    try {
      const secret = new TextEncoder().encode(JWT_SECRET)
      const { payload } = await jose.jwtVerify(token, secret)
      decoded = (payload as { data: TeamData }).data
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      setFailReason(
        msg.includes("expired") ? "Token expired" : "Invalid QR — JWT signature mismatch"
      )
      setScanState("failed")
      toast.error("Verification failed")
      return
    }

    // Step 2 — cross-check against your registered JSON list
    const registered = findTeamInRegistry(decoded)
    if (!registered) {
      setFailReason(
        `Team "${decoded["Team Name"]}" not found in the registered participants list`
      )
      setScanState("failed")
      toast.error("Team not registered")
      return
    }

    // Both checks passed — use the registry record as source of truth
    setTeamData(registered)
    setScanState("verified")
    toast.success("Participant verified!")
  }

  const startScanner = async () => {
    setPermissionError("")
    setScanState("idle")
    setTeamData(null)
    setFailReason("")

    try {
      await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    } catch (err: unknown) {
      const e = err as { name?: string; message?: string }
      setPermissionError(
        e.name === "NotAllowedError"
          ? "Camera permission denied. Please allow access in browser settings."
          : "Camera unavailable: " + e.message
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
        async (decodedText) => {
          await stopScanner()
          await verifyJWT(decodedText)
        },
        (error) => console.warn(error)
      )
      setScanState("scanning")
    } catch (err: unknown) {
      const e = err as { message?: string }
      setPermissionError("Failed to start scanner: " + e.message)
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
    setScanState("idle")
  }

  useEffect(() => {
    return () => {
      scannerRef.current
        ?.stop()
        .catch(() => {})
        .then(() => scannerRef.current?.clear())
    }
  }, [])

  const members = teamData
    ? [
        teamData["Team Leader Name"],
        teamData["Team Member 2 Name"],
        teamData["Team Member 3 Name"],
        teamData["Team Member 4 Name"],
      ].filter(Boolean)
    : []

  return (
    <div className="text-white flex font-sans w-full justify-center items-center flex-col min-h-screen px-4 py-8 gap-4">
      <Toaster />

      <h1 className="border border-green-500 px-10 py-2 text-2xl sm:text-4xl font-bold text-center rounded-full">
        MIND INSTALLERS HACKATHON <span className="text-red-500">4.0</span>
      </h1>

      <p className="text-sm sm:text-base font-bold text-center text-gray-300">
        SCAN THE QR CODE AND VERIFY THE PARTICIPANT
      </p>

      <Card className="w-full max-w-sm sm:max-w-md bg-black border-gray-800">
        <CardContent className="space-y-4 p-4 sm:p-6">

          <h2 className="text-base sm:text-xl font-semibold text-center text-gray-100">
            QR Code Scanner
          </h2>

          <div
            id="qr-reader"
            className="w-full border border-green-500 rounded-lg overflow-hidden"
          />

          {scanState === "idle" && (
            <div className="w-full h-12 flex items-center justify-center text-gray-400 text-xs sm:text-sm">
              Press Start Scan to activate camera
            </div>
          )}

          {permissionError && (
            <div className="p-3 bg-red-950 border border-red-800 rounded text-center">
              <p className="text-red-400 text-xs sm:text-sm">{permissionError}</p>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            {scanState !== "scanning" && (
              <Button className="bg-green-600 hover:bg-green-500 text-sm px-5" onClick={startScanner}>
                {scanState === "idle" ? "Start Scan" : "Scan Again"}
              </Button>
            )}
            {scanState === "scanning" && (
              <Button variant="destructive" className="text-sm px-5" onClick={stopScanner}>
                Stop Scan
              </Button>
            )}
          </div>

          {/* ── VERIFIED ── */}
          {scanState === "verified" && teamData && (
            <div className="rounded-xl border border-green-800 bg-green-950/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-green-700 text-green-100 text-xs px-3 py-1 rounded-full">
                  ✓ Verified
                </Badge>
                <span className="text-green-400 text-xs">JWT + Registry match</span>
              </div>

              <div>
                <p className="text-lg font-bold text-green-50">{teamData["Team Name"]}</p>
                <p className="text-xs text-green-400 mt-0.5">
                  {teamData["College Name"] || "College not specified"}
                </p>
              </div>

              <hr className="border-green-900" />

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400 shrink-0">Leader</span>
                  <span className="text-green-100 text-right">{teamData["Team Leader Name"]}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400 shrink-0">Email</span>
                  <span className="text-green-100 text-right break-all">{teamData["Team Lead Email ID"]}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400 shrink-0">Contact</span>
                  <span className="text-green-100 text-right">{teamData["Team Lead Contact No."]}</span>
                </div>
              </div>

              <hr className="border-green-900" />

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Team Members</p>
                <div className="flex flex-wrap gap-1.5">
                  {members.map((m, i) => (
                    <span key={i} className="bg-green-900 text-green-200 text-xs px-2.5 py-1 rounded-full">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── FAILED ── */}
          {scanState === "failed" && (
            <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-center space-y-2">
              <Badge className="bg-red-800 text-red-200 text-xs px-3 py-1 rounded-full">
                ✗ Not Verified
              </Badge>
              <p className="text-red-300 text-sm">{failReason}</p>
              <p className="text-gray-500 text-xs">This QR code is not from the official system.</p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}