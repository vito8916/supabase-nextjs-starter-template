import { getCurrentUser } from "@/app/actions/users-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { capitalizeText, cn, getInitials } from "@/lib/utils";
import { Mail, Shield, Calendar, Clock, ImageIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getAuthUser } from "@/app/actions/auth/auth-actions";

export default async function DashboardPage() {

    const user = await getAuthUser()
    const userProfileInfo = await getCurrentUser()

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            <Card className="max-w-2xl">
                <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={userProfileInfo?.avatar_url} />
                            <AvatarFallback className="text-lg font-semibold bg-primary/10">
                                {getInitials(user?.user_metadata?.full_name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <CardTitle className="text-2xl mb-2">
                                Welcome back, {capitalizeText(user?.user_metadata.full_name)}
                            </CardTitle>
                            <Badge variant="outline" className={cn(userProfileInfo?.status === 'active' ? 'bg-green-500/10' : 'bg-destructive/10', "text-xs")}>
                                {userProfileInfo?.status}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                
                <Separator />
                
                <CardContent className="pt-6">
                    <div className="grid gap-4">
                        <div className="flex items-center space-x-3 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">{user?.email}</span>
                        </div>
                        
                        <div className="flex items-center space-x-3 text-sm">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">User ID:</span>
                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                {user?.id}
                            </code>
                        </div>
                        
                        <div className="flex items-center space-x-3 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Member since:</span>
                            <span className="font-medium">
                                {user?.created_at ? formatDate(user.created_at) : 'N/A'}
                            </span>
                        </div>
                        
                        <div className="flex items-center space-x-3 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Last active:</span>
                            <span className="font-medium">
                                {user?.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'N/A'}
                            </span>
                        </div>

                        <div className="flex items-center space-x-3 text-sm">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Avatar Url:</span>
                            <span className="font-medium">
                                { user?.user_metadata?.avatar_url ? user.user_metadata?.avatar_url : 'N/A'}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
