import { CalendarDays, CheckCircle2, CircleHelp } from "lucide-react";

type Member = {
  id: string;
  userId: string;
  displayName?: string;
  position: number;
  active: boolean;
};

type ResponsibilitySummaryProps = {
  members: Member[];
  rotationStartDate: string | null;
  rotationStartMemberId: string | null;
  currentUserId?: string;
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

function getMemberName(member: Member) {
  return member.displayName?.trim() || `Member ${member.position}`;
}

export default function ResponsibilitySummary({
  members,
  rotationStartDate,
  rotationStartMemberId,
  currentUserId,
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

  const isCurrentUserToday =
    todayResponsibility.member?.userId === currentUserId;

  const rotationConfigured =
    Boolean(rotationStartDate) && Boolean(rotationStartMemberId);

  return (
    <section className="rounded-3xl border border-[#E7EAE2] bg-white p-4 shadow-[0_4px_24px_rgba(31,45,33,0.04)] sm:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F0F4EC] text-[#315B40]">
          <CalendarDays size={21} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#63806A]">
            Daily rotation
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#202A22] sm:text-2xl">
            Kitchen responsibility
          </h2>
          <p className="mt-1 text-sm text-[#7B847A]">
            Who&apos;s taking care of things?
          </p>
        </div>
      </div>

      {/* Setup notice */}
      {!rotationConfigured && (
        <div className="mb-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3">
          <CircleHelp size={19} className="mt-0.5 shrink-0 text-amber-700" />
          <div>
            <p className="text-sm font-semibold text-amber-950">
              Rotation not configured
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-800">
              Set a start date and choose the first member to begin.
            </p>
          </div>
        </div>
      )}

      {/* Three-column schedule */}
      <div className="grid grid-cols-[0.85fr_1.3fr_0.85fr] items-stretch gap-2 sm:gap-3">
        {/* Yesterday */}
        {[responsibilities[0]].map(({ label, date, member }) => {
          const isCurrentUser = member?.userId === currentUserId;

          return (
            <div
              key={label}
              className={`flex min-w-0 flex-col items-center rounded-2xl border px-1.5 py-4 text-center sm:px-3 sm:py-5 ${
                isCurrentUser
                  ? "border-[#A9C9A5] bg-[#EAF4E8]"
                  : "border-[#E9ECE5] bg-[#FAFBF8]"
              }`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#849083] sm:text-xs">
                Yesterday
              </span>

              <span className="mt-1 text-xs text-[#7B847A] sm:text-sm">
                {date.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>

              <div className="mt-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D3E9D0] text-xs font-semibold text-[#315B40] sm:h-11 sm:w-11 sm:text-sm">
                {member ? getInitials(getMemberName(member)) : "—"}
              </div>

              <p className="mt-3 w-full break-words text-xs font-semibold leading-5 text-[#263329] sm:text-sm">
                {member ? getMemberName(member) : "Unassigned"}
              </p>

              {isCurrentUser && (
                <span className="mt-1 rounded-full bg-[#D3E9D0] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#315B40]">
                  Your turn
                </span>
              )}
            </div>
          );
        })}

        {/* Today — highlighted center card */}
        <div
          className={`relative flex min-w-0 flex-col items-center overflow-hidden rounded-2xl border px-2 py-5 text-center text-white shadow-[0_6px_18px_rgba(36,76,58,0.18)] sm:px-4 sm:py-6 ${
            isCurrentUserToday
              ? "border-[#D4AF37] bg-[#244C3A] ring-1 ring-[#D4AF37]/30"
              : "border-transparent bg-[#244C3A]"
          }`}
        >
          {/* Decorative circle */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full border border-white/[0.10]" />

          {/* Today badge */}
          <div
            className={`relative flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wider sm:text-[10px] ${
              isCurrentUserToday
                ? "bg-[#D4AF37] text-[#244C3A]"
                : "bg-white/15 text-[#E4F0E3]"
            }`}
          >
            <CheckCircle2 size={12} />
            {isCurrentUserToday ? "Your turn" : "Today"}
          </div>

          <span className="relative mt-2 text-xs text-[#D4E4D4] sm:text-sm">
            {formatDate(todayResponsibility.date)}
          </span>

          {/* Member avatar */}
          <div
            className={`relative mt-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-sm font-semibold sm:h-16 sm:w-16 sm:text-lg ${
              isCurrentUserToday
                ? "border-[#D4AF37]/50 bg-white/10 text-[#F2D675]"
                : "border-white/20 bg-white/10 text-white"
            }`}
          >
            {todayResponsibility.member ? (
              getInitials(getMemberName(todayResponsibility.member))
            ) : (
              <CircleHelp size={23} />
            )}
          </div>

          {/* Member name */}
          <p className="relative mt-3 w-full break-words text-sm font-bold leading-5 sm:text-base">
            {todayResponsibility.member
              ? getMemberName(todayResponsibility.member)
              : "Unassigned"}
          </p>

          {/* Assignment status */}
          <p
            className={`relative mt-2 text-[10px] leading-4 sm:text-xs ${
              isCurrentUserToday
                ? "font-semibold text-[#F2D675]"
                : "text-[#D4E4D4]"
            }`}
          >
            {isCurrentUserToday
              ? "You're responsible today"
              : todayResponsibility.member
                ? "On duty"
                : "No assignment yet"}
          </p>
        </div>

        {/* Tomorrow */}
        {[responsibilities[2]].map(({ label, date, member }) => {
          const isCurrentUser = member?.userId === currentUserId;

          return (
            <div
              key={label}
              className={`flex min-w-0 flex-col items-center rounded-2xl border px-1.5 py-4 text-center sm:px-3 sm:py-5 ${
                isCurrentUser
                  ? "border-[#A9C9A5] bg-[#EAF4E8]"
                  : "border-[#E9ECE5] bg-[#FAFBF8]"
              }`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#849083] sm:text-xs">
                Tomorrow
              </span>

              <span className="mt-1 text-xs text-[#7B847A] sm:text-sm">
                {date.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>

              <div className="mt-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8EFE5] text-xs font-semibold text-[#315B40] sm:h-11 sm:w-11 sm:text-sm">
                {member ? getInitials(getMemberName(member)) : "—"}
              </div>

              <p className="mt-3 w-full break-words text-xs font-semibold leading-5 text-[#263329] sm:text-sm">
                {member ? getMemberName(member) : "Unassigned"}
              </p>

              {isCurrentUser && (
                <span className="mt-1 rounded-full bg-[#D3E9D0] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#315B40]">
                  Your turn
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center gap-2 border-t border-[#E9ECE5] pt-4 text-xs leading-5 text-[#849083]">
        <CalendarDays size={15} className="shrink-0 text-[#63806A]" />
        <p>Responsibility rotates automatically every day.</p>
      </div>
    </section>
  );
}
