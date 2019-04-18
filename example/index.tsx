import React from "react";
import UHF, {supportUHF} from "../lib/js";
import {View, Button, Text, FlatList} from "react-native";

// 链接 android log-cat, 标签选择 kiki 即可
export default class RNUHFTest extends React.Component {
    state = {
        tags: [],
        support: true
    };

    async componentWillMount(): Promise<void> {
        const support = await supportUHF();

        if (!support) {
            this.setState({support: support});
            return;
        }

        UHF.initUHF();

        UHF.addListener((res: number[]) => {
            if (res.length === 0) {
                return;
            }
            this.setState({tags: [...this.state.tags, res[0]]});
        });
    }

    render(): React.ReactNode {
        const {support} = this.state;

        if (!support) {
            return <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text>Your device does not support NFC</Text>
            </View>;
        }

        return (
            <View>
                <Button title={"start"}
                        onPress={e => UHF.readerStart()}/>
                <Button color={"#b2ffaa"} title={"stop"}
                        onPress={e => UHF.readerStop()}/>
                <FlatList
                    data={this.state.tags}
                    renderItem={(tag) => <Text key={tag.index}>{tag.item}</Text>}/>
            </View>
        );
    }
}
