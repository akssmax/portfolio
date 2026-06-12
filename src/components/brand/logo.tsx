import { useId } from "react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
}

const logoVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { type: "spring" as const, stiffness: 420, damping: 24 },
  },
}

const markVariants = {
  rest: { rotate: 0, y: 0 },
  hover: {
    rotate: -4,
    y: -1,
    transition: { type: "spring" as const, stiffness: 460, damping: 20 },
  },
}

const accentVariants = {
  rest: { scale: 1, opacity: 1 },
  hover: {
    scale: 1.15,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 520, damping: 18 },
  },
}

const wordmarkVariants = {
  rest: { x: 0, opacity: 1 },
  hover: {
    x: 5,
    opacity: 0.92,
    transition: { type: "spring" as const, stiffness: 320, damping: 26 },
  },
}

export function Logo({ className }: LogoProps) {
  const clipId = useId()
  const shouldReduceMotion = useReducedMotion()
  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: "rest" as const,
        whileHover: "hover" as const,
        animate: "rest" as const,
      }

  return (
    <motion.svg
      viewBox="0 0 759 208"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("h-6 w-auto shrink-0 text-foreground", className)}
      variants={shouldReduceMotion ? undefined : logoVariants}
      {...motionProps}
    >
      <g clipPath={`url(#${clipId})`}>
        <motion.g
          variants={shouldReduceMotion ? undefined : markVariants}
          style={{ originX: "0.18", originY: "0.5" }}
        >
          <path
            d="M133.813 208H0L138.667 0L174.529 53.7853L107.571 154.215H169.797L133.813 208Z"
            fill="currentColor"
          />
          <motion.path
            d="M194.81 208L230.655 154.215H169.798L205.591 100.343L277.386 208H194.81Z"
            className="fill-primary"
            variants={shouldReduceMotion ? undefined : accentVariants}
            style={{ originX: "0.28", originY: "0.72" }}
          />
        </motion.g>
        <motion.g variants={shouldReduceMotion ? undefined : wordmarkVariants}>
          <path
            d="M363.636 72.8866H332.644L327.67 87.5506H306.488L336.544 4.48926H359.979L390.035 87.5506H368.611L363.636 72.8866ZM348.14 26.8666L337.966 57.2693H358.436L348.14 26.8666Z"
            fill="currentColor"
          />
          <path
            d="M399.135 0H419.363V48.3947L439.365 21.528H464.325L436.869 54.652L464.551 87.5507H439.469L419.363 59.8693V87.5507H399.135V0Z"
            fill="currentColor"
          />
          <path
            d="M496.756 88.5038C479.128 88.5038 467.29 78.6758 466.354 65.9011H486.356C486.824 70.5118 490.967 73.5971 496.531 73.5971C501.731 73.5971 504.452 71.2225 504.452 68.2758C504.452 57.6331 468.486 65.3118 468.486 41.0625C468.486 29.8305 478.071 20.5918 495.352 20.5918C512.391 20.5918 521.855 30.0558 523.155 43.0731H504.47C503.88 38.5838 500.448 35.6198 494.763 35.6198C490.031 35.6198 487.431 37.5091 487.431 40.7158C487.431 51.2371 523.155 43.7838 523.519 68.3971C523.484 79.8718 513.31 88.5038 496.756 88.5038Z"
            fill="currentColor"
          />
          <path
            d="M533.555 0H553.783V30.4027C557.804 24.7173 565.032 20.8173 574.132 20.8173C589.16 20.8173 599.213 31.2347 599.213 48.984V87.5507H579.107V51.7053C579.107 42.7093 574.132 37.752 566.453 37.752C558.757 37.752 553.8 42.7267 553.8 51.7053V87.5507H533.572V0H533.555Z"
            fill="currentColor"
          />
          <path
            d="M636.013 20.5918C645.841 20.5918 652.809 25.0811 656.362 30.8878V21.5451H676.59V87.5678H656.362V78.2251C652.687 84.0318 645.719 88.5211 635.891 88.5211C619.806 88.5211 606.91 75.2785 606.91 54.4438C606.91 33.6091 619.806 20.5918 636.013 20.5918ZM641.923 38.2198C634.349 38.2198 627.485 43.9051 627.485 54.4265C627.485 64.9651 634.349 70.8758 641.923 70.8758C649.619 70.8758 656.362 65.0691 656.362 54.5478C656.362 44.0091 649.619 38.2198 641.923 38.2198Z"
            fill="currentColor"
          />
          <path
            d="M736.822 21.5278H758.714L717.305 118.907H695.534L710.666 85.3145L683.8 21.5452H706.402L721.673 62.8332L736.822 21.5278Z"
            fill="currentColor"
          />
          <path
            d="M341.987 207.671C324.116 207.671 310.163 198.796 309.573 182H331.101C331.691 188.396 335.712 191.464 341.397 191.464C347.308 191.464 351.104 188.5 351.104 183.647C351.104 168.272 309.573 176.54 309.816 147.091C309.816 131.352 322.712 122.599 340.097 122.599C358.193 122.599 370.379 131.595 371.211 147.437H349.319C348.972 142.116 345.176 138.927 339.733 138.805C334.88 138.684 331.223 141.18 331.223 146.38C331.223 160.819 372.285 154.301 372.285 182.104C372.285 196.075 361.4 207.671 341.987 207.671Z"
            fill="currentColor"
          />
          <path
            d="M407.42 139.88C417.248 139.88 424.216 144.369 427.769 150.176V140.833H447.997V206.856H427.769V197.513C424.095 203.32 417.127 207.809 407.299 207.809C391.213 207.809 378.317 194.567 378.317 173.732C378.317 152.88 391.213 139.88 407.42 139.88ZM413.331 157.508C405.756 157.508 398.892 163.193 398.892 173.715C398.892 184.253 405.756 190.164 413.331 190.164C421.027 190.164 427.769 184.357 427.769 173.836C427.769 163.297 421.027 157.508 413.331 157.508Z"
            fill="currentColor"
          />
          <path
            d="M456.04 123.067C456.04 116.913 460.893 112.06 468.104 112.06C475.211 112.06 480.047 116.913 480.047 123.067C480.047 129.099 475.193 133.952 468.104 133.952C460.893 133.952 456.04 129.099 456.04 123.067ZM457.947 140.816H478.175V206.839H457.947V140.816Z"
            fill="currentColor"
          />
          <path
            d="M533.658 170.993C533.658 161.997 528.684 157.04 521.005 157.04C513.309 157.04 508.352 162.015 508.352 170.993V206.839H488.106V140.816H508.334V149.569C512.356 144.005 519.462 140.105 528.337 140.105C543.608 140.105 553.782 150.523 553.782 168.272V206.839H533.676V170.993H533.658Z"
            fill="currentColor"
          />
          <path
            d="M561.235 123.067C561.235 116.913 566.089 112.06 573.299 112.06C580.406 112.06 585.242 116.913 585.242 123.067C585.242 129.099 580.389 133.952 573.299 133.952C566.089 133.952 561.235 129.099 561.235 123.067ZM563.125 140.816H583.353V206.839H563.125V140.816Z"
            fill="currentColor"
          />
        </motion.g>
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="758.715" height="208" fill="white" />
        </clipPath>
      </defs>
    </motion.svg>
  )
}
