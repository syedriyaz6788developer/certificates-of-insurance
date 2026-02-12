import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../components/dashboard/Card";
import Table from "../components/dashboard/Table";
import { 
  selectSummaryStats, 
  fetchSummaryStats,
  selectLoading 
} from "../store/coiSlice";
import { Loader2 } from "lucide-react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonCard = () => (
  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <Skeleton width={100} height={18} className="mb-2" />
        <Skeleton width={50} height={28} />
      </div>
      <Skeleton circle width={36} height={36} />
    </div>
  </div>
);

export default function COIDashboard() {
  const dispatch = useDispatch();
  const stats = useSelector(selectSummaryStats);
  const loading = useSelector(selectLoading);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 640);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // Fetch stats on component mount
  useEffect(() => {
    dispatch(fetchSummaryStats());
  }, [dispatch]);

  useEffect(() => {
    const handleFocus = () => {
      dispatch(fetchSummaryStats());
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [dispatch]);

  if (loading && !stats?.total) {
    return (
      <div className="px-2 sm:px-3 md:px-4">
        <div className="p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {[...Array(4)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
        <div className="py-3">
          <div className="flex items-center justify-center h-48 sm:h-64">
            <div className="text-center">
              <Loader2 size={isMobileView ? 24 : 32} className="animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-gray-600">Loading table data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-3 md:px-4">
      <div className="p-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <Card
            title="Total COI Processed"
            value={stats?.total || 0}
            color="#EDF4FF"
            icon="/icons/card1.svg"
            isMobile={isMobileView}
          />

          <Card
            title="Active"
            value={stats?.active || 0}
            color="#E9FAF6"
            icon="/icons/card2.svg"
            isMobile={isMobileView}
          />

          <Card
            title="Rejected"
            value={stats?.rejected || 0}
            color="#FDF4F7"
            icon="/icons/card3.svg"
            isMobile={isMobileView}
          />

          <Card
            title={isMobileView ? "Expires in 30d" : "Expires in 30 days"}
            value={stats?.expiringIn30Days || 0}
            color="#FEEEEA"
            icon="/icons/card4.svg"
            isMobile={isMobileView}
          />
        </div>
      </div>
      <div className="py-3">
        <Table />
      </div>
    </div>
  );
}