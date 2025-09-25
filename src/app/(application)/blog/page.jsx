"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Loading from "@/app/loading"

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const perPage = 3

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/admin/blog", { cache: 'no-store' })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(text)
        }

        const data = await res.json()

        if (data.success && Array.isArray(data.blogs)) {
          setPosts(data.blogs)
        } else {
          console.warn("Blog response format was unexpected:", data)
          setPosts([])
        }
      } catch (error) {
        console.error("Error fetching posts:", error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const paginatedPosts = posts.slice(page * perPage, (page + 1) * perPage)

  const handleNext = () => {
    if ((page + 1) * perPage < posts.length) {
      setPage((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (page > 0) {
      setPage((prev) => prev - 1)
    }
  }

  return (
    <main className="text-white min-h-screen px-4 py-16">
      <div className="max-w-6xl mx-auto">
        {/* تیتر */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#00e0ca]">وبلاگ ما</h1>
          <p className="text-white/70 max-w-xl mx-auto text-base md:text-lg">
            در اینجا جدیدترین مقالات آموزشی، ترفندها و اخبار دنیای تکنولوژی را دنبال کنید.
          </p>
        </motion.div>

        {/* لودینگ */}
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* لیست پست‌ها */}
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedPosts.map((post) => {
                  const formattedDate = new Date(post.createdAt).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })

                  return (
                    <Link href={`/blog/${post.slug}`} passHref key={post._id}>
                      <motion.div
                        key={post._id}
                        className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg flex flex-col"
                        whileHover={{ scale: 1.03 }}
                      >
                        <Image
                          src={post.image || "/img/baner.jpg"}
                          alt={post.title}
                          width={600}
                          height={400}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-5 flex flex-col flex-grow">
                          <h3 className="text-lg md:text-xl font-bold mb-2">{post.title}</h3>
                          <p className="text-sm text-white/70 mb-4 flex-grow">{post.excerpt}</p>
                          <div className="flex items-center justify-between text-[#00e0ca] font-medium gap-2">
                            <span className="flex items-center gap-1 hover:underline cursor-pointer">
                              مطالعه مقاله <ArrowLeft size={18} />
                            </span>
                            <span className="text-white/50 text-xs">{formattedDate}</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  )
                })}
              </motion.div>
            </AnimatePresence>

            {/* دکمه‌های قبلی و بعدی */}
            <div className="flex justify-center gap-6 mt-10 flex-wrap">
              <button
                onClick={handlePrev}
                disabled={page === 0}
                className="px-4 py-2 bg-white/10 rounded-xl text-white disabled:opacity-30"
              >
                قبلی
              </button>
              <button
                onClick={handleNext}
                disabled={(page + 1) * perPage >= posts.length}
                className="px-4 py-2 bg-white/10 rounded-xl text-white disabled:opacity-30"
              >
                بعدی
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
