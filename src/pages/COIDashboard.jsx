import React from "react";
import Card from "../components/dashboard/Card";

export default function COIDashboard() {
  return (
    <div className="p-4">
      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-4 
        gap-3
      ">
        <Card
          title="Total COI Processed"
          value={512}
          color="#EDF4FF"
          icon="/icons/card1.svg"
        />

        <Card
          title="Accepted"
          value={480}
          color="#E9FAF6"
          icon="/icons/card2.svg"
        />

        <Card
          title="Rejected"
          value={512}
          color="#FDF4F7"
          icon="/icons/card3.svg"
        />

        <Card
          title="Expires in 30 days"
          value={21}
          color="#FEEEEA"
          icon="/icons/card4.svg"
        />
      </div>
    </div>
  );
}
