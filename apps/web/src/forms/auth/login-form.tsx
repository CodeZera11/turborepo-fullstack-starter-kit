"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AuthenticateUserRequest, AuthenticateUserSchema } from "@repo/types"
import { useForm } from "react-hook-form"
import { Form } from "@repo/ui/components/ui/form"
import InputElement from "@repo/ui/form-elements/input-element"
import { Button } from "@repo/ui/components/ui/button"
import FormError from "@/components/common/form-error"
import FormSuccess from "@/components/common/form-success"
import { useState, useTransition } from "react"
import { login } from "@/actions/login"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { PageRoutes } from "@/constants/page-routes"

const LoginForm = () => {

  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider!" : ""
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<AuthenticateUserRequest>({
    resolver: zodResolver(AuthenticateUserSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const onSubmit = async (values: AuthenticateUserRequest) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      login(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <InputElement
            label="Email"
            name="email"
            disabled={isPending}
            placeholder="johndoe@gmail.com"
          />
          <InputElement
            label="Password"
            name="password"
            type="password"
            disabled={isPending}
            placeholder="********"
          />
          <Button variant="link" size="sm" className="px-0 h-fit" asChild>
            <Link href={PageRoutes.AUTH.FORGOT_PASSWORD}>
              Forgot Password?
            </Link>
          </Button>
        </div>
        <FormError message={error || urlError} />
        <FormSuccess message={success} />
        <Button type="submit" disabled={isPending} className="w-full" size="lg">
          Login
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm