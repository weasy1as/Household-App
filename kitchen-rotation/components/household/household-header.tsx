import { CalendarDays, House, Users } from "lucide-react";

type HouseholdHeaderProps = {
  name: string;
  memberCount: number;
  rotationStartDate: string | null;
};

export default function HouseholdHeader({
  name,
  memberCount,
  rotationStartDate,
}: HouseholdHeaderProps) {
  const formattedStartDate = rotationStartDate
    ? new Date(`${rotationStartDate.slice(0, 10)}T12:00:00`).toLocaleDateString(
        undefined,
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      )
    : null;

  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#244C3A] to-[#163729] p-6 text-white shadow-sm sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-white/[0.06]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/[0.04]"
      />

      <div className="relative">
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-100">
          <House size={16} strokeWidth={2} />
          <span>Your household</span>
        </div>

        <h1 className="mt-4 break-words text-3xl font-semibold tracking-tight sm:text-4xl">
          {name}
        </h1>

        <p className="mt-2 max-w-md text-sm leading-6 text-emerald-100/80">
          Your shared space, your shared responsibilities.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5">
            <Users size={16} className="text-emerald-200" />
            <span className="text-sm font-medium">
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5">
            <CalendarDays size={16} className="text-emerald-200" />
            <span className="text-sm font-medium">
              {formattedStartDate
                ? `Started ${formattedStartDate}`
                : "Rotation not set"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
