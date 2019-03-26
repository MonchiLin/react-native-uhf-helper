import {NativeModules, NativeEventEmitter} from "react-native";

const {UHF} = NativeModules;
const eventEmitter = new NativeEventEmitter(UHF);

type UHFOptions = {
    interval?: number,
}

type InitUHF = (options: UHFOptions) => void
type ReaderStart = () => void
type ReaderStop = () => void
type GetCurrentState = () => boolean
type AddListener = (cb: (args: any[]) => void) => void

export const initUHF: InitUHF = (options = {}) => UHF.initUHF(options);
export const readerStart: ReaderStart = UHF.readerStart;
export const readerStop: ReaderStop = UHF.readerStop;
export const getCurrentState: GetCurrentState = UHF.getCurrentState;
export const addListener: AddListener = (listener) =>
    eventEmitter.addListener("reader", listener);


