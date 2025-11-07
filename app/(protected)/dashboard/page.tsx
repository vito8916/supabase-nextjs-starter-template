import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {capitalizeText, cn, getInitials} from "@/lib/utils";
import {Mail, Shield, Calendar, Clock, ImageIcon, Activity, AlertTriangle, MapPin, Monitor} from "lucide-react";
import {formatDate} from "@/lib/utils";
import {getAuthUser} from "@/app/actions/auth/auth-actions";
import {getUserProfile} from "@/app/actions/settings/profile-actions";
import {getRecentLoginActivity} from "@/app/actions/user-logins/user-login-actions";

export default async function DashboardPage() {

    const user = await getAuthUser()
    const userProfileInfo = await getUserProfile()

    // Get recent login activity
    const recentActivityResult = await getRecentLoginActivity(user?.id || '', 5);
    const recentActivity = recentActivityResult.success ? recentActivityResult.data : [];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="space-y-4">
                <Card className="max-w-2xl">
                    <CardHeader className="pb-4">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={userProfileInfo?.avatar_url ?? ''}/>
                                <AvatarFallback className="text-lg font-semibold bg-primary/10">
                                    {getInitials(user?.user_metadata?.full_name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <CardTitle className="text-2xl mb-2">
                                    Welcome back, {capitalizeText(user?.user_metadata.full_name)}
                                </CardTitle>
                                <Badge variant="outline"
                                       className={cn(userProfileInfo?.status === 'active' ? 'bg-green-500/50 border-green-500/50' : 'bg-destructive/10', "text-xs")}>
                                    {userProfileInfo?.status}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>

                    <Separator/>

                    <CardContent className="pt-6">
                        <div className="grid gap-4">
                            <div className="flex items-center space-x-3 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground"/>
                                <span className="text-muted-foreground">Email:</span>
                                <span className="font-medium">{user?.email}</span>
                            </div>

                            <div className="flex items-center space-x-3 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground"/>
                                <span className="text-muted-foreground">Member since:</span>
                                <span className="font-medium">
                                {user?.created_at ? formatDate(user.created_at) : 'N/A'}
                            </span>
                            </div>

                            <div className="flex items-center space-x-3 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground"/>
                                <span className="text-muted-foreground">Last active:</span>
                                <span className="font-medium">
                                {user?.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'N/A'}
                            </span>
                            </div>

                            <div className="flex items-center space-x-3 text-sm">
                                <ImageIcon className="h-4 w-4 text-muted-foreground"/>
                                <span className="text-muted-foreground">Avatar Url:</span>
                                <span className="font-medium">
                                {user?.user_metadata?.avatar_url ? user.user_metadata?.avatar_url : 'N/A'}
                            </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Recent Login Activity Card */}
                {recentActivity && recentActivity.length > 0 && (
                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Monitor className="h-5 w-5"/>
                                Recent Login Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id}
                                         className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={activity.status === 'success' ? 'default' : 'destructive'}>
                                                    {activity.status}
                                                </Badge>
                                                <span className="text-sm font-medium">
                                                {activity.browser} on {activity.os}
                                            </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3"/>
                                                {activity.city ? `${activity.city}, ${activity.country}` : activity.country || 'Unknown'}
                                            </span>
                                                <span className="flex items-center gap-1">
                                                <Activity className="h-3 w-3"/>
                                                    {activity.ip_address}
                                            </span>
                                                <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3"/>
                                                    {formatDate(activity.login_time)}
                                            </span>
                                            </div>
                                            {activity.failure_reason && (
                                                <div className="flex items-center gap-1 text-xs text-red-600">
                                                    <AlertTriangle className="h-3 w-3"/>
                                                    {activity.failure_reason}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
