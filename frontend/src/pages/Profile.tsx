import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dashboard } from "@/components/Dashboard";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom"


export default function ProfilePage() {
    return (
        <Dashboard>
            <Profile />
        </Dashboard>
    )
}


function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth0();
    if (!user) {
        navigate('/')
    }
    console.log(user)
    return (
        <div className="container mx-auto p-4 bg-inherit">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Account</h1>
                <div className="flex items-center space-x-4">
                    <Button variant="destructive"
                    // onClick={() => } // willl add after state management 
                    >Logout</Button>
                </div>
            </div>
            <Tabs defaultValue="profile" className="w-full ">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <Card className="">
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>Manage your personal information and account details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src="/placeholder.svg?height=80&width=80" alt="user image" />
                                    <AvatarFallback>V</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                    <p className="text-sm text-gray-500">{user?.phone_number}</p>
                                    <p className="text-sm text-gray-500">{user?.address}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {/* While on boarding */}
                                <Label>Education</Label>
                                <p>Indian School Certificate (ISC)</p>
                                <p>Second Time Dropper</p>
                            </div>
                            <Button>Edit Profile</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                            <CardDescription>Manage your account settings and preferences.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Settings content goes here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}