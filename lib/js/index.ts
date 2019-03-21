import {NativeModules, NativeEventEmitter} from "react-native";

const {UHF} = NativeModules;
const eventEmitter = new NativeEventEmitter(UHF);

export const readerStart = UHF.readerStart;
export const readerStop = UHF.readerStop;
export const initUHF = UHF.initUHF;

export default {
    readerStart: UHF.readerStart,
    readerStop: UHF.readerStop,
    initUHF: UHF.initUHF,
    addListener: (listener) =>
        eventEmitter.addListener("reader", listener)
};
