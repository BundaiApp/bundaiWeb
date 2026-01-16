"use client"

import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { Mail, CheckCircle, Loader2, Smartphone } from "lucide-react"
import addToWaitlistMutation from "../graphql/mutations/addToWaitlist.mutation"

export function AndroidWaitlistForm({ compact = false }) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [executeAddToWaitlist, { loading }] = useMutation(addToWaitlistMutation)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Please enter your email")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email")
      return
    }

    try {
      const { data } = await executeAddToWaitlist({
        variables: { email: email.trim(), platform: "android" },
      })

      if (data?.addToWaitlist?.success) {
        setSubmitted(true)
        setEmail("")
      } else {
        setError(data?.addToWaitlist?.message || "Something went wrong")
      }
    } catch (err) {
      console.error("Waitlist error:", err)
      setError("Failed to join waitlist. Please try again.")
    }
  }

  if (submitted) {
    return (
      <div className={`bg-black rounded-2xl p-2 sm:p-3 w-full sm:w-auto ${compact ? '' : 'min-w-[280px]'}`}>
        <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-4 py-1">
          <CheckCircle className="w-6 sm:w-8 h-6 sm:h-8 text-green-400" />
          <div className="text-left">
            <div className="text-xs text-green-400">You're on the list!</div>
            <div className="text-sm sm:text-lg font-semibold text-white">We'll notify you</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-black rounded-2xl p-2 sm:p-3 w-full sm:w-auto ${compact ? '' : 'min-w-[280px]'}`}>
      <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-4 mb-2">
        <Smartphone className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
        <div className="text-left">
          <div className="text-xs text-gray-400">Android - Coming February</div>
          <div className="text-sm sm:text-lg font-semibold text-white">Join Waitlist</div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="px-2 sm:px-4 pb-1">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full pl-8 pr-2 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Notify Me"}
          </button>
        </div>
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </form>
    </div>
  )
}
