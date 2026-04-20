/**
 * Проверяет валидность пароля
 * 
 * Требования к паролю:
 * - Минимум 6 символов
 * - Хотя бы одна строчная буква (a-z)
 * - Хотя бы одна заглавная буква (A-Z)
 * - Хотя бы одна цифра (0-9)
 * 
 * @param pass - Пароль для проверки
 * @returns true если пароль валиден, false если нет
 * 
 * @example
 * isPasswordValid('Pass123')   // true
 * isPasswordValid('password')  // false (нет заглавной буквы и цифры)
 * isPasswordValid('PASS123')   // false (нет строчной буквы)
 * isPasswordValid('Pass')      // false (меньше 6 символов)
 */
export const isPasswordValid = (pass: string) => {
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(pass)
}
