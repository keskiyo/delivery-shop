// Назначение: React-хук redux.
// Как работает: Инкапсулирует состояние, эффекты и обработчики, чтобы компоненты не дублировали эту логику.

import { AppDispatch, AppStore, RootState } from '@/store/redux'
import { useDispatch, useSelector, useStore } from 'react-redux'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()
