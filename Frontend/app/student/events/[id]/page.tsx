"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle, XCircle } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  registered: number
  status: "approved" | "pending" | "rejected"
  organizer: string
  fullDescription: string
}

export default function EventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "student") {
      router.push("/auth/login")
      return
    }

    setUser(parsedUser)

    // Mock event data
    const mockEvent: Event = {
      id: params.id as string,
      title: "Tech Conference 2024",
      description: "Annual technology conference featuring latest innovations",
      fullDescription:
        "Join us for the most anticipated technology conference of the year! This event will feature keynote speakers from leading tech companies, interactive workshops, networking sessions, and exhibitions of cutting-edge technologies. Whether you're a student, professional, or tech enthusiast, this conference offers valuable insights into the future of technology.",
      date: "2024-03-15",
      time: "09:00 AM",
      location: "Main Auditorium",
      capacity: 200,
      registered: 150,
      status: "approved",
      organizer: "Tech Club",
    }

    setEvent(mockEvent)

    // Check if user is already registered (mock)
    const registrations = JSON.parse(localStorage.getItem("registrations") || "[]")
    setIsRegistered(registrations.includes(params.id))
  }, [router, params.id])

  const handleRegister = async () => {
    setLoading(true)
    setMessage("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock registration logic
      const registrations = JSON.parse(localStorage.getItem("registrations") || "[]")
      registrations.push(params.id)
      localStorage.setItem("registrations", JSON.stringify(registrations))

      setIsRegistered(true)
      setMessage("Successfully registered for the event!")

      // Update registered count
      if (event) {
        setEvent({ ...event, registered: event.registered + 1 })
      }
    } catch (error) {
      setMessage("Failed to register. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleUnregister = async () => {
    setLoading(true)
    setMessage("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock unregistration logic
      const registrations = JSON.parse(localStorage.getItem("registrations") || "[]")
      const updatedRegistrations = registrations.filter((id: string) => id !== params.id)
      localStorage.setItem("registrations", JSON.stringify(updatedRegistrations))

      setIsRegistered(false)
      setMessage("Successfully unregistered from the event.")

      // Update registered count
      if (event) {
        setEvent({ ...event, registered: event.registered - 1 })
      }
    } catch (error) {
      setMessage("Failed to unregister. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user || !event) return null

  const isEventFull = event.registered >= event.capacity

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        {/* Event Details */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                <CardDescription className="text-base">Organized by {event.organizer}</CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                {event.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">{event.date}</p>
                    <p className="text-sm">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3" />
                  <p>{event.location}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">
                      {event.registered}/{event.capacity} registered
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(event.registered / event.capacity) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {message && (
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                {isRegistered ? (
                  <div className="space-y-3">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">You are registered for this event</span>
                    </div>
                    <Button variant="destructive" onClick={handleUnregister} disabled={loading} className="w-full">
                      {loading ? "Unregistering..." : "Unregister"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {isEventFull && (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Event is full</span>
                      </div>
                    )}
                    <Button onClick={handleRegister} disabled={loading || isEventFull} className="w-full">
                      {loading ? "Registering..." : "Register for Event"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">About this Event</h3>
              <p className="text-gray-700 leading-relaxed">{event.fullDescription}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
