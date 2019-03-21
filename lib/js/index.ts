import {NativeModules, NativeEventEmitter} from "react-native";

const {UHF} = NativeModules;
const eventEmitter = new NativeEventEmitter(UHF);

type UHFOptions = {
    interval?: number,
}

const initWrapped = (options: UHFOptions = {}) => UHF.initUHF(options);

export default {
    readerStart: UHF.readerStart as () => void,
    readerStop: UHF.readerStop as () => void,
    initUHF: initWrapped,
    addListener: (listener: (...args: any) => any) =>
        eventEmitter.addListener("reader", listener)
};
