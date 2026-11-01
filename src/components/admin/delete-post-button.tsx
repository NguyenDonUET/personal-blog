"use client";

import { useState, useTransition } from "react";
import { deletePostAction } from "@/actions/posts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="inline-flex flex-col items-start">
      <AlertDialog>
        <AlertDialogTrigger
          type="button"
          className={cn(buttonVariants({ variant: "destructive", size: "sm" }))}
        >
          Delete
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              “{title}” will be removed permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={() => {
                setError(undefined);
                startTransition(async () => {
                  const result = await deletePostAction(id);
                  if (result?.error) {
                    setError(result.error);
                  }
                });
              }}
            >
              {isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {error ? (
        <p className="mt-1 text-xs text-red-600 dark:text-red-300">{error}</p>
      ) : null}
    </div>
  );
}
