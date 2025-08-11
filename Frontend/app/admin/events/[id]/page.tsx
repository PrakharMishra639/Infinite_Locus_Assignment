"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle, XCircle } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  fullDescription: string
  date: string
  time: string
  location: string
  capacity: number
  registered: number
  status: "approved" | "pending" | "rejected"
  organizer: string
  organizerId: string
}

export default function AdminEventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null)
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
    if (parsedUser.role !== "admin") {
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
      status: "pending",
      organizer: "Tech Club",
      organizerId: "1",
    }

    setEvent(mockEvent)
  }, [router, params.id])

  const handleEventAction = (action: "approve" | "reject") => {
    if (event) {
      setEvent({ ...event, status: action === "approve" ? "approved" : "rejected" })
    }
  }

  if (!user || !event) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Event Details */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                <CardDescription className="text-base">Organized by {event.organizer}</CardDescription>
              </div>
              <Badge
                variant={
                  event.status === "approved" ? "default" : event.status === "pending" ? "secondary" : "destructive"
                }
                className="text-sm"
              >
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
                {event.status === "pending" && (
                  <div className="space-y-3">
                    <p className="font-medium text-gray-900">Event Approval</p>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEventAction("approve")} className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Event
                      </Button>
                      <Button variant="destructive" onClick={() => handleEventAction("reject")} className="flex-1">
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Event
                      </Button>
                    </div>
                  </div>
                )}

                {event.status === "approved" && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Event Approved</span>
                  </div>
                )}

                {event.status === "rejected" && (
                  <div className="flex items-center text-red-600">
                    <XCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Event Rejected</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Event Description</h3>
              <p className="text-gray-700 leading-relaxed">{event.fullDescription}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
