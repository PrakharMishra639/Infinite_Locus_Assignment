"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Calendar, UserCheck, Eye } from "lucide-react"
import Link from "next/link"

interface Organizer {
  id: string
  name: string
  email: string
  eventsCreated: number
  status: "active" | "inactive"
  joinDate: string
  description: string
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  status: "approved" | "pending" | "rejected"
  registered: number
  capacity: number
}

export default function AdminOrganizerDetailPage() {
  const [organizer, setOrganizer] = useState<Organizer | null>(null)
  const [events, setEvents] = useState<Event[]>([])
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

    // Mock organizer data
    const mockOrganizer: Organizer = {
      id: params.id as string,
      name: "Tech Club",
      email: "techclub@university.edu",
      eventsCreated: 5,
      status: "active",
      joinDate: "2024-01-15",
      description:
        "The Tech Club is dedicated to promoting technology education and innovation among students. We organize workshops, conferences, and hackathons to help students stay updated with the latest technological trends.",
    }

    setOrganizer(mockOrganizer)

    // Mock events data for this organizer
    setEvents([
      {
        id: "1",
        title: "Tech Conference 2024",
        description: "Annual technology conference",
        date: "2024-03-15",
        status: "approved",
        registered: 150,
        capacity: 200,
      },
      {
        id: "2",
        title: "Workshop on AI",
        description: "Hands-on AI workshop",
        date: "2024-03-25",
        status: "pending",
        registered: 30,
        capacity: 50,
      },
      {
        id: "3",
        title: "Hackathon 2024",
        description: "48-hour coding competition",
        date: "2024-04-10",
        status: "approved",
        registered: 80,
        capacity: 100,
      },
    ])
  }, [router, params.id])

  const handleStatusToggle = () => {
    if (organizer) {
      setOrganizer({
        ...organizer,
        status: organizer.status === "active" ? "inactive" : "active",
      })
    }
  }

  if (!user || !organizer) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Organizer Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{organizer.name}</CardTitle>
                  <Badge variant={organizer.status === "active" ? "default" : "secondary"}>{organizer.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm">{organizer.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">Joined {organizer.joinDate}</span>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Statistics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Events Created:</span>
                      <span className="font-medium">{organizer.eventsCreated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Events:</span>
                      <span className="font-medium">{events.filter((e) => e.status === "approved").length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Events:</span>
                      <span className="font-medium">{events.filter((e) => e.status === "pending").length}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    onClick={handleStatusToggle}
                    variant={organizer.status === "active" ? "destructive" : "default"}
                    className="w-full"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    {organizer.status === "active" ? "Deactivate" : "Activate"} Organizer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events and Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{organizer.description}</p>
              </CardContent>
            </Card>

            {/* Events */}
            <Card>
              <CardHeader>
                <CardTitle>Events Created</CardTitle>
                <CardDescription>All events created by {organizer.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No events created yet</p>
                  ) : (
                    events.map((event) => (
                      <Card key={event.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{event.title}</h4>
                                <Badge
                                  variant={
                                    event.status === "approved"
                                      ? "default"
                                      : event.status === "pending"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                >
                                  {event.status}
                                </Badge>
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                              <div className="flex gap-4 text-xs text-gray-500">
                                <span>Date: {event.date}</span>
                                <span>
                                  Registered: {event.registered}/{event.capacity}
                                </span>
                              </div>
                            </div>
                            <Link href={`/admin/events/${event.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
