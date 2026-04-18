import BadgeCard from "./BadgeCard"

export default function BadgeGrid({ data }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {data.map((item) => (
        <BadgeCard key={item.id} {...item} />
      ))}
    </div>
  )
}