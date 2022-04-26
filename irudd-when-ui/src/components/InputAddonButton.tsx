import { SyntheticEvent } from 'react'
import IconForButton, { ButtonIconType } from './IconForButton'

export default function InputAddonButton({iconType, buttonType, testId, onClick, isDisabled}: InputAddonButtonProperties) {
    let buttonClasses = `btn btn-outline-${buttonType} d-flex justify-content-center align-items-center`
    return (
        <button className={buttonClasses} type="button" data-testid={testId} onClick={onClick} disabled={isDisabled}>
            <IconForButton iconType={iconType} />
        </button>)
}

interface InputAddonButtonProperties extends ButtonIconType {
    buttonType: 'danger' | 'secondary'
    testId?: string
    onClick?: (e: SyntheticEvent) => void
    isDisabled?:boolean
}