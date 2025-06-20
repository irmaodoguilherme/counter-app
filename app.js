const buttons = [...document.querySelectorAll('[data-button]')]
const body = document.body

const sumOne = value => value + 1
const subtractOne = value => value - 1
const getZero = () => 0
const getRandomIntFromOneToNine = () => Math.ceil((Math.random() * 9))

const interactionController = (() => {
    let hasInteracted = false

    const registerInteraction = () => hasInteracted = true
    const getInteraction = () => hasInteracted

    return { registerInteraction, getInteraction }
})()

const updateCounter = (counter, operation) =>
    counter.textContent = operation(Number(counter.textContent))

const manipulateCounter = operation => {
    const counter = document.querySelector('[data-span=counter]')

    counter.classList.add('fade')

    setTimeout(() => {
        updateCounter(counter, operation)
        counter.classList.remove('fade')
    }, 150)
}

const getCounterFunc = funcName => {
    const counterFuncs = {
        'increment-counter': () => manipulateCounter(sumOne),
        'decrement-counter': () => manipulateCounter(subtractOne),
        'reset-counter': () => manipulateCounter(getZero)
    }

    return counterFuncs[funcName]
}

const getSound = number => {
    const sounds = {
        'click01': './src/sounds/click01.wav',
        'click02': './src/sounds/click02.wav',
        'click03': './src/sounds/click03.wav',
        'click04': './src/sounds/click04.wav',
        'click05': './src/sounds/click05.wav',
        'click06': './src/sounds/click06.wav',
        'click07': './src/sounds/click07.wav',
        'click08': './src/sounds/click08.wav',
        'click09': './src/sounds/click09.wav',
        'hover': './src/sounds/hover.mp3'
    }

    const clickSoundUrl = number ? sounds[`click0${number}`] : undefined
    const hoverSoundUrl = sounds['hover']

    return new Audio(clickSoundUrl || hoverSoundUrl)
}

const playSound = sound => {
    sound.currentTime = 0
    sound.play()
}

const handlePlaySound = (isClickable = false) => {
    const hasInteracted = interactionController.getInteraction()

    if (!hasInteracted) {
        return
    }

    const randomNumber = isClickable ? getRandomIntFromOneToNine() : undefined
    const sound = getSound(randomNumber)
    playSound(sound)
}

const handleButtonClick = e => {
    const funcName = e.target.dataset.button
    handlePlaySound(true)
    getCounterFunc(funcName)()
}

const handleMouseenterEvent = () => () => handlePlaySound(false)

const focusNextButton = (forward = false, buttonContainer) => {
    const availableButtons = [...buttonContainer.children].map(child => child.children[0])
    const focusableButtons = availableButtons.filter(button => button.tabIndex === 0)
    const currentFocusedElement = document.activeElement
    const currentIndex = focusableButtons.indexOf(currentFocusedElement)
    const lastIndex = (focusableButtons.length - 1)
    const previousIndex = subtractOne(currentIndex)
    const nextIndex = sumOne(currentIndex)
    const isCurrentLastIndex = currentIndex === lastIndex
    const isCurrentFirstIndex = currentIndex <= 0

    const nextIndexToBeFocused = forward
        ? (isCurrentLastIndex ? 0 : nextIndex)
        : (isCurrentFirstIndex ? lastIndex : previousIndex)

    focusableButtons[nextIndexToBeFocused].focus()
}

const focusTrap = (e, buttonContainer) => {
    const isPressedKeyTab = e.key === 'Tab'
    const isPressedKeyArrowRight = e.key === 'ArrowRight'
    const isPressedKeyArrowLeft = e.key === 'ArrowLeft'
    const isKeyShiftPressed = e.shiftKey

    if (isPressedKeyTab && !isKeyShiftPressed || isPressedKeyArrowRight) {
        e.preventDefault()
        focusNextButton(true, buttonContainer)
        handlePlaySound(false)
        return
    }

    if (isPressedKeyTab && isKeyShiftPressed || isPressedKeyArrowLeft) {
        e.preventDefault()
        focusNextButton(undefined, buttonContainer)
        handlePlaySound(false)
    }
}

const handleKeydown = e => {
    const pressedKey = e.key
    const availableKeys = ['Tab', 'ArrowRight', 'ArrowLeft']
    const isPressedKeyAvailable = availableKeys.includes(pressedKey)

    const buttonContainer = document.querySelector('[data-container=button]')
    const isButtonContainerFocused = buttonContainer.contains(document.activeElement)

    if (!isPressedKeyAvailable || !isButtonContainerFocused) {
        return
    }

    interactionController.registerInteraction()
    focusTrap(e, buttonContainer)
}

buttons.forEach(button => {
    button.addEventListener('click', handleButtonClick)
    button.addEventListener('mouseenter', handleMouseenterEvent())
})

body.addEventListener('keydown', handleKeydown)
window.addEventListener('click', interactionController.registerInteraction)