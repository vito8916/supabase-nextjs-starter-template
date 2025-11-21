import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import Image from "next/image"
import { z } from "zod"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { taskSchema } from "./data/schema"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}

// Simulate a database read for tasks.
async function getTasks() {
  "use cache"
  const data = await fs.readFile(
    path.join(process.cwd(), "app/(protected)/task-example/data/tasks.json")
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

export default async function TaskPage() {
  const tasks = await getTasks()

  return (
    <>
      <div className="hidden h-full flex-1 flex-col gap-8 p-8 md:flex">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Welcome back!
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="default">
              <Link href="/task-example/create">Add Task</Link>
            </Button>
          </div>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <DataTable data={tasks} columns={columns} />
        </Suspense>
      </div>
    </>
  )
}