import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  ArrowUpRight,
  Camera,
  Disc3,
  ExternalLink,
  Music,
  Pause,
  Play,
  Volume2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { YoutubeIcon } from "@/components/icons/social-icons"
import { getInterestIcon } from "@/lib/interest-icons"
import { profile } from "@/lib/profile"

// Tab definitions
const TABS = [
  {
    id: "photography",
    label: "Photography 📸",
    desc: "Nature, landscapes, and architectural details captured around India.",
  },
  {
    id: "music",
    label: "Music & DJing 🎵",
    desc: "Mashups, progressive house remixes, and non-stop electronic DJ mixes.",
  },
  {
    id: "gaming",
    label: "Gaming & YouTube 🎮",
    desc: "Walkthroughs and gameplay videos of classic PC racing titles.",
  },
] as const

// Photo data
const PHOTOS = [
  {
    title: "Agra Fort in B/W",
    category: "Architecture",
    src: "/images/interests/agra_fort_bw.png",
    link: "https://500px.com/p/akssmax?view=photos",
  },
  {
    title: "The Crispy Pattern",
    category: "Abstract Pattern",
    src: "/images/interests/crispy_pattern.png",
    link: "https://500px.com/p/akssmax?view=photos",
  },
  {
    title: "The Thirsty Butterfly",
    category: "Wildlife Macro",
    src: "/images/interests/thirsty_butterfly.png",
    link: "https://500px.com/p/akssmax?view=photos",
  },
  {
    title: "Rising Flowers",
    category: "Nature Macro",
    src: "/images/interests/rising_flowers.png",
    link: "https://500px.com/p/akssmax?view=photos",
  },
]

// SoundCloud tracks
const TRACKS = [
  {
    id: "track-1",
    title: "Alone - Alan Walker Mashup",
    genre: "EDM / Mashup",
    duration: "4:12",
    totalSeconds: 252,
    url: "https://soundcloud.com/akshay-saini-10/alone-alan-walker-remix",
  },
  {
    id: "track-2",
    title: "Faded - Alan Walker vs Melody Mashup",
    genre: "Progressive House",
    duration: "5:23",
    totalSeconds: 323,
    url: "https://soundcloud.com/akshay-saini-10/faded-alan-walker-vs-melody-dimitri-vegas-like-mike-steve-aoki-vs-ummet-ozcan-mashup",
  },
  {
    id: "track-3",
    title: "Wave Your Hands vs Delirium vs Domino",
    genre: "Big Room House",
    duration: "6:05",
    totalSeconds: 365,
    url: "https://soundcloud.com/akshay-saini-10/domino-vs-wave-your-hands-vs-delirium",
  },
  {
    id: "track-4",
    title: "EDM Non-Stop Mix #01",
    genre: "DJ Mix / EDM",
    duration: "32:15",
    totalSeconds: 1935,
    url: "https://soundcloud.com/akshay-saini-10/edm-non-stop-01-may-2015",
  },
  {
    id: "track-5",
    title: "Non-Stop Bollywood Mix",
    genre: "DJ Mix / Bollywood",
    duration: "45:30",
    totalSeconds: 2730,
    url: "https://soundcloud.com/akshay-saini-10/non-stop-bollywood-mix-june-2014",
  },
]

// YouTube gameplay videos
const VIDEOS = [
  {
    title: "Need For Speed: Most Wanted PC - Walkthrough - Lamborghini Gallardo",
    channel: "AKSSMAX GAMING",
    duration: "8:42",
    thumbnail: "/images/interests/nfs_most_wanted.png",
    url: "https://www.youtube.com/watch?v=R0wN2Y3qM4U",
  },
  {
    title: "Need For Speed: Rivals PC Gameplay Ch - 2 Marussia B2",
    channel: "AKSSMAX GAMING",
    duration: "12:15",
    thumbnail: "/images/interests/nfs_rivals.png",
    url: "https://www.youtube.com/watch?v=0k5F-N0fW7Q",
  },
]

