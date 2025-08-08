"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { forgotPasswordSchema, ForgotPasswordFormValues } from "@/lib/validations-schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { forgotPasswordAction } from "@/app/actions/auth/auth-actions";
import { toast } from "sonner";

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(data: ForgotPasswordFormValues) {
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("email", data.email);
            const result = await forgotPasswordAction(formData);

            if (result.error) {
                toast.error(result.error);
                setError(result.error);
                return;
            }

            form.reset();
            toast.success("Password reset email sent");
            setSuccess(true);
        } catch {
            toast.error("Something went wrong. Please try again.");
            setError("Something went wrong. Please try again.");
        } finally {
            form.reset();
            setIsLoading(false);
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Reset Your Password</CardTitle>
                    <CardDescription>
                        Type in your email and we&apos;ll send you a link to reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="space-y-4">
                            <div className="p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                                Password reset email sent successfully! Check your email and follow the instructions to
                                reset your password.
                            </div>
                            <div className="text-center">
                                <Link
                                    href="/login"
                                    className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4">
                                    Back to login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                {error && (
                                    <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                        {error}
                                    </div>
                                )}

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="m@example.com"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>
            <div className="text-center text-xs text-muted-foreground">
                You can also{" "}
                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                    sign in
                </Link>{" "}
                or{" "}
                <Link href="/sign-up" className="underline underline-offset-4 hover:text-primary">
                    sign up
                </Link>{" "}
                if you don&apos;t have an account.
            </div>
        </div>
    );
}
