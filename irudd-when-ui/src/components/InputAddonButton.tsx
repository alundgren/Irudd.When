import IconForButton, { ButtonIconType } from './IconForButton'

export default function InputAddonButton({iconType, buttonType}: InputAddonButtonProperties) {
    let buttonClasses = `btn btn-outline-${buttonType} d-flex justify-content-center align-items-center`
    return (
        <button className={buttonClasses} type="button">
            <IconForButton iconType={iconType} />
        </button>)
}

interface InputAddonButtonProperties extends ButtonIconType {
    buttonType: 'danger' | 'secondary'
}