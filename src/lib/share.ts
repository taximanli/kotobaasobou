import { getGuessStatuses } from './statuses'
import { solutionIndex, unicodeSplit } from './words'
import { GAME_TITLE, GAME_LINK } from '../constants/strings'
import { MAX_CHALLENGES } from '../constants/settings'
import { UAParser } from 'ua-parser-js'
import { loadShareStatusFromLocalStorage } from '../lib/localStorage'
import { shareStatusType } from '../components/modals/StatsModal'

const webShareApiDeviceTypes: string[] = ['mobile', 'smarttv', 'wearable']
const parser = new UAParser()
const browser = parser.getBrowser()
const device = parser.getDevice()

export const shareStatus = (
  shareStatusType: shareStatusType,
  guesses: string[],
  lost: boolean,
  isHintMode: boolean,
  isHardMode: boolean,
  isDarkMode: boolean,
  isHighContrastMode: boolean,
  handleShareToClipboard: () => void
) => {
  const endOfLine = (shareStatusType === 'tweet' ? '%0A' : '\n')
  const loaded = loadShareStatusFromLocalStorage()

  if (loaded) {
    isHintMode = loaded.isHintMode
    isHardMode = loaded.isHardMode
  }

  const textToShare = 
  `${GAME_TITLE} ${solutionIndex} ${
    lost ? 'X' : guesses.length
  }/${MAX_CHALLENGES}${isHardMode ? '*' : ''}${isHintMode ? '?' : ''}` + endOfLine +
  `${GAME_LINK}` + endOfLine +
    generateEmojiGrid(endOfLine, guesses, getEmojiTiles(isDarkMode, isHighContrastMode))

  if (shareStatusType === 'tweet') {
    window.open("https://twitter.com/intent/tweet?text=" + textToShare, "_blank")
  }
  else
  if (shareStatusType === 'clipboard') {
    const shareData = { text: textToShare }

    let shareSuccess = false
  
    try {
      if (attemptShare(shareData)) {
        navigator.share(shareData)
        shareSuccess = true
      }
    } catch (error) {
      shareSuccess = false
    }
  
    if (!shareSuccess) {
      navigator.clipboard.writeText(textToShare)
      handleShareToClipboard()
    }
  }
  else
  {
    return textToShare
  }
}

export const generateEmojiGrid = (endOfLine: string, guesses: string[], tiles: string[]) => {
  return guesses
    .map((guess) => {
      const status = getGuessStatuses(guess)
      const splitGuess = unicodeSplit(guess)

      return splitGuess
        .map((_, i) => {
          switch (status[i]) {
            case 'correct':
              return tiles[0]
            case 'present':
              return tiles[1]
            case 'close':
              return tiles[2]
            case 'consonant-correct':
              return tiles[3]
            case 'vowel-correct':
              return tiles[4]
            case 'consonant-present':
              return tiles[3]
            case 'vowel-present':
              return tiles[4]
            default:
              return tiles[5]
          }
        })
        .join('')
    })
    .join(endOfLine)
}

const attemptShare = (shareData: object) => {
  return (
    // Deliberately exclude Firefox Mobile, because its Web Share API isn't working correctly
    browser.name?.toUpperCase().indexOf('FIREFOX') === -1 &&
    webShareApiDeviceTypes.indexOf(device.type ?? '') !== -1 &&
    navigator.canShare &&
    navigator.canShare(shareData) &&
    navigator.share
  )
}

const getEmojiTiles = (isDarkMode: boolean, isHighContrastMode: boolean) => {
  let tiles: string[] = []
  tiles.push(isHighContrastMode ? '🟧' : '🟩') // correct
  tiles.push(isHighContrastMode ? '🟦' : '🟨') // present
  tiles.push(isHighContrastMode ? '🟣' : '🟢') // close
  tiles.push('↕️') // consonant
  tiles.push('↔️') // vowel
  tiles.push(isDarkMode ? '⬛' : '⬜') // absent
  return tiles
}
