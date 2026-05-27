export const GlobalStyles = () => {
	return (
		<style jsx global>{`
			@keyframes slideIn {
				from {
					opacity: 0;
					transform: translateX(30px);
				}
				to {
					opacity: 1;
					transform: translateX(0);
				}
			}

			.animate-slideIn {
				animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
				opacity: 0;
			}
		`}</style>
	)
}
