"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      document.cookie = "token=authenticated; path=/";
      router.push("/dashboard");
    } else {
      alert("Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">
          SIMHARPES LOGIN
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full p-3 rounded bg-gray-800 text-white"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 rounded bg-gray-800 text-white"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-blue-600 p-3 rounded text-white">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}