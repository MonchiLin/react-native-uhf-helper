import {NativeModules, NativeEventEmitter} from "react-native";

const {UHFModule} = NativeModules;
const eventEmitter = new NativeEventEmitter(UHFModule);

type UHFOptions = {
    interval?: number,
}

type InitUHF = (options?: UHFOptions) => void
type ReaderStart = () => void
type ReaderStop = () => void
type GetCurrentState = () => boolean
type AddListener = (cb: (args: any[]) => void) => void

export const initUHF: InitUHF = (options = {}) => UHFModule.initUHF(options);
export const supportUHF: () => Promise<boolean> = UHFModule.supportUHF;
export const readerStart: ReaderStart = UHFModule.readerStart;
export const readerStop: ReaderStop = UHFModule.readerStop;
export const getCurrentState: GetCurrentState = UHFModule.getCurrentState;
export const addListener: AddListener = (listener) =>
    eventEmitter.addListener("reader", listener);

export default {
    initUHF,
    supportUHF,
    readerStart,
    readerStop,
    getCurrentState,
    addListener,
};
