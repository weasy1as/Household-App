import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleHelp,
} from "lucide-react";

type Member = {
  id: string;
  displayName?: string;
  position: number;
  active: boolean;
};

type ResponsibilitySummaryProps = {
  members: Member[];
  rotationStartDate: string | null;
  rotationStartMemberId: string | null;
};

type Responsibility = {
  label: string;
  date: Date;
  member: Member | null;
};

function toDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getDaysBetween(start: Date, end: Date) {
  const startUtc = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

  return Math.round((endUtc - startUtc) / 86400000);
}

function getResponsibility(
  members: Member[],
  rotationStartDate: string | null,
  rotationStartMemberId: string | null,
  date: Date,
): Member | null {
  if (!rotationStartDate || !rotationStartMemberId) {
    return null;
  }

  const activeMembers = members
    .filter((member) => member.active)
    .sort((a, b) => a.position - b.position);

  const startMemberIndex = activeMembers.findIndex(
    (member) => member.id === rotationStartMemberId,
  );

  const daysSinceStart = getDaysBetween(toDate(rotationStartDate), date);

  if (
    activeMembers.length === 0 ||
    startMemberIndex === -1 ||
    daysSinceStart < 0
  ) {
    return null;
  }

  return activeMembers[
    (startMemberIndex + daysSinceStart) % activeMembers.length
  ];
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function ResponsibilitySummary({
  members,
  rotationStartDate,
  rotationStartMemberId,
}: ResponsibilitySummaryProps) {
  const today = new Date();

  const responsibilities: Responsibility[] = [-1, 0, 1].map((offset) => {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);

    return {
      label: offset === -1 ? "Yesterday" : offset === 0 ? "Today" : "Tomorrow",
      date,
      member: getResponsibility(
        members,
        rotationStartDate,
        rotationStartMemberId,
        date,
      ),
    };
  });

  const todayResponsibility = responsibilities[1];
  const rotationConfigured =
    Boolean(rotationStartDate) && Boolean(rotationStartMemberId);

  return (
    <section className="rounded-3xl border border-[#E7EAE2] bg-white p-5 shadow-[0_2px_12px_rgba(31,45,33,0.025)] sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#63806A]">
            <CalendarDays size={16} />
            <span>Daily rotation</span>
          </div>

          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#202A22] sm:text-2xl">
            Who&apos;s on kitchen duty?
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#7B847A]">
            Your household&apos;s daily responsibility overview.
          </p>
        </div>

        <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F0F4EC] text-[#315B40] sm:flex">
          <CheckCircle2 size={22} />
        </div>
      </div>

      {todayResponsibility.member && (
        <div className="mt-6 rounded-2xl bg-[#244C3A] p-5 text-white sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-emerald-100">
              Today&apos;s responsibility
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              Today
            </span>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-lg font-semibold text-white ring-1 ring-white/10">
              {getInitials(
                todayResponsibility.member.displayName?.trim() ||
                  `Member ${todayResponsibility.member.position}`,
              )}
            </div>

            <div className="min-w-0">
              <p className="break-words text-xl font-semibold tracking-tight sm:text-2xl">
                {todayResponsibility.member.displayName ||
                  `Member ${todayResponsibility.member.position}`}
              </p>
              <p className="mt-1 text-sm text-emerald-100/80">
                {formatDate(todayResponsibility.date)}
              </p>
            </div>
          </div>
        </div>
      )}

      {!rotationConfigured && (
        <div className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <CircleHelp className="mt-0.5 shrink-0 text-amber-700" size={20} />
          <div>
            <p className="font-medium text-amber-950">
              Your rotation needs setting up
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-800">
              Set a start date and choose the first member to see who is
              responsible each day.
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {responsibilities
          .filter((item) => item.label !== "Today")
          .map(({ label, date, member }) => (
            <div
              key={label}
              className="min-w-0 rounded-2xl border border-[#E9ECE5] bg-[#FAFBF8] p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-[#849083]">
                {label}
              </p>

              <p className="mt-1 text-sm text-[#687367]">{formatDate(date)}</p>

              <div className="mt-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8EFE5] text-xs font-semibold text-[#315B40]">
                {member
                  ? getInitials(
                      member.displayName?.trim() || `Member ${member.position}`,
                    )
                  : "—"}
              </div>

              <p className="mt-3 break-words text-sm font-semibold text-[#263329]">
                {member
                  ? member.displayName || `Member ${member.position}`
                  : "No assignment"}
              </p>
            </div>
          ))}

        <div className="col-span-2 flex items-center justify-between gap-3 rounded-2xl border border-dashed border-[#DCE3D8] p-4 sm:col-span-1">
          <div>
            <p className="text-sm font-semibold text-[#354737]">
              Fair rotation
            </p>
            <p className="mt-1 text-xs leading-5 text-[#849083]">
              One member per day, taking turns.
            </p>
          </div>
          <ArrowRight size={18} className="shrink-0 text-[#66806A]" />
        </div>
      </div>
    </section>
  );
}
