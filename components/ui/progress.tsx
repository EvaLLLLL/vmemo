import {
  TooltipTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider
} from '@/components/ui/tooltip'
import React, { useEffect, useState } from 'react'

export const ProgressLine: React.FC<{
  label: string
  visualParts: {
    color: string
    percentage: string
    label: React.ReactNode
    tooltip: React.ReactNode
  }[]
}> = ({
  label,
  visualParts = [
    {
      label: '',
      percentage: '0%',
      color: 'white',
      tooltip: ''
    }
  ]
}) => {
  const [widths, setWidths] = useState(
    visualParts.map(() => {
      return '0%'
    })
  )

  useEffect(() => {
    requestAnimationFrame(() => {
      setWidths(
        visualParts.map((item) => {
          return item.percentage
        })
      )
    })
  }, [visualParts])

  return (
    <TooltipProvider>
      <div className="font-bold">{label}</div>
      <div className="my-5 flex h-6 overflow-hidden rounded-xl bg-white">
        {visualParts.map((item, index) => {
          return (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <div
                  style={{
                    width: widths[index],
                    height: 24,
                    backgroundColor: item.color
                  }}
                  className="text-center transition-[width] duration-200 last:rounded-r-xl">
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-white">
                {item.tooltip}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
