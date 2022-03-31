import classnames from 'classnames'
import Countdown from 'react-countdown'
import { DateTime } from 'luxon'
import { StatBar } from '../stats/StatBar'
import { Histogram } from '../stats/Histogram'
import { GameStats, getStoredIsHighContrastMode, getStoredDisplayLanguage, getStoredTimezone } from '../../lib/localStorage'
import { shareStatus } from '../../lib/share'
import { yesterdaySolution, yesterdaySolutionIndex, solutionIndex, tomorrow } from '../../lib/words'
import { BaseModal } from './BaseModal'
import { t, JOTOBA_SEARCH_LINK } from '../../constants/strings';
import { PREFERRED_DISPLAY_LANGUAGE } from '../../constants/settings'
import coffeeLogo from '../../images/ko-fi-com-taximanli.png';

export type shareStatusType = 'text' | 'clipboard' | 'tweet'

type Props = {
  isOpen: boolean
  handleClose: () => void
  guesses: string[]
  gameStats: GameStats
  isGameLost: boolean
  isGameWon: boolean
  handleShareToClipboard: () => void
  isHintMode: boolean
  isHardMode: boolean
  isDarkMode: boolean
  isHighContrastMode: boolean
  numberOfGuessesMade: number
}

export const StatsModal = ({
  isOpen,
  handleClose,
  guesses,
  gameStats,
  isGameLost,
  isGameWon,
  handleShareToClipboard,
  isHintMode,
  isHardMode,
  isDarkMode,
  isHighContrastMode,
  numberOfGuessesMade,
}: Props) => {
  const isHighContrast = getStoredIsHighContrastMode()
  const displayLanguage = getStoredDisplayLanguage()
  const timezone = getStoredTimezone()

  const now = DateTime.now().setZone(timezone)

  let statsModalTitle = ''

  if (displayLanguage === PREFERRED_DISPLAY_LANGUAGE) {
    statsModalTitle = now.setLocale('ja-JP').toLocaleString(DateTime.DATE_FULL) + ' 第' + solutionIndex.toString() + '回'
  } else {
    statsModalTitle = 'Game #' + solutionIndex.toString() + ' on ' + now.setLocale('en-US').toLocaleString(DateTime.DATE_FULL)
  }

  const linkClassName = classnames((isHighContrast ? 'text-orange-600' : 'text-green-600'), 'underline text-sm')
  const classNames = classnames(
    'mt-1 w-full rounded-md border border-transparent shadow-sm px-4 py-2 local-font text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm',
    {
      'bg-orange-500 hover:bg-orange-600 focus:ring-orange-400': isHighContrast,
      'bg-green-500 hover:bg-green-600 focus:ring-green-400': !isHighContrast,
    }
  )

  if (gameStats.totalGames <= 0) {
    return (
      <BaseModal
        title={statsModalTitle}
        isOpen={isOpen}
        handleClose={handleClose}
      >
        <h4 className="local-font text-base leading-6 font-medium text-gray-900 dark:text-gray-100">
          {t('STATISTICS_TITLE')}
        </h4>
        <StatBar gameStats={gameStats} />
      </BaseModal>
    )
  }
  return (
    <BaseModal
      title={statsModalTitle}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <div className="flex gap-1 justify-center dark:text-white mx-1">
        <div>
          <h5>{t('NEW_WORD_TEXT')}</h5>
        </div>
        <div>
          <Countdown
            className="local-font text-baseline font-medium text-gray-900 dark:text-gray-100"
            date={tomorrow}
            daysInHours={true}
          />
        </div>
      </div>
      {(isGameLost || isGameWon) && (
      <div className="flex gap-1 justify-center text-sm dark:text-white mx-1">
        {t('YESTERDAY_CORRECT_WORD_MESSAGE', yesterdaySolutionIndex.toString())}
        <a className="underline text-sm text-gray-600 dark:text-gray-300 cursor-zoom-in" href={(JOTOBA_SEARCH_LINK + yesterdaySolution)} rel="noreferrer" target="_blank">{yesterdaySolution}</a>
      </div>
      )}
      <div className="flex justify-between items-center gap-3 mt-3">
        <p className="text-left text-sm dark:text-white">
          {t('If you love this game')}<br />{t('Please consider')}
          {' '}<a className={linkClassName} href={t('KOFI_LINK')} rel="noreferrer" target="_blank">{t('can you treat me')}</a>{' '}
          {t('please?')}
        </p>
        <img className="w-9 h-9 wiggle cursor-pointer" src={coffeeLogo} title={t('Buy me a coffee?')} alt={t('Buy me a coffee?')} onClick={()=> window.open(t('KOFI_LINK'), "_blank")} />
      </div>
      {(isGameLost || isGameWon) && (
        <div>
          <div className="mt-4 sm:mt-5 mb-1 dark:text-white mx-1">
            <textarea className="local-font text-xs w-full border-solid border-2 rounded bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-600" rows={5}
              value={shareStatus(
                  'text',
                  guesses,
                  isGameLost,
                  isHintMode,
                  isHardMode,
                  isDarkMode,
                  isHighContrastMode,
                  handleShareToClipboard
              )} />          
          </div>
          <div className="mb-5 sm:mb-6 grid grid-cols-2 gap-3 dark:text-white mx-1">
            <div>
              <button
                type="button"
                className={classNames}
                onClick={() => {
                  shareStatus(
                    'clipboard',
                    guesses,
                    isGameLost,
                    isHintMode,
                    isHardMode,
                    isDarkMode,
                    isHighContrastMode,
                    handleShareToClipboard
                  )
                }}
              >
                {t('SHARE_TEXT')}
              </button>
            </div>
            <div>
              <button
                type="button"
                className={classNames}
                onClick={() => {
                  shareStatus(
                    'tweet',
                    guesses,
                    isGameLost,
                    isHintMode,
                    isHardMode,
                    isDarkMode,
                    isHighContrastMode,
                    handleShareToClipboard
                  )                  
                }}
              >
                {t('TWEET_TEXT')}
              </button>
            </div>
          </div>
        </div>
      )}
      <hr className="mt-4 mb-4" />
      <h4 className="local-font text-base leading-6 font-medium text-gray-900 dark:text-gray-100">
        {t('STATISTICS_TITLE')}
      </h4>
      <StatBar gameStats={gameStats} />
      <h4 className="local-font text-base leading-6 font-medium text-gray-900 dark:text-gray-100">
        {t('GUESS_DISTRIBUTION_TEXT')}
      </h4>
      <Histogram
        gameStats={gameStats}
        numberOfGuessesMade={numberOfGuessesMade}
      />
    </BaseModal>
  )
}
