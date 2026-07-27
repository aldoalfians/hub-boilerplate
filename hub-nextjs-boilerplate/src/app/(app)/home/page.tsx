import { Suspense } from 'react';
import HomePage from '@/pages/HomePage';

export default function HomeRoute() {
  return (
    <Suspense>
      <HomePage />
    </Suspense>
  );
}
