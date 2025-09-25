"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Instagram,
  Linkedin,
  Clock,
  MessageCircle,
  HelpCircle,
} from "lucide-react"
import toast from "react-hot-toast"

const faqs = [
  {
    q: "چطور می‌توانم درخواست پروژه جدید ثبت کنم؟",
    a: "می‌توانید از طریق فرم تماس، اطلاعات خود را ارسال کنید یا با شماره‌های تماس ما تماس بگیرید.",
  },
  {
    q: "زمان پاسخگویی شما چقدر است؟",
    a: "معمولاً تا 24 ساعت کاری پاسخ داده می‌شود.",
  },
  {
    q: "آیا خدمات پس از فروش هم ارائه می‌دهید؟",
    a: "بله، پشتیبانی فنی و خدمات پس از فروش بخشی از خدمات ماست.",
  },
]

const ContactPageSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [faqOpenIndex, setFaqOpenIndex] = useState(null)
  const [shouldAnimate, setShouldAnimate] = useState(true)


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formPayload = new URLSearchParams();
    formPayload.append("email", formData.email);
    formPayload.append(
      "message",
      `
        نام: ${formData.name}
        شماره تماس: ${formData.phone}
        موضوع: ${formData.subject}
        پیام: ${formData.message}
      `
    );

    try {
      const res = await fetch("https://formspree.io/f/mdkekzbb", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formPayload,
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("پیام شما با موفقیت ارسال شد");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(result?.errors?.[0]?.message || "ارسال پیام با مشکل مواجه شد");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsSubmitting(false);
    }
  };




  const toggleFaq = (index) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index)
  }

  useEffect(() => {
    const handleResize = () => {
      setShouldAnimate(window.innerWidth >= 640)
    }

    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <section className="w-full px-4 sm:px-8 py-16 text-right text-white font-sans">
      {/* هدر */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 40 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto mb-12 text-center"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#00e0ca] mb-4">
          تماس با ما
        </h1>
        <p className="text-base sm:text-lg max-w-3xl mx-auto text-gray-300">
          هر سوال یا پیشنهادی دارید، همین الان با ما تماس بگیرید. ما آماده‌ایم به شما کمک کنیم!
        </p>
      </motion.div>

      {/* فرم و اطلاعات تماس */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* فرم تماس */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 flex flex-col gap-4 md:gap-12 bg-[#121a1e] p-6 sm:p-8 rounded-2xl shadow-lg">
          <input
            type="text"
            name="name"
            placeholder="نام و نام خانوادگی"
            required
            value={formData.name}
            onChange={handleChange}
            className="bg-[#1c262d] border border-[#00e0ca]/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00e0ca]"
          />
          <input
            type="email"
            name="email"
            placeholder="ایمیل"
            required
            value={formData.email}
            onChange={handleChange}
            className="bg-[#1c262d] border border-[#00e0ca]/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00e0ca]"
          />
          <input
            type="tel"
            name="phone"
            placeholder="شماره تماس"
            value={formData.phone}
            onChange={handleChange}
            className="bg-[#1c262d] border border-[#00e0ca]/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00e0ca] text-end"
          />
          <input
            type="text"
            name="subject"
            placeholder="موضوع"
            required
            value={formData.subject}
            onChange={handleChange}
            className="bg-[#1c262d] border border-[#00e0ca]/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00e0ca]"
          />
          <textarea
            name="message"
            placeholder="پیام شما"
            rows={5}
            required
            value={formData.message}
            onChange={handleChange}
            className="bg-[#1c262d] border border-[#00e0ca]/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#00e0ca]"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#019297] via-[#73ED7C] to-[#019297] py-4 rounded-3xl font-bold text-black hover:scale-105 transition-transform duration-200 flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <svg
                className="animate-spin h-6 w-6 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            ) : (
              "ارسال پیام"
            )}
          </button>
        </form>

        {/* اطلاعات تماس + شبکه‌ها + سوالات متداول */}
        <div className="flex flex-col gap-10 bg-[#121a1e] p-6 sm:p-8 rounded-2xl shadow-lg">
          {/* اطلاعات تماس */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#00e0ca] mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 sm:w-7 sm:h-7" />
              اطلاعات تماس
            </h3>
            <ul className="space-y-4 text-gray-300 text-sm sm:text-base">
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#00e0ca]" />
                خراسان رضوی , کاشمر , خیابان چهارده معصوم
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#00e0ca]" />
                <a href="tel:+982112345678" className="hover:underline">
                  021-12345678
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#00e0ca]" />
                <a href="mailto:info@arkcompany.com" className="hover:underline">
                  info@arkcompany.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#00e0ca]" />
                شنبه تا پنجشنبه، ۹ صبح تا ۶ عصر
              </li>
            </ul>
          </div>

          {/* شبکه‌های اجتماعی */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#00e0ca] mb-4 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
              شبکه‌های اجتماعی
            </h3>
            <div className="flex gap-6 text-[#00e0ca]">
              <a href="#" className="hover:text-[#73ED7C] transition">
                <Twitter className="w-6 h-6 cursor-pointer" />
              </a>
              <a href="#" className="hover:text-[#73ED7C] transition">
                <Instagram className="w-6 h-6 cursor-pointer" />
              </a>
              <a href="#" className="hover:text-[#73ED7C] transition">
                <Linkedin className="w-6 h-6 cursor-pointer" />
              </a>
            </div>
          </div>

          {/* سوالات متداول */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#00e0ca] mb-4 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7" />
              سوالات متداول
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleFaq(idx)}
                  className="bg-[#1c262d] rounded-xl p-4 cursor-pointer select-none"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-base sm:text-lg font-semibold text-[#00e0ca]">{faq.q}</h4>
                    <span className="text-xl font-bold text-[#00e0ca]">
                      {faqOpenIndex === idx ? "-" : "+"}
                    </span>
                  </div>
                  {faqOpenIndex === idx && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 text-sm sm:text-base text-gray-300"
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactPageSection
