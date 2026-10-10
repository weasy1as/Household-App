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

function formatDate(date: string) {
  // Use a date-only value to avoid timezone shifts.
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export default function CleaningSchedule({ schedule }: CleaningScheduleProps) {
  return (
    <section className="rounded-lg border p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Cleaning schedule</h2>
        <p className="mt-1 text-sm text-gray-600">
          See who is responsible for cleaning the kitchen each day.
        </p>
      </div>

      {schedule.length === 0 ? (
        <p className="text-sm text-gray-600">
          No cleaning schedule yet. Configure the rotation start date and
          starting member to get started.
        </p>
      ) : (
        <ul className="divide-y">
          {schedule.map((day) => (
            <li
              key={day.date}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div>
                <p className="font-medium">{formatDate(day.date)}</p>
                <p className="text-sm text-gray-600">{day.displayName}</p>
              </div>

              <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                Member {day.position}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
