'use client'

import {
  Heart,
  Calendar,
  MapPin,
  Users,
  Clock,
  Volume2,
  VolumeX
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

export default function Home() {
  // 倒计时状态
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // 表单和轮播状态
  const [selectedOption, setSelectedOption] = useState("")
  const [guestName, setGuestName] = useState("")
  const [showForm, setShowForm] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 音乐播放状态
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // 音乐自动播放
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play()
          setIsPlaying(true)
        } catch {
          setIsPlaying(false)
        }
      }
    }
    const timer = setTimeout(playAudio, 1000)
    return () => clearTimeout(timer)
  }, [])

  const toggleMusic = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // 倒计时逻辑
  useEffect(() => {
    const target = new Date("2025-08-09T18:00:00").getTime()
    const timer = setInterval(() => {
      const now = Date.now()
      const diff = target - now
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        })
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 照片数据
  const photos = [
    { id: 1, src: "/images/1.jpg", alt: "Ербол мен Нағым" },
    { id: 2, src: "/images/2.jpg", alt: "Жас жұбайлар" },
    { id: 3, src: "/images/3.jpg", alt: "Той суреттері" },
    { id: 4, src: "/images/3.jpg", alt: "Бақытты сәттер" }
  ]

  // 自动轮播：每 5 秒切换到下一张
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % photos.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [photos.length])

  // 真正提交到 Google Sheets
  const submitToGoogleSheets = async (data: {
    name: string
    attendance: string
  }) => {
    try {
      const res = await fetch(
        '/api/rsvp', 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      )
      return res.ok
    } catch (e) {
      console.error('Google Sheets 提交失败', e)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!guestName || !selectedOption) return
    setIsSubmitting(true)
    const success = await submitToGoogleSheets({
      name: guestName,
      attendance: selectedOption
    })
    setIsSubmitting(false)
    if (success) setShowForm(false)
    else alert("提交失败，请重试")
  }

  const countdownData = [
    { label: "күн", value: timeLeft.days },
    { label: "сағат", value: timeLeft.hours },
    { label: "минут", value: timeLeft.minutes },
    { label: "секунд", value: timeLeft.seconds }
  ]

  return (
    <div className="min-h-screen bg-white floral-bg">
      {/* 背景音乐 */}
      <audio ref={audioRef} loop preload="auto" aria-label="婚礼背景音乐">
        <source src="/music/wedding-music.mp3" type="audio/mpeg" />
        <source src="/music/wedding-music.wav" type="audio/wav" />
        您的浏览器不支持音频播放。
      </audio>

      {/* 音乐控制 */}
      <div className="fixed top-6 right-6 z-50 flex gap-2">
        <button
          onClick={toggleMusic}
          className="w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center"
          title={isPlaying ? "暂停音乐" : "播放音乐"}
        >
          {isPlaying ? (
            <div className="w-3 h-3 flex gap-1">
              <div className="w-1 h-3 bg-emerald-600" />
              <div className="w-1 h-3 bg-emerald-600" />
            </div>
          ) : (
            <div className="w-0 h-0 border-l-4 border-l-emerald-600 border-t-2 border-transparent border-b-2 border-transparent" />
          )}
        </button>
        <button
          onClick={toggleMute}
          className="w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center"
          title={isMuted ? "取消静音" : "静音"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-emerald-600" />
          ) : (
            <Volume2 className="w-5 h-5 text-emerald-600" />
          )}
        </button>
      </div>

      {/* 英雄区 */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 kazakh-pattern-bg opacity-20" />
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 flower-decoration animate-petal" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
          {/* 新人照片 */}
          <div className="mb-12 mt-8">
            <div className="w-80 h-80 mx-auto overflow-hidden rounded-full mb-6 animate-float">
              <img
                src={photos[0].src}
                alt={photos[0].alt}
                className="w-full h-full object-cover object-[center_30%]"
              />
            </div>
          </div>

          {/* 邀请语 */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-elegant mb-8">
              Құрметті қонақтар!
            </h1>
            <div className="floral-border p-8 text-center">
              <p className="text-lg md:text-xl leading-relaxed">
                Сіз(дер)ді ұлымыз{" "}
                <span className="font-bold text-emerald-600">Ербол</span> пен
                келініміз{" "}
                <span className="font-bold text-pink-500">Нағымның</span>
                <br />
                шаңырақ көтеру тойына арналған
                <br />
                салтанатты ақ дастарханымыздың
                <br />
                қадірлі қонағы болуға шақырамыз.
              </p>
            </div>
          </div>
        </div>
        <div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flower-decoration animate-float"
          style={{ animationDelay: "2s" }}
        />
      </section>

      {/* 婚礼信息 */}
      <section className="py-20 bg-gradient-to-b from-white to-pink-50">
        <div className="floral-divider max-w-4xl mx-auto px-4">
          <div className="floral-divider-icon" />
        </div>
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
            Той жайлы
          </h2>
          <div className="elegant-card">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-emerald-700 mb-4">
                Той иелері:
              </h3>
              <p className="text-xl">Амантай - Камила</p>
            </div>
            <div className="floral-divider">
              <div className="floral-divider-icon" />
            </div>
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-emerald-700 mb-4">
                Тойдың басталу уақыты:
              </h3>
              <p className="mb-6">09.08.2025 / сағат 18:00</p>
              <p className="text-emerald-600 font-medium mb-6">
                Тойдың басталуына қалды:
              </p>
              <div className="flex justify-center gap-6 mb-8">
                {countdownData.map(item => (
                  <div
                    key={item.label}
                    className="countdown-circle w-20 h-20 flex flex-col items-center justify-center"
                  >
                    <span className="font-bold">
                      {String(item.value).padStart(2, "0")}
                    </span>
                    <span className="text-xs opacity-90">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="floral-divider">
              <div className="floral-divider-icon" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-emerald-700 mb-4">
                Тойдың мекен-жайы:
              </h3>
              <p className="leading-relaxed mb-6">
                Manar Palace
                <br />
                Алматы қаласы, Қаратоған көшесі, 2
              </p>
              <a
                href="https://go.2gis.com/A363r"
                target="_blank"
                rel="noopener noreferrer"
                className="elegant-button inline-flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" /> Карта арқылы ашу
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 照片画廊 */}
      <section className="py-20 bg-white">
        <div className="floral-divider max-w-4xl mx-auto px-4">
          <div className="floral-divider-icon" />
        </div>
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Фотоальбом
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mb-12" />

          <div className="relative max-w-2xl mx-auto">
            <div className="elegant-card overflow-hidden rounded-lg max-w-xl mx-auto">
              <img
                src={photos[currentSlide].src}
                alt={photos[currentSlide].alt}
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="flex justify-center mt-6 gap-3">
              {photos.map((photo, idx) => (
                <button
                  key={photo.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-4 h-4 rounded-full transition-transform ${
                    currentSlide === idx
                      ? "bg-emerald-500 scale-125"
                      : "bg-emerald-200 hover:bg-emerald-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 出席确认表单 */}
      <section className="py-20 bg-gradient-to-b from-white to-pink-50">
        <div className="floral-divider max-w-4xl mx-auto px-4"><div className="floral-divider-icon"/></div>
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-6">Құрметті жақыным!</h2>
          <p className="text-center mb-4 leading-relaxed">Жуырда біздің өміріміздегі ең бақытты күндердің бірі болмақ!</p>
          <p className="text-center mb-8 leading-relaxed">Сол бақытты күнде сіз(дер)ді жанымыздан көріп, қуанышымызбен бөліскіміз келеді!</p>
          <div className="flex justify-center gap-12 mb-12">
            <div className="flex justify-center gap-12 mb-12">
              {/* Ербол */}
              <div className="text-center">
                <div className="flower-circle w-28 h-28 mx-auto mb-4 overflow-hidden rounded-full">
                  <img
                    src="/images/2.jpg"
                    alt="Ербол"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-emerald-700">Ербол</h3>
              </div>
              {/* Нағым */}
              <div className="text-center">
                <div className="flower-circle w-28 h-28 mx-auto mb-4 overflow-hidden rounded-full border-pink-400">
                  <img
                    src="/images/1.jpg"
                    alt="Нағым"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-pink-600">Нағым</h3>
              </div>
            </div>
          </div>
          <div className="elegant-card">
            {showForm ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-3">Есіміңіз:</label>
                  <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)} required disabled={isSubmitting} className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:border-emerald-500" placeholder="Есіміңізді енгізіңіз"/>
                </div>
                <div>
                  <label className="block mb-4">Бір нұсқаны таңдаңыз:</label>
                  <div className="space-y-3">
                    {[
                      {value:'single', label:'Иә, жалғыз өзім барамын!'},
                      {value:'couple', label:'Жұбайыммен бірге барамын'},
                      {value:'cannot', label:'Өкінішке қарай, келе алмаймын'}
                    ].map(opt => (
                      <label key={opt.value} className="flex items-center p-4 rounded-xl hover:bg-emerald-50">
                        <input type="radio" name="attendance" value={opt.value} checked={selectedOption===opt.value} onChange={e=>setSelectedOption(e.target.value)} disabled={isSubmitting} className="w-5 h-5 text-emerald-600"/>
                        <span className="ml-3">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed elegant-button">{isSubmitting ? 'Жауап беру...' : 'Жауап беру'}</button>
              </form>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-6">✅</div>
                <h3 className="font-bold mb-6">Рақмет!</h3>
                <div className="bg-emerald-50 rounded-xl p-6 mb-6">
                  <p>Есіміңіз: <span className="font-bold">{guestName}</span></p>
                  <p>Жауабыңыз: <span className="font-bold">{selectedOption==='single'? 'Жалғыз барамын': selectedOption==='couple'? 'Жұбайыммен бірге барамын':'Келе алмаймын'}</span></p>
                </div>
                <button onClick={()=>setShowForm(true)} className="underline">Жауапты өзгерту</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 页脚 
      <footer className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-2">
        <div className="container mx-auto text-center"><div className="flower-decoration mx-auto opacity-80"/></div>
      </footer>*/}
    </div>
  );
}
