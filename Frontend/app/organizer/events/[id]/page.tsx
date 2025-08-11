"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
}

interface Registration {
  id: string
  studentName: string
  studentEmail: string
  registrationDate: string
  status: "pending" | "approved" | "rejected"
}

export default function OrganizerEventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
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
    if (parsedUser.role !== "organizer") {
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
        "Join us for the most anticipated technology conference of the year! This event will feature keynote speakers from leading tech companies, interactive workshops, networking sessions, and exhibitions of cutting-edge technologies.",
      date: "2024-03-15",
      time: "09:00 AM",
      location: "Main Auditorium",
      capacity: 200,
      registered: 150,
      status: "approved",
      organizer: "Tech Club",
    }

    setEvent(mockEvent)

    // Mock registrations data
    setRegistrations([
      {
        id: "1",
        studentName: "John Doe",
        studentEmail: "john@example.com",
        registrationDate: "2024-03-10",
        status: "pending",
      },
      {
        id: "2",
        studentName: "Jane Smith",
        studentEmail: "jane@example.com",
        registrationDate: "2024-03-11",
        status: "approved",
      },
      {
        id: "3",
        studentName: "Bob Johnson",
        studentEmail: "bob@example.com",
        registrationDate: "2024-03-12",
        status: "pending",
      },
    ])
  }, [router, params.id])

  const handleRegistrationAction = (registrationId: string, action: "approve" | "reject") => {
    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === registrationId ? { ...reg, status: action === "approve" ? "approved" : "rejected" } : reg,
      ),
    )
  }

  if (!user || !event) return null

  const pendingRegistrations = registrations.filter((reg) => reg.status === "pending")
  const approvedRegistrations = registrations.filter((reg) => reg.status === "approved")
  const rejectedRegistrations = registrations.filter((reg) => reg.status === "rejected")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Event Details */}
        <Card className="mb-8">
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

              <div>
                <h3 className="text-lg font-semibold mb-3">About this Event</h3>
                <p className="text-gray-700 leading-relaxed">{event.fullDescription}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration Management */}
        <Card>
          <CardHeader>
            <CardTitle>Registration Management</CardTitle>
            <CardDescription>Manage student registrations for your event</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList>
                <TabsTrigger value="pending">Pending ({pendingRegistrations.length})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({approvedRegistrations.length})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({rejectedRegistrations.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <div className="space-y-4">
                  {pendingRegistrations.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No pending registrations</p>
                  ) : (
                    pendingRegistrations.map((registration) => (
                      <Card key={registration.id}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div>
                            <h4 className="font-semibold">{registration.studentName}</h4>
                            <p className="text-sm text-gray-600">{registration.studentEmail}</p>
                            <p className="text-sm text-gray-500">Registered: {registration.registrationDate}</p>
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
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="approved">
                <div className="space-y-4">
                  {approvedRegistrations.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No approved registrations</p>
                  ) : (
                    approvedRegistrations.map((registration) => (
                      <Card key={registration.id}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div>
                            <h4 className="font-semibold">{registration.studentName}</h4>
                            <p className="text-sm text-gray-600">{registration.studentEmail}</p>
                            <p className="text-sm text-gray-500">Registered: {registration.registrationDate}</p>
                          </div>
                          <Badge variant="default">Approved</Badge>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="rejected">
                <div className="space-y-4">
                  {rejectedRegistrations.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No rejected registrations</p>
                  ) : (
                    rejectedRegistrations.map((registration) => (
                      <Card key={registration.id}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div>
                            <h4 className="font-semibold">{registration.studentName}</h4>
                            <p className="text-sm text-gray-600">{registration.studentEmail}</p>
                            <p className="text-sm text-gray-500">Registered: {registration.registrationDate}</p>
                          </div>
                          <Badge variant="destructive">Rejected</Badge>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
