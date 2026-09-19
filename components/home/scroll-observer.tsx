"use client";

import { useEffect } from "react";

export function ScrollObserver() {
  useEffect(() => {
    const fadeElements = document.querySelectorAll(".scroll-fade-section");
    
    // Chỉ thêm class ẩn khi JS đã tải trên trình duyệt khách (Bot SEO sẽ không chạy đoạn này)
    fadeElements.forEach((el) => {
      el.classList.add("opacity-0", "translate-y-10");
    });

    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-10");
          observer.unobserve(entry.target); // Ngừng theo dõi sau khi đã hiện
        }
      });
    }, observerOptions);

    fadeElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}