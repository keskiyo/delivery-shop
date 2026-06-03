// Назначение: типизированные Redux-хуки приложения.
// Как работает: Оборачивает useDispatch и useSelector типами store, чтобы компоненты не дублировали типизацию.

import { AppDispatch, AppStore, RootState } from '@/store/redux'
import { useDispatch, useSelector, useStore } from 'react-redux'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()
