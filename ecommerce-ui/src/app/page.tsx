import { Suspense } from 'react';
import { Header } from "@/components/Header";
import { SearchPage } from "@/components/SearchPage";
import { LoadingGrid } from "@/components/LoadingGrid";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Suspense fallback={<LoadingGrid />}>
        <SearchPage />
      </Suspense>
    </div>
  );
};

export default Home;
