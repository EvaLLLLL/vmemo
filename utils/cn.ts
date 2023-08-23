import classNames, { Argument } from 'classnames'
import { twMerge } from 'tailwind-merge'

const cn = (...classes: Argument[]) => {
  return twMerge(classNames(...classes))
}

export default cn
