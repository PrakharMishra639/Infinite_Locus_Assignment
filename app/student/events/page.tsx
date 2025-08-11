"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Search, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

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
}

export default function StudentEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState("")
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
    if (parsedUser.role !== "student") {
      router.push("/auth/login")
      return
    }

    setUser(parsedUser)

    // Mock events data
    setEvents([
      {
        id: "1",
        title: "Tech Conference 2024",
        description: "Annual technology conference featuring latest innovations",
        date: "2024-03-15",
        time: "09:00 AM",
        location: "Main Auditorium",
        capacity: 200,
        registered: 150,
        status: "approved",
        organizer: "Tech Club",
      },
      {
        id: "2",
        title: "Cultural Fest",
        description: "Celebrate diversity with music, dance, and food",
        date: "2024-03-20",
        time: "06:00 PM",
        location: "Campus Ground",
        capacity: 500,
        registered: 320,
        status: "approved",
        organizer: "Cultural Committee",
      },
      {
        id: "3",
        title: "Career Fair",
        description: "Meet with top employers and explore career opportunities",
        date: "2024-03-25",
        time: "10:00 AM",
        location: "Exhibition Hall",
        capacity: 300,
        registered: 180,
        status: "approved",
        organizer: "Placement Cell",
      },
    ])
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const filteredEvents = events.filter(
    (event) =>
      event.status === "approved" &&
      (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Campus Events</h1>
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
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Badge variant="secondary">{event.status}</Badge>
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
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {event.registered}/{event.capacity} registered
                  </div>
                </div>
                <Link href={`/student/events/${event.id}`}>
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
