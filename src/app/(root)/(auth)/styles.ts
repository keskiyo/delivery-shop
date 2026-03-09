export const buttonStyles = {
	base: 'w-50 h-12 my-5 mx-auto text-base rounded cursor-pointer transition-all duration-200 hover:bg-orange-100',
	active: 'bg-[#ff6633] text-white hover:shadow-(--shadow-article) active:shadow-(--shadow-button-active)',
	inactive: 'bg-[#fcd5ba] text-[#ff6633]',
}

export const formStyles = {
	label: 'text-base text-[#8f8f8f] block',
	input: 'w-65 h-10 py-2 px-4 text-[#414141] bg-white text-base border border-[#bfbfbf] rounded focus:border-[#70c05b] focus:shadow-(--shadow-button-default) focus:bg-white focus:outline-none caret-[#70c05b]',
	loginLink:
		'mb-10 mx-auto h-8 text-[#70c05b] hover:text-white active:text-white border-1 border-[#70c05b] bg-white hover:bg-[#70c05b] active:shadow-(--shadow-button-default) w-30 rounded flex items-center justify-center duration-300',
	radioLabel: 'px-4 py-2 border rounded-lg cursor-pointer transition-colors',
	radioLabelActive: 'bg-blue-500 text-white border-blue-500',
}
