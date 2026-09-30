import { LoginForm } from '@/components/auth/login-form';
export const metadata = { title: 'Đăng nhập', robots: { index: false, follow: false } };
export default function Page() {
  return <LoginForm />;
}
