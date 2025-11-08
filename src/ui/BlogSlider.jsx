"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Loading from "@/app/loading"

// Swiper
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"

export default function BlogSlider() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("/api/admin/blog", { cache: "no-store" })
                if (!res.ok) throw new Error(await res.text())

                const data = await res.json()
                if (data.success && Array.isArray(data.blogs)) setPosts(data.blogs)
                else setPosts([])
            } catch (error) {
                console.error("Error fetching posts:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="w-full h-[20rem] flex flex-col justify-center items-center overflow-hidden">
            {/* تیتر */}
            <h2 className="text-[#019297] font-bold text-xl mb-8 text-center w-full">
                "خبرنامه پژوهش‌سرا"
            </h2>

            {/* اسلایدر عمودی */}
            <Swiper
                direction="vertical"
                loop={true}
                slidesPerView={1}
                spaceBetween={10}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay]}
                className="w-[76%] h-[20rem]"
            >
                {posts.map((post) => (
                    <SwiperSlide key={post._id}>
                        <Link
                            href={`/blog/${post.slug}`}
                            className="block bg-white/60 backdrop-blur-md rounded-2xl border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            <div className="relative w-full aspect-video">
                                <Image
                                    src={post.image || "/img/baner.jpg"}
                                    alt={post.title}
                                    fill
                                    className="object-cover object-center"
                                />
                            </div>

                            <div className="p-3">
                                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(post.createdAt).toLocaleDateString("fa-IR", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}
