"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { FaRegHandPointRight } from "react-icons/fa";

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("bg-white rounded-none", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4  py-4 text-left text-base font-medium transition-all outline-none  focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180 bg-background  data-[state=open]:bg-primary data-[state=open]:text-white cursor-pointer px-4 rounded-none group",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <FaRegHandPointRight className="shrink-0 group-data-[state=open]:text-white text-primary text-xl data-[state=open]:text-white" />
          {children}
        </div>
        <Plus className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:hidden" />
        <Minus className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=closed]:hidden" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up px-4 data-[state=open]:animate-accordion-down overflow-hidden text-base"
      {...props}
    >
      <div className={cn("pt-4 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
