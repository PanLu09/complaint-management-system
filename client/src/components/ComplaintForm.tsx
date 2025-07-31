import { useState } from "react";
import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ComplaintForm() {
  const [alert, setAlert] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const complaintSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    complaint: z.string().min(1, "Complaint message is required"),
  });

  // 1. Define ComplaintForm.
  const form = useForm<z.infer<typeof complaintSchema>>({
    resolver: zodResolver(complaintSchema),
    defaultValues: { name: "", email: "", complaint: "" },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof complaintSchema>) {
    try {
      await axios.post("http://localhost:3001/complaints", values);
      setAlert({
        type: "success",
        message: "Complaint submitted successfully!",
      });
      form.reset();
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to submit complaint. Please try again.",
      });
    }
    console.log(values);
    // Auto-dismiss alert after 3 seconds
    setTimeout(() => setAlert({ type: null, message: "" }), 3000);
  }

  return (
    <div className="max-w-md mx-auto mt-12 relative">
      {alert.type && (
        <div className="fixed top-5 left-auto w-full max-w-sm z-50">
          <Alert variant={alert.type === "success" ? "default" : "destructive"}>
            {alert.type === "success" ? (
              <CheckCircle2Icon className="w-5 h-5" />
            ) : (
              <AlertCircleIcon className="w-5 h-5" />
            )}
            <AlertTitle>
              {alert.type === "success" ? "Success!" : "Error"}
            </AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Please input your name here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="complaint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complaint</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Enter your complaint..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
