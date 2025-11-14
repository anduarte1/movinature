import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingCardProps {
  booking: {
    _id: string;
    activity: {
      _id: string;
      title: string;
      location: string;
      images: string[];
    };
    date: number;
    startTime: string;
    status: string;
  };
}

export function BookingCard({ booking }: BookingCardProps) {
  const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col sm:flex-row items-stretch justify-between gap-6 rounded-xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-gray-100 dark:border-gray-800">
      <div
        className="w-full sm:w-1/3 bg-center bg-no-repeat aspect-video sm:aspect-auto bg-cover rounded-lg min-h-[200px]"
        style={{
          backgroundImage: `url('${booking.activity.images?.[0] || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop"}')`,
        }}
      />
      <div className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-1">
          <p className="text-green-600 dark:text-green-400 text-sm font-medium leading-normal">
            {booking.status}
          </p>
          <p className="text-gray-900 dark:text-white text-lg font-bold leading-tight">
            {booking.activity.title}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
            {booking.activity.location}
          </p>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            {formattedDate} - {booking.startTime}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 mt-auto pt-2">
          <Button
            asChild
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Link href={`/booking-confirmation?id=${booking._id}`}>
              View Details
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="bg-primary/20 hover:bg-primary/30 border-none"
          >
            <Link href={`/contact-host/${booking.activity._id}`}>
              Contact Host
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
