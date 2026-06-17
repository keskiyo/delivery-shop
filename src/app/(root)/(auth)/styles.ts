export const buttonStyles = {
	base: 'w-65 h-13 my-5 mx-auto text-2xl rounded cursor-pointer  transition-custom',
	active: 'bg-promo text-white hover:shadow-article rounded active:shadow-button-active',
	inactive: 'bg-promo text-white opacity-60 cursor-not-allowed',
}

export const formStyles = {
	label: 'text-base text-muted-foreground block',
	input: 'w-65 h-10 py-2 px-4 text-foreground bg-input text-base border border-border rounded focus:border-brand focus:shadow-button-default focus:bg-input focus:outline-none caret-brand placeholder:text-muted-foreground',
	loginLink:
		'mb-10 mx-auto h-8 text-brand hover:text-white active:text-white border-1 border-brand bg-card hover:bg-brand active:shadow-button-default w-30 rounded flex items-center justify-center transition-custom',
	radioLabel: 'px-4 py-2 border rounded-lg cursor-pointer transition-colors',
	radioLabelActive: 'bg-brand text-white border-brand',
}

export const verificationButtonStyles = `
    w-60 md:w-80 group relative flex flex-col items-center justify-center p-3
    border-2 border-border rounded-xl hover:border-promo
    hover:shadow-article active:shadow-button-active
    cursor-pointer transition-custom
  `

export const iconContainerStyles = `
    p-3 mb-4 rounded-full bg-promo-soft
    group-hover:bg-promo transition-custom
  `

export const profileStyles = {
	editButton: `${buttonStyles.active} [&&]:w-full [&&]:md:w-auto px-4 py-2 rounded items-center justify-center font-medium transition-custom cursor-pointer flex flex-row gap-x-3`,
	cancelButton:
		'px-4 py-2 md:flex-none flex-1 bg-site-chrome rounded hover:shadow-button-secondary active:shadow-button-active text-white transition-custom cursor-pointer',
	saveButton:
		'px-4 py-2 md:flex-none flex-1 bg-brand hover:shadow-button-default active:shadow-button-active rounded text-white transition-custom disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
	sectionTitle: 'text-lg font-semibold w-20',
	inputContainer: 'relative',
}
