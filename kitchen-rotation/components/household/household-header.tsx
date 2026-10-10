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
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      )
    : null;

  return (
    <header className="rounded-lg border p-6">
      <p className="text-sm font-medium text-gray-500">Kitchen Rotation</p>

      <h1 className="mt-1 text-2xl font-bold">{name}</h1>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
        <p>
          {memberCount} {memberCount === 1 ? "member" : "members"}
        </p>

        <p>
          {formattedStartDate
            ? `Rotation starts ${formattedStartDate}`
            : "Rotation not configured yet"}
        </p>
      </div>
    </header>
  );
}
