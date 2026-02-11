// pages/COIDashboard.jsx
import React from "react";
import { useSelector } from "react-redux";
import Card from "../components/dashboard/Card";
import Table from "../components/dashboard/Table";
import { selectSummaryStats } from "../store/coiSlice";

export default function COIDashboard() {
  const stats = useSelector(selectSummaryStats);

  return (
    <div>
      <div className="p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card
            title="Total COI Processed"
            value={stats.total}
            color="#EDF4FF"
            icon="/icons/card1.svg"
          />

          <Card
            title="Accepted"
            value={stats.accepted}
            color="#E9FAF6"
            icon="/icons/card2.svg"
          />

          <Card
            title="Rejected"
            value={stats.rejected}
            color="#FDF4F7"
            icon="/icons/card3.svg"
          />

          <Card
            title="Expires in 30 days"
            value={stats.expiringIn30Days}
            color="#FEEEEA"
            icon="/icons/card4.svg"
          />
        </div>
      </div>
      <div className="py-3">
        <Table />
      </div>
    </div>
  );
}