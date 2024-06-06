import { useDispatch, useSelector } from 'react-redux';
import {RootState} from "../../store";
// import {AppDispatch, RootState} from "../../store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
// export const useAppSelector = useSelector();
// export const useAppStore = useStore.withTypes<AppStore>()

// export const useAppSelector = useSelector();