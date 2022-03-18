import { ReactNode } from 'react'
import classnames from 'classnames'
import { CharStatus } from '../../lib/statuses'
import { MAX_WORD_LENGTH, REVEAL_TIME_MS } from '../../constants/settings'

type Props = {
  children?: ReactNode
  value: string
  width?: number
  status?: CharStatus
  onClick: (value: string) => void
  isRevealing?: boolean
}

export const Key = ({
  children,
  status,
  width = 40,
  value,
  onClick,
  isRevealing,
}: Props) => {
  const keyDelayMs = REVEAL_TIME_MS * MAX_WORD_LENGTH

  const dummyKeyClasses = classnames(
    'w-10 h-7 xs:h-8 sm:h-10 rounded mx-0.5 select-none'
  )

  const keyClasses = classnames(
    'w-10 h-7 xs:h-8 sm:h-10 flex items-center justify-center rounded mx-0.5 text-lg sm:text-xl local-font font-bold cursor-pointer select-none dark:text-white',
    {
      'transition ease-in-out': isRevealing,
      'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 active:bg-slate-400':
        !status,
      'absent key-bg':
        status === 'absent',
      'correct key-bg':
        status === 'correct',
      'present key-bg':
        status === 'present',
      'close key-bg':
        status === 'close',
      'consonant correct key-bg':
        status === 'consonant-correct',
      'vowel correct key-bg':
        status === 'vowel-correct',
      'consonant present key-bg':
        status === 'consonant-present',
      'vowel present key-bg':
        status === 'vowel-present',
    }
  )

  const styles = {
    transitionDelay: isRevealing ? `${keyDelayMs}ms` : 'unset',
    // width: `${width}px`,
    // height: `${width}px`,
  }

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick(value)
    event.currentTarget.blur()
  }

  if (value === '') {
    return (
      <button style={styles} className={dummyKeyClasses}>
        {children || value}
      </button>
    )      
  } else {
    return (
      <button style={styles} className={keyClasses} onClick={handleClick}>
        {children || value}
      </button>
    )  
  }

}
