import React from "react";
import UHF from "react-native-uhf-helper";
import {View, Button, Text, FlatList} from "react-native";

// 链接 android log-cat, 标签选择 kiki 即可
export default class RNUHFTest extends React.Component {
    state = {
        tags: []
    };

    componentWillMount(): void {
        UHF.initUHF();
        UHF.addListener((res: number[]) => {
            if (res.length === 0) {
                return;
            }
            this.setState({tags: [...this.state.tags, res[0]]});
        });
    }

    render(): React.ReactNode {
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
