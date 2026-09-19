"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');
    try {
      const scriptURL = 'https://script.google.com/macros/s/AKfycbxlZrmJH2N_9b4MK5LVtZc6OCQ6lT4CV8nmd4FTtHWvnrPoXCNywMZV0mvaDjrlGoZ6/exec';
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('timestamp', new Date().toISOString());
      
      const response = await fetch(scriptURL, { method: 'POST', body: formDataToSend });
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Họ và tên của bạn"
          required
          className="w-full px-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 text-sm transition-all outline-none"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Địa chỉ Email"
          required
          className="w-full px-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 text-sm transition-all outline-none"
        />
      </div>
      <input
        type="text"
        name="subject"
        value={formData.subject}
        onChange={handleInputChange}
        placeholder="Chủ đề (VD: Tư vấn gói Pro...)"
        required
        className="w-full px-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 text-sm transition-all outline-none"
      />
      <textarea
        rows={4}
        name="message"
        value={formData.message}
        onChange={handleInputChange}
        placeholder="Nội dung yêu cầu chi tiết..."
        required
        className="w-full px-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 text-sm transition-all outline-none resize-none"
      />

      {submitStatus === 'success' && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2.5 text-sm font-medium">
          <CheckCircle className="w-5 h-5 flex-shrink-0" /> Gửi thành công! Chúng tôi sẽ liên hệ lại.
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-2.5 text-sm font-medium">
          Đã có lỗi xảy ra trong quá trình gửi, vui lòng thử lại sau.
        </div>
      )}

      <Button type="submit" size="lg" className="w-full font-bold h-12 bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer rounded-xl transition-all shadow-lg shadow-indigo-600/30" disabled={isSubmitting}>
        {isSubmitting ? 'Đang gửi thông tin...' : 'Gửi đăng ký tư vấn ngay'}
        {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
      </Button>
    </form>
  );
}