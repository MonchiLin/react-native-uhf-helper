import {NativeModules, NativeEventEmitter} from "react-native";

const {UHF} = NativeModules;
const eventEmitter = new NativeEventEmitter(UHF);

export default {
    readerStart: UHF.readerStart as (...args: any) => void,
    readerStop: UHF.readerStop as () => void,
    initUHF: UHF.initUHF as () => void,
    addListener: (listener: (...args: any) => any) =>
        eventEmitter.addListener("reader", listener)
};
