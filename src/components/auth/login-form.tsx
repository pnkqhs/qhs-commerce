'use client';
import { useActionState } from 'react';
import { login } from '@/features/auth/actions';
export function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: '' });
  return (
    <form action={action} className="form-card auth-card">
      <p className="eyebrow">QHS COMMERCE</p>
      <h1>Đăng nhập tài khoản</h1>
      <label>
        Email
        <input type="email" name="email" required autoComplete="email" />
      </label>
      <label>
        Mật khẩu
        <input
          type="password"
          name="password"
          minLength={8}
          required
          autoComplete="current-password"
        />
      </label>
      {state.error && (
        <p className="notice" role="alert">
          {state.error}
        </p>
      )}
      <button disabled={pending} className="button button-primary">
        {pending ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
      <p className="muted" style={{ marginTop: 20, fontSize: 12 }}>
        Tài khoản được cấp trong Supabase Auth riêng của QHS Commerce. Liên hệ quản trị viên nếu cần
        hỗ trợ truy cập.
      </p>
    </form>
  );
}
