import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  Calendar,
  PlayCircleIcon,
  Volume2Icon,
  Share,
  Bookmark,
  Download,
  ExternalLink,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Mail,
  Twitter,
} from 'lucide-react'
import { mediaService } from '../admin-ui/utils/supabase'
import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'

const PodcastDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [podcast, setPodcast] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(0)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const fetchPodcast = async () => {
      if (!id) {
        setError('No podcast ID provided')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        console.log('Fetching podcast with slug:', id)

        // Fetch podcast by slug
        const data = await mediaService.getMediaItemBySlug(id)

        console.log('Fetched podcast data:', data)

        // Validate that this is a podcast
        if (data.type !== 'podcast') {
          throw new Error(`This content is a ${data.type}, not a podcast`)
        }

        // Parse the JSON content
        let parsedContent: any = {}
        try {
          parsedContent = typeof data.content === 'string' ? JSON.parse(data.content) : data.content
          console.log('Parsed podcast content:', parsedContent)
        } catch (e) {
          console.error('Error parsing podcast content:', e)
          console.error('Raw content:', data.content)
        }

        // Helper function to strip HTML tags
        const stripHtml = (html: string) => {
          if (!html) return ''
          const tmp = document.createElement('div')
          tmp.innerHTML = html
          return tmp.textContent || tmp.innerText || ''
        }

        // Fetch more episodes (other podcasts)
        const { data: moreEpisodes } = await mediaService.getMediaItems({
          type: 'podcast',
          limit: 5
        })

        console.log('Fetched more episodes:', moreEpisodes?.length || 0)

        // Map the data to match the expected structure
        const mappedPodcast = {
          id: data.id,
          slug: data.slug,
          showTitle: parsedContent.showTitle || 'Forward Thinkers Podcast',
          title: data.title,
          description: parsedContent.showDescription || data.excerpt || data.summary || '',
          heroImage: data.heroImage || data.thumbnailUrl || '/images/prediction-hero.jpg',
          date: new Date(data.publishDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          isNew: parsedContent.isNew || false,
          host: {
            name: data.author?.name || 'The Forward Thinkers',
            avatar: data.author?.avatar || '/images/Stephane_Avatar.png'
          },
          topicsCovered: parsedContent.topicsCovered || [],
          spotifyUrl: parsedContent.spotifyUrl || '',
          downloadUrl: parsedContent.downloadUrl || data.documentUrl || '',
          showDescription: parsedContent.showDescription || '',
          showColor: parsedContent.showColor || '#f97316',
          thumbnailUrl: parsedContent.thumbnailUrl || data.heroImage,
          episodes: (parsedContent.episodes || []).map((ep: any) => ({
            ...ep,
            showNotesHtml: ep.showNotes || '',
            showNotes: stripHtml(ep.showNotes || '')
          })),
          moreEpisodes: (moreEpisodes || [])
            .filter((ep: any) => ep.id !== data.id) // Exclude current episode
            .slice(0, 4)
            .map((ep: any) => {
              let epContent: any = {}
              try {
                epContent = typeof ep.content === 'string' ? JSON.parse(ep.content) : ep.content
              } catch (e) {
                console.error('Error parsing episode content:', e)
              }

              return {
                id: ep.slug,
                number: epContent.episodeNumber || 0,
                title: ep.title,
                duration: epContent.duration || '0 min',
                thumbnailUrl: epContent.thumbnailUrl || ep.heroImage || '/images/prediction-hero.jpg'
              }
            })
        }

        // If no episodes but had old style data, migrate
        if (mappedPodcast.episodes.length === 0 && (parsedContent.audioUrl || parsedContent.showNotes)) {
          mappedPodcast.episodes = [{
            title: data.title,
            episodeNumber: parsedContent.episodeNumber || 1,
            duration: parsedContent.duration || '0 min',
            audioUrl: parsedContent.audioUrl || '',
            showNotesHtml: parsedContent.showNotes || '',
            showNotes: stripHtml(parsedContent.showNotes || ''),
            thumbnailUrl: parsedContent.thumbnailUrl || data.heroImage || ''
          }];
        }

        console.log('Mapped podcast:', mappedPodcast)
        setPodcast(mappedPodcast)
      } catch (err: any) {
        console.error('Error fetching podcast:', err)
        setError(err.message || 'Failed to load podcast')
      } finally {
        setLoading(false)
      }
    }

    fetchPodcast()
  }, [id])

  const handlePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !podcast) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">{error || 'Podcast Not Found'}</h1>
          <button
            onClick={() => navigate('/marketplace/knowledge-hub')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    )
  }

  const currentEpisode = podcast.episodes[selectedEpisodeIndex] || podcast.episodes[0] || {};

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentEpisode.audioUrl}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false)
          // Auto play next episode if available
          if (selectedEpisodeIndex < podcast.episodes.length - 1) {
            setSelectedEpisodeIndex(selectedEpisodeIndex + 1)
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.play()
                setIsPlaying(true)
              }
            }, 500)
          }
        }}
      />

      {/* Hero Section Container */}
      <div className="flex-1">
        {/* Navigation Bar */}
        <div className="flex items-center px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-1 hover:bg-gray-800 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: podcast.showColor }}
            >
              <span className="text-sm font-bold text-white">
                {podcast.showTitle.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <span className="font-medium text-white">{podcast.showTitle}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 px-4 md:px-8 pb-8 pt-6">
            {/* Hero Image */}
            <div className="relative mb-8">
              <img
                src={currentEpisode.thumbnailUrl || podcast.heroImage}
                alt={currentEpisode.title || podcast.title}
                className="w-full h-64 md:h-[28rem] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>

              {/* Play Overlay */}
              {!isPlaying && (
                <button
                  onClick={handlePlayPause}
                  className="absolute inset-0 flex items-center justify-center group"
                >
                  <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                    <PlayCircleIcon className="w-10 h-10 text-white" />
                  </div>
                </button>
              )}
            </div>

            {/* Episode Info */}
            <div className="flex items-center gap-6 mb-6 text-base">
              <span className="text-orange-500 font-medium">EP {currentEpisode.episodeNumber}</span>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-5 h-5" />
                <span>{currentEpisode.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-5 h-5" />
                <span>{podcast.date}</span>
              </div>
              {podcast.isNew && selectedEpisodeIndex === 0 && (
                <span className="bg-orange-500 text-white px-3 py-1.5 rounded text-sm font-medium">
                  NEW
                </span>
              )}
            </div>

            {/* Title and Description */}
            <h1 className="font-bold mb-6 text-white leading-tight text-3xl md:text-5xl lg:text-6xl">
              {currentEpisode.title || podcast.title}
            </h1>
            <p className="text-gray-400 mb-8 leading-relaxed text-base md:text-lg max-w-4xl">
              {podcast.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm md:text-base transition-colors">
                <Share className="w-4 h-4 md:w-5 md:h-5" />
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm md:text-base transition-colors">
                <Bookmark className="w-4 h-4 md:w-5 md:h-5" />
                Save
              </button>
              <a
                href={currentEpisode.audioUrl}
                download
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm md:text-base transition-colors"
                onClick={(e) => { if (!currentEpisode.audioUrl) e.preventDefault(); }}
              >
                <Download className="w-4 h-4 md:w-5 md:h-5" />
                Download
              </a>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm md:text-base transition-colors">
                <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                Open in Spotify
              </button>
            </div>



            {/* Show Notes */}
            <div className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 text-white">Show Notes</h2>
              <div
                className="text-gray-400 leading-relaxed text-lg prose prose-invert max-w-none podcast-show-notes"
                dangerouslySetInnerHTML={{ __html: currentEpisode.showNotesHtml || currentEpisode.showNotes }}
              />
            </div>

            {/* Topics Covered */}
            <div className="mb-20">
              <h2 className="text-3xl font-semibold mb-6 text-white">Key Topics</h2>
              <ul className="space-y-4">
                {podcast.topicsCovered.map((topic: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-full mt-3 mr-5 flex-shrink-0 shadow-lg shadow-orange-500/50"></div>
                    <span className="text-gray-400 text-lg">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[400px] xl:w-[450px] bg-black p-4 md:p-8 border-l border-gray-800/50">
            {/* Now Playing Widget */}
            <div className="bg-gray-800 rounded-xl p-5 mb-8">
              <div className="text-xs text-orange-500 font-medium mb-3 tracking-wide uppercase">NOW PLAYING</div>
              <h3 className="font-semibold mb-1 text-white leading-tight">{currentEpisode.title || podcast.title}</h3>
              <div className="text-sm text-gray-400 mb-6">{podcast.host.name}</div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleProgressChange}
                  className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <button
                  className="text-gray-400 hover:text-white"
                  disabled={selectedEpisodeIndex === 0}
                  onClick={() => setSelectedEpisodeIndex(Math.max(0, selectedEpisodeIndex - 1))}
                >
                  <SkipBack className={`w-5 h-5 ${selectedEpisodeIndex === 0 ? 'opacity-20' : ''}`} />
                </button>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => {
                    if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
                  }}
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition-transform hover:scale-105"
                >
                  {isPlaying ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                  ) : (
                    <PlayCircleIcon className="w-6 h-6 text-white" />
                  )}
                </button>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => {
                    if (audioRef.current) audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10)
                  }}
                >
                  <SkipForward className="w-4 h-4" />
                </button>
                <button
                  className="text-gray-400 hover:text-white"
                  disabled={selectedEpisodeIndex === podcast.episodes.length - 1}
                  onClick={() => setSelectedEpisodeIndex(Math.min(podcast.episodes.length - 1, selectedEpisodeIndex + 1))}
                >
                  <SkipForward className={`w-5 h-5 ${selectedEpisodeIndex === podcast.episodes.length - 1 ? 'opacity-20' : ''}`} />
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-3">
                <button className="text-gray-400 hover:text-white">
                  <Volume2Icon className="w-4 h-4" />
                </button>
                <div className="flex-1 h-1 bg-gray-700 rounded-full">
                  <div className="w-3/4 h-1 bg-orange-500 rounded-full relative">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* More Shows */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-6 text-white">Explore More Shows</h2>
              <div className="space-y-4">
                {podcast.moreEpisodes.map((episode: any) => (
                  <div
                    key={episode.id}
                    onClick={() => navigate(`/podcast/${episode.id}`)}
                    className="flex items-start gap-3 p-3 bg-gray-800 rounded-xl hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <img
                      src={episode.thumbnailUrl}
                      alt={episode.title}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = '/images/prediction-hero.jpg'
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
                        <span>EP {episode.number}</span>
                        <span>• {episode.duration}</span>
                      </div>
                      <h3 className="text-sm font-medium text-white leading-tight">{episode.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Episodes in this Series */}
            {podcast.episodes.length > 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-6 text-white">Episodes in this Series</h2>
                <div className="space-y-4">
                  {podcast.episodes.map((ep: any, index: number) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedEpisodeIndex(index)
                        setIsPlaying(false)
                        setTimeout(() => {
                          if (audioRef.current) {
                            audioRef.current.play()
                            setIsPlaying(true)
                          }
                        }, 100)
                      }}
                      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${selectedEpisodeIndex === index ? 'bg-orange-500/20 ring-1 ring-orange-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                    >
                      <img
                        src={ep.thumbnailUrl || podcast.heroImage}
                        alt={ep.title}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = '/images/prediction-hero.jpg'
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
                          <span className={selectedEpisodeIndex === index ? 'text-orange-500 font-bold' : ''}>
                            EP {ep.episodeNumber}
                          </span>
                          <span>• {ep.duration}</span>
                        </div>
                        <h3 className={`text-sm leading-tight ${selectedEpisodeIndex === index ? 'text-white font-bold' : 'text-gray-300 font-medium'}`}>
                          {ep.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}

export default PodcastDetailPage