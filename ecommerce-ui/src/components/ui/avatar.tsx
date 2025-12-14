"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

interface AvatarProps {
  name?: string;
  imageUrl?: string;
  className?: string;
}

export const Avatar = ({ name = "", imageUrl = "", className }: AvatarProps) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
    >
      {imageUrl && (
        <AvatarPrimitive.Image
          data-slot="avatar-image"
          className="aspect-square size-full"
          src={imageUrl}
          alt={name}
        />
      )}
      <AvatarPrimitive.Fallback
        data-slot="avatar-fallback"
        className="bg-muted flex size-full items-center justify-center rounded-full"
      >
        {initial || "U"}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
};
