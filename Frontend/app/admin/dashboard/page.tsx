"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, LogOut, Eye, CheckCircle, XCircle, UserCheck } from "lucide-react"

interface Organizer {
  id: string
  name: string
  email: string
  eventsCreated: number
  status: "active" | "inactive"
  joinDate: string
}

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
  organizerId: string
}

export default function AdminDashboard() {
  const [organizers, setOrganizers] = useState<Organizer[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

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

    // Mock organizers data
    setOrganizers([
      {
        id: "1",
        name: "Tech Club",
        email: "techclub@university.edu",
        eventsCreated: 5,
        status: "active",
        joinDate: "2024-01-15",
      },
      {
        id: "2",
        name: "Cultural Committee",
        email: "cultural@university.edu",
        eventsCreated: 3,
        status: "active",
        joinDate: "2024-02-01",
      },
      {
        id: "3",
        name: "Sports Club",
        email: "sports@university.edu",
        eventsCreated: 2,
        status: "inactive",
        joinDate: "2024-02-20",
      },
    ])

    // Mock events data
    setEvents([
      {
        id: "1",
        title: "Tech Conference 2024",
        description: "Annual technology conference",
        date: "2024-03-15",
        time: "09:00 AM",
        location: "Main Auditorium",
        capacity: 200,
        registered: 150,
        status: "pending",
        organizer: "Tech Club",
        organizerId: "1",
      },
      {
        id: "2",
        title: "Cultural Fest",
        description: "Celebrate diversity with music and dance",
        date: "2024-03-20",
        time: "06:00 PM",
        location: "Campus Ground",
        capacity: 500,
        registered: 320,
        status: "approved",
        organizer: "Cultural Committee",
        organizerId: "2",
      },
      {
        id: "3",
        title: "Workshop on AI",
        description: "Hands-on AI workshop",
        date: "2024-03-25",
        time: "02:00 PM",
        location: "Lab 101",
        capacity: 50,
        registered: 30,
        status: "pending",
        organizer: "Tech Club",
        organizerId: "1",
      },
    ])
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleEventAction = (eventId: string, action: "approve" | "reject") => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, status: action === "approve" ? "approved" : "rejected" } : event,
      ),
    )
  }

  const handleOrganizerStatusToggle = (organizerId: string) => {
    setOrganizers((prev) =>
      prev.map((organizer) =>
        organizer.id === organizerId
          ? { ...organizer, status: organizer.status === "active" ? "inactive" : "active" }
          : organizer,
      ),
    )
  }

  if (!user) return null

  const pendingEvents = events.filter((event) => event.status === "pending")
  const approvedEvents = events.filter((event) => event.status === "approved")
  const rejectedEvents = events.filter((event) => event.status === "rejected")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {user.name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Organizers</p>
                  <p className="text-2xl font-bold text-gray-900">{organizers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved Events</p>
                  <p className="text-2xl font-bold text-gray-900">{approvedEvents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Events</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingEvents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events">
              Event Management
              {pendingEvents.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingEvents.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="organizers">Organizer Management</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList>
                <TabsTrigger value="pending">Pending ({pendingEvents.length})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({approvedEvents.length})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({rejectedEvents.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <div className="space-y-4">
                  {pendingEvents.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p className="text-gray-500">No pending events</p>
                      </CardContent>
                    </Card>
                  ) : (
                    pendingEvents.map((event) => (
                      <Card key={event.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                              <p className="text-gray-600 mb-3">{event.description}</p>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                                <div>
                                  <span className="font-medium">Date:</span> {event.date} at {event.time}
                                </div>
                                <div>
                                  <span className="font-medium">Location:</span> {event.location}
                                </div>
                                <div>
                                  <span className="font-medium">Capacity:</span> {event.capacity}
                                </div>
                                <div>
                                  <span className="font-medium">Organizer:</span> {event.organizer}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Link href={`/admin/events/${event.id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </Link>
                              <Button size="sm" onClick={() => handleEventAction(event.id, "approve")}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleEventAction(event.id, "reject")}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="approved">
                <div className="space-y-4">
                  {approvedEvents.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p className="text-gray-500">No approved events</p>
                      </CardContent>
                    </Card>
                  ) : (
                    approvedEvents.map((event) => (
                      <Card key={event.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold">{event.title}</h3>
                                <Badge variant="default">Approved</Badge>
                              </div>
                              <p className="text-gray-600 mb-3">{event.description}</p>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                                <div>
                                  <span className="font-medium">Date:</span> {event.date} at {event.time}
                                </div>
                                <div>
                                  <span className="font-medium">Registered:</span> {event.registered}/{event.capacity}
                                </div>
                                <div>
                                  <span className="font-medium">Location:</span> {event.location}
                                </div>
                                <div>
                                  <span className="font-medium">Organizer:</span> {event.organizer}
                                </div>
                              </div>
                            </div>
                            <Link href={`/admin/events/${event.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="rejected">
                <div className="space-y-4">
                  {rejectedEvents.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p className="text-gray-500">No rejected events</p>
                      </CardContent>
                    </Card>
                  ) : (
                    rejectedEvents.map((event) => (
                      <Card key={event.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold">{event.title}</h3>
                                <Badge variant="destructive">Rejected</Badge>
                              </div>
                              <p className="text-gray-600 mb-3">{event.description}</p>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                                <div>
                                  <span className="font-medium">Date:</span> {event.date} at {event.time}
                                </div>
                                <div>
                                  <span className="font-medium">Location:</span> {event.location}
                                </div>
                                <div>
                                  <span className="font-medium">Capacity:</span> {event.capacity}
                                </div>
                                <div>
                                  <span className="font-medium">Organizer:</span> {event.organizer}
                                </div>
                              </div>
                            </div>
                            <Link href={`/admin/events/${event.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="organizers">
            <div className="space-y-4">
              {organizers.map((organizer) => (
                <Card key={organizer.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{organizer.name}</h3>
                          <Badge variant={organizer.status === "active" ? "default" : "secondary"}>
                            {organizer.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{organizer.email}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                          <div>
                            <span className="font-medium">Events Created:</span> {organizer.eventsCreated}
                          </div>
                          <div>
                            <span className="font-medium">Join Date:</span> {organizer.joinDate}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Link href={`/admin/organizers/${organizer.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant={organizer.status === "active" ? "destructive" : "default"}
                          onClick={() => handleOrganizerStatusToggle(organizer.id)}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          {organizer.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
