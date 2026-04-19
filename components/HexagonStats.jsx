"use client"

import {
  Radar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from "recharts"

export default function HexagonStats({ stats }) {
  const data = [
    { skill: "Networking", value: stats.networking },
    { skill: "Hardware", value: stats.hardware },
    { skill: "Logic", value: stats.logic },
    { skill: "Trouble", value: stats.troubleshooting },
    { skill: "Problem", value: stats.problemSolving },
    { skill: "Consistency", value: stats.consistency },
  ]

  return (
    <div className="">
      <h3 className="text-lg font-semibold text-slate-900 ">
        Skill Statistics
      </h3>

      <div className="w-full h-[200px]">
        <ResponsiveContainer>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis domain={[0, 100]} />

            <Radar
              dataKey="value"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}