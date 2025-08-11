import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Campus Event Management Platform</h1>
          <p className="text-xl text-gray-600 mb-8">
            Real-time event platform with role-based access for students, organizers, and administrators
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/login">
              <Button size="lg" className="px-8">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                Register
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <CardTitle>Students</CardTitle>
              <CardDescription>Browse and register for campus events with real-time updates</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <CardTitle>Organizers</CardTitle>
              <CardDescription>Create events and manage participant registrations</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <CardTitle>Administrators</CardTitle>
              <CardDescription>Oversee organizers and approve event submissions</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
