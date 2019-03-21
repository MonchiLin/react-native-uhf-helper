import React from "react";
import UHF from "react-native-uhf-helper";
import {View, Button, Text} from "react-native";

// 链接 android log-cat, 标签选择 kiki 即可
export default class RNUHFTest extends React.Component {
    state = {
        active: {}
    };

    componentWillMount(): void {
        UHF.initUHF();
    }

    render(): React.ReactNode {
        return (
            <View>
                <Button title={"start"} onPress={e => UHF.readerStart()}/>
                <Button color={"#b2ffaa"} title={"stop"} onPress={e => UHF.readerStop()}/>
            </View>
        );
    }
}
