"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
} from "@/components/ui/alert-dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to WAI-ARIA patterns.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show alert</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function AspectRatioDemo() {
  return (
    <AspectRatio ratio={16 / 9} className="w-full max-w-sm overflow-hidden rounded-lg bg-muted">
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        16:9
      </div>
    </AspectRatio>
  )
}

export function BreadcrumbDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Components</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function ButtonGroupDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline">Left</Button>
      <Button variant="outline">Center</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  )
}

export function CollapsibleDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-md">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          Toggle content
          <ChevronDown className={open ? "rotate-180" : ""} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 text-sm text-muted-foreground">
        Hidden content revealed on expand.
      </CollapsibleContent>
    </Collapsible>
  )
}

export function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer title</DrawerTitle>
          <DrawerDescription>Drawer description text.</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  )
}

export function EmptyDemo() {
  return (
    <Empty className="max-w-sm border">
      <EmptyHeader>
        <EmptyTitle>No results</EmptyTitle>
        <EmptyDescription>Try adjusting your filters.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export function FieldDemo() {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor="username">Username</FieldLabel>
      <FieldContent>
        <Input id="username" placeholder="johndoe" />
      </FieldContent>
    </Field>
  )
}

export function InputGroupDemo() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput placeholder="Search..." />
    </InputGroup>
  )
}

export function KbdDemo() {
  return (
    <div className="flex gap-2">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </div>
  )
}

export function NativeSelectDemo() {
  return (
    <NativeSelect className="max-w-sm">
      <NativeSelectOption value="">Select option</NativeSelectOption>
      <NativeSelectOption value="1">Option 1</NativeSelectOption>
      <NativeSelectOption value="2">Option 2</NativeSelectOption>
    </NativeSelect>
  )
}

export function PaginationDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <p className="text-sm">Popover content goes here.</p>
      </PopoverContent>
    </Popover>
  )
}

export function ProgressDemo() {
  return <Progress value={66} className="w-full max-w-sm" />
}

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable" className="max-w-sm">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
    </RadioGroup>
  )
}

export function ResizableDemo() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="max-w-md rounded-lg border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-20 items-center justify-center p-4 text-sm">Panel A</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-20 items-center justify-center p-4 text-sm">Panel B</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-32 w-full max-w-sm rounded-md border p-4">
      <p className="text-sm text-muted-foreground">
        Scrollable content area. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </ScrollArea>
  )
}

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet title</SheetTitle>
          <SheetDescription>Sheet description.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export function SliderDemo() {
  return <Slider defaultValue={[50]} max={100} step={1} className="w-full max-w-sm" />
}

export function SpinnerDemo() {
  return <Spinner className="size-8" />
}

export function TableDemo() {
  return (
    <Table className="max-w-md">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Alice</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob</TableCell>
          <TableCell>Pending</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export function ToggleDemo() {
  return <Toggle aria-label="Toggle italic">Bold</Toggle>
}

export function ToggleGroupDemo() {
  return (
    <ToggleGroup type="single" defaultValue="center">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  )
}
