"use client";

import { api } from "@/src/lib/axios";
import { logout } from "@/src/context/features/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";

const Logout = () => {
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();
  const router = useRouter();

  const LogoutHandler = async () => {
    try {
      dispatch(logout());
      await api.post(
        "/api/auth/logout",
        {},
        {
          headers: { "x-skip-auth-refresh": "true" },
        },
      );
      router.replace("/in/auth/login");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Login failed. Please try again.",
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <button onClick={LogoutHandler}>
        {error && <p className="text-red-400 text-xs px-3 py-2">{error}</p>}
        <div className="cursor-pointer px-8 py-1.5 rounded-md text-sm font-medium border border-slate-800 text-white">
          Logout
        </div>
      </button>
    </>
  );
};

export default Logout;
