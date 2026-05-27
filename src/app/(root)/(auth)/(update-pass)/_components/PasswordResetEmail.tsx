import {
	Body,
	Button,
	Container,
	Head,
	Hr,
	Html,
	Section,
	Tailwind,
	Text,
} from 'react-email'

interface ResetPasswordProps {
	username: string
	resetUrl: string
}

const PasswordResetEmail = (props: ResetPasswordProps) => {
	const { username, resetUrl } = props
	return (
		<Html lang='ru' dir='ltr'>
			<Tailwind>
				<Head />
				<Body className='bg-[#f3f1ea] font-sans py-4 px-2'>
					<Container className='bg-[#fffefa] rounded-md p-6 max-w-145 mx-auto'>
						<Section>
							<Text className='text-xl font-bold text-[#232820] mb-4 mt-0'>
								Восстановление / сброс пароля
							</Text>

							<Text className='text-base text-[#3f493b] mb-4 mt-0 leading-5'>
								Здравствуйте, {username}! Мы получили запрос на
								сброс пароля для вашего аккаунта. Для создания
								нового пароля нажмите на кнопку ниже.
							</Text>

							<Section className='text-center mb-6'>
								<Button
									href={resetUrl}
									className='bg-[#4f9a3d] text-white px-6 py-2 rounded text-base font-medium no-underline'
								>
									Сбросить пароль
								</Button>
							</Section>

							<Text className='text-sm text-[#5a6554] mb-4 mt-0 leading-5'>
								Если кнопка не работает, скопируйте и вставьте
								эту ссылку в адресную строку браузера:
								<br />
								<span className='break-all'>{resetUrl}</span>
							</Text>

							<Text className='text-sm text-[#5a6554] mb-6 mt-0 leading-5'>
								Ссылка для сброса пароля будет активна в течение
								24 часов. Если Вы не запрашивали сброс пароля,
								пожалуйста, проигнорируйте это письмо или
								свяжитесь со службой поддержки.
							</Text>

							<Hr className='border-[#ddd8cd] my-4' />

							<Text className='text-xs text-[#6e7768] m-0 leading-4'>
								С уважением,
								<br />
								Команда &quot;Фудмаркета&quot;
							</Text>
						</Section>

						<Section className='mt-6 pt-4 border-t border-[#ddd8cd]'>
							<Text className='text-xs text-[#858d7f] m-0 text-center leading-4'>
								Фудмаркет
								<br />
								Россия, Архангельск, ул. Ленина, д.1
								<br />
								ИНН 0291234567890
							</Text>

							<Text className='text-xs text-[#858d7f] m-0 text-center mt-2 leading-4'>
								© {new Date().getFullYear()} Фудмаркет. Все
								права защищены.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

export default PasswordResetEmail
