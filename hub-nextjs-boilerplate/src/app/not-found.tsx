'use client';

import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Result
        status="404"
        title="404"
        subTitle="Halaman tidak ditemukan."
        extra={<Button type="primary" onClick={() => router.push('/home')}>Kembali ke Beranda</Button>}
      />
    </div>
  );
}
