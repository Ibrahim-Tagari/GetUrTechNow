// components/LoginForm.tsx
"use client";

import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext"; // adjust your actual import
import { toast } from "react-hot-toast"; // or your toast library

export default function LoginForm() {
  const { setUser, setSession } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Login failed");
        return;
      }

      setUser(json.user);
      setSession(json.session);
      toast.success("Logged in!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      />
      <button type="submit" className="btn">
        Sign in
      </button>
    </form>
  );
}