export function InterestsSection() {
  const shouldReduceMotion = useReducedMotion()
  const [activeTab, setActiveTab] = useState<
    "photography" | "music" | "gaming"
  >("photography")

  // Music Player States
  const [playingTrackId, setPlayingTrackId] = useState<string>("track-1")
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(15)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const activeTrack = TRACKS.find((t) => t.id === playingTrackId) || TRACKS[0]

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying])

  const handleTrackSelect = (trackId: string) => {
    if (playingTrackId === trackId) {
      setIsPlaying(!isPlaying)
    } else {
      setPlayingTrackId(trackId)
      setIsPlaying(true)
      setProgress(0)
    }
  }

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = Math.floor(seconds % 60)
    return `${min}:${sec < 10 ? "0" : ""}${sec}`
  }

  const currentSeconds = Math.floor((progress / 100) * activeTrack.totalSeconds)

  return (
    <section className="py-24 border-b border-border bg-background">
      <motion.div
        className="mx-auto max-w-6xl px-4 sm:px-6"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        {/* Row 1: Languages & General Interests */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Languages */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Languages
            </h2>
            <ul className="mt-6 space-y-3">
              {profile.languages.map((language) => (
                <li
                  key={language.name}
                  className="flex items-center justify-between border-b border-border pb-3 text-sm last:border-0"
                >
                  <span className="font-medium text-foreground">
                    {language.name}
                  </span>
                  <span className="text-muted-foreground">{language.level}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Interest Tags */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Interests
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {profile.interests.map((interest) => {
                const Icon = getInterestIcon(interest)
                return (
                  <Badge
                    key={interest}
                    variant="outline"
                    className="h-auto gap-1.5 py-1 ps-2 pe-2.5"
                  >
                    <Icon aria-hidden className="size-3.5 shrink-0 opacity-70" />
                    {interest}
                  </Badge>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Row 2: Interactive Creative Outlets Showcase */}
        <div className="mt-24 border-t border-border pt-16">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Creative Outlets
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              A look into what feeds my curiosity, builds rhythm, and shapes my visual sensibilities outside of work.
            </p>
          </div>

          {/* Tabs header list */}
          <div className="flex flex-wrap gap-2 border-b border-border pb-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 outline-none ${
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeCreativeTab"
                    className="absolute inset-0 rounded-lg bg-muted/70 border border-border"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm text-muted-foreground italic min-h-6">
            {TABS.find((t) => t.id === activeTab)?.desc}
          </p>

          {/* Tabs Panels Container */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              {activeTab === "photography" && (
                <motion.div
                  key="photography"
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                >
                  {PHOTOS.map((photo) => (
                    <a
                      key={photo.title}
                      href={photo.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-xl border border-border bg-card/30 aspect-square cursor-pointer flex flex-col justify-end"
                    >
                      <img
                        src={photo.src}
                        alt={photo.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                      <div className="relative z-10 p-5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/90 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                          {photo.category}
                        </span>
                        <h3 className="mt-2 font-medium text-foreground text-sm flex items-center gap-1 group-hover:text-primary transition-colors">
                          {photo.title}
                          <ExternalLink className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                      </div>
                    </a>
                  ))}
                  {/* Gallery CTA Card */}
                  <a
                    href="https://500px.com/p/akssmax?view=photos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group border border-dashed border-border hover:border-primary/50 bg-muted/10 rounded-xl aspect-square flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer"
                  >
                    <div className="rounded-full bg-muted p-3 group-hover:bg-primary/10 transition-colors">
                      <Camera className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="mt-4 font-medium text-foreground">
                      View full 500px Gallery
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground max-w-[160px]">
                      Check out more abstract, macro, and architectural shots.
                    </p>
                    <span className="mt-3 text-xs font-semibold text-primary inline-flex items-center gap-1">
                      Browse profile <ExternalLink className="size-3" />
                    </span>
                  </a>
                </motion.div>
              )}

              {activeTab === "music" && (
                <motion.div
                  key="music"
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid gap-8 md:grid-cols-[1fr_1.5fr]"
                >
                  {/* Turntable / Simulated Deck */}
                  <div className="flex flex-col justify-between rounded-2xl border border-border bg-card/30 p-6 backdrop-blur-sm">
                    {/* Style block for soundwave CSS keyframe animations */}
                    <style>{`
                      @keyframes custom-wave {
                        0%, 100% { transform: scaleY(0.25); }
                        50% { transform: scaleY(1); }
                      }
                      .custom-wave-bar {
                        animation: custom-wave 1.2s ease-in-out infinite;
                      }
                    `}</style>

                    <div className="flex flex-col items-center text-center">
                      {/* CD / Vinyl representation */}
                      <div className="relative flex size-36 items-center justify-center rounded-full bg-neutral-900 shadow-xl border border-neutral-800">
                        {/* Vinyl groves */}
                        <div className="absolute inset-2 rounded-full border border-neutral-800/40" />
                        <div className="absolute inset-6 rounded-full border border-neutral-800/60" />
                        <div className="absolute inset-10 rounded-full border border-neutral-800/80" />
                        {/* Center sticker */}
                        <motion.div
                          animate={isPlaying ? { rotate: 360 } : {}}
                          transition={{
                            repeat: Infinity,
                            duration: 6,
                            ease: "linear",
                          }}
                          className="flex size-14 items-center justify-center rounded-full bg-primary p-2"
                        >
                          <Disc3 className="size-8 text-primary-foreground" />
                        </motion.div>
                      </div>

                      <h3 className="mt-6 font-semibold text-foreground text-base line-clamp-1 px-4">
                        {activeTrack.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        By Akssmax · {activeTrack.genre}
                      </p>
                    </div>

                    <div className="mt-8 space-y-4">
                      {/* Play progress slider bar */}
                      <div className="space-y-1">
                        <div className="relative h-1 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>{formatTime(currentSeconds)}</span>
                          <span>{activeTrack.duration}</span>
                        </div>
                      </div>

                      {/* Music visualizer block */}
                      <div className="flex h-10 items-end justify-center gap-1.5 px-4 bg-muted/10 rounded-lg py-2">
                        {isPlaying ? (
                          Array.from({ length: 15 }).map((_, i) => (
                            <span
                              key={i}
                              className="custom-wave-bar w-1.5 bg-primary/80 rounded-full origin-bottom"
                              style={{
                                height: "100%",
                                animationDelay: `${i * 0.08}s`,
                                animationDuration: `${
                                  0.8 + Math.random() * 0.7
                                }s`,
                              }}
                            />
                          ))
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Volume2 className="size-3.5" />
                            <span>Player Paused</span>
                          </div>
                        )}
                      </div>

                      {/* Playback Controls */}
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform active:scale-95 cursor-pointer"
                          aria-label={isPlaying ? "Pause music" : "Play music"}
                        >
                          {isPlaying ? (
                            <Pause className="size-5 fill-current" />
                          ) : (
                            <Play className="size-5 fill-current ms-0.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Playlist grid */}
                  <div className="flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      {TRACKS.map((track) => {
                        const isActive = track.id === playingTrackId
                        return (
                          <div
                            key={track.id}
                            onClick={() => handleTrackSelect(track.id)}
                            className={`group flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                              isActive
                                ? "border-primary/50 bg-primary/5"
                                : "border-border hover:border-border-hover hover:bg-muted/30 bg-card/10"
                            }`}
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div
                                className={`flex size-10 items-center justify-center rounded-lg ${
                                  isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                                } transition-colors`}
                              >
                                {isActive && isPlaying ? (
                                  <Pause className="size-4 fill-current" />
                                ) : (
                                  <Play className="size-4 fill-current ms-0.5" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4
                                  className={`font-medium text-sm leading-none truncate ${
                                    isActive
                                      ? "text-primary"
                                      : "text-foreground"
                                  }`}
                                >
                                  {track.title}
                                </h4>
                                <span className="text-xs text-muted-foreground mt-1.5 block">
                                  {track.genre}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground">
                                {track.duration}
                              </span>
                              <a
                                href={track.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="opacity-0 group-hover:opacity-100 hover:text-primary p-1 text-muted-foreground transition-opacity"
                                aria-label="Open track on SoundCloud"
                              >
                                <ExternalLink className="size-3.5" />
                              </a>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <a
                      href="https://soundcloud.com/akshay-saini-10/tracks"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-muted/50 border border-border hover:bg-muted hover:border-border-hover hover:text-primary px-6 text-sm font-medium transition-all gap-1.5 w-full md:w-auto self-end mt-4 cursor-pointer"
                    >
                      <Music className="size-4" />
                      Listen on SoundCloud
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  </div>
                </motion.div>
              )}

              {activeTab === "gaming" && (
                <motion.div
                  key="gaming"
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid gap-6 sm:grid-cols-2"
                >
                  {VIDEOS.map((video) => (
                    <a
                      key={video.title}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col rounded-xl border border-border bg-card/20 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                        {/* Dark overlay & play button */}
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="rounded-full bg-primary p-4 text-primary-foreground transform scale-90 group-hover:scale-100 transition-transform duration-300">
                            <Play className="size-6 fill-current ms-0.5" />
                          </div>
                        </div>
                        {/* Video metadata pill */}
                        <span className="absolute bottom-3 right-3 rounded bg-background/85 px-2 py-0.5 text-[10px] font-medium text-foreground border border-border/30">
                          {video.duration}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                            {video.channel}
                          </span>
                          <h3 className="mt-3 font-medium text-foreground text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {video.title}
                          </h3>
                        </div>
                        <span className="mt-4 text-xs font-semibold text-primary inline-flex items-center gap-1">
                          Watch on YouTube <ExternalLink className="size-3" />
                        </span>
                      </div>
                    </a>
                  ))}
                  {/* YouTube Channel CTA Card */}
                  <a
                    href="https://www.youtube.com/@akshaysainiAK"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sm:col-span-2 border border-dashed border-border hover:border-primary/50 bg-muted/10 rounded-xl p-8 text-center flex flex-col items-center justify-center transition-all cursor-pointer"
                  >
                    <div className="rounded-full bg-muted p-3 group-hover:bg-primary/10 transition-colors">
                      <YoutubeIcon className="size-6 text-red-500" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground text-base">
                      AKSSMAX GAMING Channel
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                      Check out retro PC gaming walkthroughs, Need For Speed gameplay videos, and simulator streams.
                    </p>
                    <span className="mt-3 text-xs font-semibold text-primary inline-flex items-center gap-1">
                      Visit Channel <ExternalLink className="size-3" />
                    </span>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
