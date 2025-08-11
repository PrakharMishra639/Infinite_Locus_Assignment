"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Plus, LogOut, Eye, CheckCircle, XCircle } from "lucide-react"

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
  pendingRegistrations: number
}

interface Registration {
  id: string
  eventId: string
  studentName: string
  studentEmail: string
  registrationDate: string
  status: "pending" | "approved" | "rejected"
}

export default function OrganizerDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [registrations, setRegistrations] = useState<Registration[]>([])
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
    if (parsedUser.role !== "organizer") {
      router.push("/auth/login")
      return
    }

    setUser(parsedUser)

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
        status: "approved",
        pendingRegistrations: 5,
      },
      {
        id: "2",
        title: "Workshop on AI",
        description: "Hands-on AI workshop",
        date: "2024-03-20",
        time: "02:00 PM",
        location: "Lab 101",
        capacity: 50,
        registered: 30,
        status: "pending",
        pendingRegistrations: 3,
      },
    ])

    // Mock registrations data
    setRegistrations([
      {
        id: "1",
        eventId: "1",
        studentName: "John Doe",
        studentEmail: "john@example.com",
        registrationDate: "2024-03-10",
        status: "pending",
      },
      {
        id: "2",
        eventId: "1",
        studentName: "Jane Smith",
        studentEmail: "jane@example.com",
        registrationDate: "2024-03-11",
        status: "pending",
      },
    ])
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleRegistrationAction = (registrationId: string, action: "approve" | "reject") => {
    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === registrationId ? { ...reg, status: action === "approve" ? "approved" : "rejected" } : reg,
      ),
    )
  }

  if (!user) return null

  const pendingRegistrations = registrations.filter((reg) => reg.status === "pending")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Organizer Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {user.name}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/organizer/create-event">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="registrations">
              Pending Registrations
              {pendingRegistrations.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingRegistrations.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
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
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {event.registered}/{event.capacity} registered
                      </div>
                      {event.pendingRegistrations > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {event.pendingRegistrations} pending approvals
                        </Badge>
                      )}
                    </div>
                    <Link href={`/organizer/events/${event.id}`}>
                      <Button className="w-full bg-transparent" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="registrations">
            <div className="space-y-4">
              {pendingRegistrations.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No pending registrations</p>
                  </CardContent>
                </Card>
              ) : (
                pendingRegistrations.map((registration) => {
                  const event = events.find((e) => e.id === registration.eventId)
                  return (
                    <Card key={registration.id}>
                      <CardContent className="flex items-center justify-between p-6">
                        <div>
                          <h3 className="font-semibold">{registration.studentName}</h3>
                          <p className="text-sm text-gray-600">{registration.studentEmail}</p>
                          <p className="text-sm text-gray-500">
                            Event: {event?.title} • Registered: {registration.registrationDate}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleRegistrationAction(registration.id, "approve")}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRegistrationAction(registration.id, "reject")}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
