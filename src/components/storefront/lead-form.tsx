'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, type LeadInput } from '@/features/leads/schema';
import { captureAttribution } from '@/features/leads/attribution';
export function LeadForm({
  product = '',
  type = 'contact',
}: {
  product?: string;
  type?: LeadInput['type'];
}) {
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      company: '',
      province: '',
      message: '',
      product_id: product,
      type,
      website: '',
      landing_page: '',
      referrer: '',
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_content: '',
      utm_term: '',
    },
  });
  async function submit(input: LeadInput) {
    setMessage('');
    Object.assign(input, captureAttribution());
    try {
      const r = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const result = await r.json();
      if (!r.ok) {
        setMessage(result.error || 'Không thể gửi. Vui lòng thử lại.');
        return;
      }
      setDone(true);
    } catch {
      setMessage('Mất kết nối. Vui lòng thử lại.');
    }
  }
  if (done)
    return (
      <div className="form-success" role="status">
        <h2>Đã nhận yêu cầu của bạn</h2>
        <p>Thông tin đã được chuyển đến đội ngũ Quốc Hưng.</p>
      </div>
    );
  return (
    <form className="form-card" onSubmit={handleSubmit(submit)} noValidate>
      <h2>
        {type === 'survey'
          ? 'Yêu cầu khảo sát'
          : type === 'quote'
            ? 'Nhận báo giá'
            : 'Trao đổi nhu cầu của bạn'}
      </h2>
      <div className="form-grid">
        {[
          ['name', 'Họ và tên *'],
          ['phone', 'Điện thoại *'],
          ['email', 'Email'],
          ['company', 'Công ty'],
          ['province', 'Tỉnh / thành phố'],
        ].map(([key, label]) => (
          <label key={key}>
            {label}
            <input
              type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
              autoComplete={
                key === 'name'
                  ? 'name'
                  : key === 'phone'
                    ? 'tel'
                    : key === 'email'
                      ? 'email'
                      : key === 'company'
                        ? 'organization'
                        : 'address-level1'
              }
              {...register(key as keyof LeadInput)}
              aria-invalid={!!errors[key as keyof LeadInput]}
            />
            {errors[key as keyof LeadInput] && (
              <span className="form-error">{errors[key as keyof LeadInput]?.message}</span>
            )}
          </label>
        ))}
      </div>
      <label>
        Nhu cầu của bạn *
        <textarea
          {...register('message')}
          placeholder="Loại hàng cần cân, tải trọng, môi trường sử dụng..."
        />
        {errors.message && <span className="form-error">{errors.message.message}</span>}
      </label>
      <input
        {...register('website')}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: -10000, width: 1 }}
      />
      <label>
        <input type="checkbox" {...register('consent')} />
        Tôi đồng ý để Quốc Hưng sử dụng thông tin này để phản hồi yêu cầu theo{' '}
        <a href="/chinh-sach-bao-mat" target="_blank">
          chính sách bảo mật
        </a>
        .
      </label>
      {errors.consent && <p className="form-error">{errors.consent.message}</p>}
      {message && (
        <p className="notice" role="alert">
          {message}
        </p>
      )}
      <button className="button button-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn ↗'}
      </button>
    </form>
  );
}
