import { CalendarDays, CheckCircle2, ClipboardList } from "lucide-react";

type CleaningDay = {
  date: string;
  memberId: string;
  userId: string;
  displayName: string;
  position: number;
};

type CleaningScheduleProps = {
  schedule: CleaningDay[];
};

function parseDate(date: string) {
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date: string) {
  return parseDate(date).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
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

function isToday(date: string) {
  const value = parseDate(date);
  const today = new Date();

  return (
    value.getFullYear() === today.getFullYear() &&
    value.getMonth() === today.getMonth() &&
    value.getDate() === today.getDate()
  );
}

export default function CleaningSchedule({ schedule }: CleaningScheduleProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#E7EAE2] bg-white shadow-[0_2px_12px_rgba(31,45,33,0.025)]">
      <div className="flex items-start justify-between gap-3 p-5 sm:p-7">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#63806A]">
            <ClipboardList size={16} />
            <span>Coming up</span>
          </div>

          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#202A22] sm:text-2xl">
            Cleaning schedule
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#7B847A]">
            Everyone knows when it&apos;s their turn.
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F0F4EC] text-[#315B40]">
          <CalendarDays size={21} />
        </div>
      </div>

      {schedule.length === 0 ? (
        <div className="px-5 pb-7 sm:px-7">
          <div className="rounded-2xl border border-dashed border-[#DCE3D8] bg-[#FAFBF8] px-5 py-9 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8EFE5] text-[#315B40]">
              <CalendarDays size={23} />
            </div>

            <h3 className="mt-4 font-semibold text-[#263329]">
              No schedule yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#7B847A]">
              Set your rotation start date and starting member to generate your
              household&apos;s cleaning schedule.
            </p>
          </div>
        </div>
      ) : (
        <div className="px-3 pb-3 sm:px-5 sm:pb-5">
          <div className="mb-2 flex items-center justify-between px-3 text-xs font-semibold uppercase tracking-wider text-[#92998F]">
            <span>Day & responsibility</span>
            <span>{schedule.length} days</span>
          </div>

          <ul className="space-y-1">
            {schedule.map((day) => {
              const today = isToday(day.date);

              return (
                <li
                  key={day.date}
                  className={`flex items-center gap-3 rounded-2xl p-3 transition-colors sm:gap-4 sm:p-4 ${
                    today
                      ? "border border-[#D6E5D3] bg-[#F0F5EC]"
                      : "border border-transparent hover:bg-[#F8F9F6]"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl ${
                      today
                        ? "bg-[#244C3A] text-white"
                        : "bg-[#F0F2EC] text-[#536553]"
                    }`}
                  >
                    <span className="text-[10px] font-semibold uppercase">
                      {parseDate(day.date).toLocaleDateString(undefined, {
                        month: "short",
                      })}
                    </span>
                    <span className="text-lg font-semibold leading-5">
                      {parseDate(day.date).getDate()}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-semibold text-[#263329] sm:text-base">
                      {formatDate(day.date)}
                    </p>
                    <p className="mt-1 truncate text-sm text-[#7B847A]">
                      {day.displayName}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {today && (
                      <span className="hidden items-center gap-1 rounded-full bg-[#DDEBDD] px-2.5 py-1 text-xs font-semibold text-[#315B40] sm:inline-flex">
                        <CheckCircle2 size={13} />
                        Today
                      </span>
                    )}

                    <div
                      aria-label={`Member ${day.position}`}
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${
                        today
                          ? "bg-[#D6E5D3] text-[#244C3A]"
                          : "bg-[#EEF0EA] text-[#687367]"
                      }`}
                    >
                      {getInitials(day.displayName || `Member ${day.position}`)}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
