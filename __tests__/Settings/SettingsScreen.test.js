import "react-native-permissions";
import React from "react";
import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import { ScrollView } from "react-native";
import "react-native-qrcode-scanner";
import Adapter from "enzyme-adapter-react-16";
import SettingsScreen from "../../Components/Settings/SettingsScreen";
import DeconnectionButton from "../../Components/Settings/components/DeconnectionButton";

Enzyme.configure({ adapter: new Adapter() });

const navigation = { navigate: jest.fn(), popToTop: jest.fn() };

it("renders correctly", () => {
  const wrapper = shallow(<SettingsScreen navigation={navigation} />);

  const onPressEvent = jest.fn();

  onPressEvent.mockReturnValue("Link on press invoked");

  // Simulate onPress event on ManualInsertionCard component

  wrapper
    .find(DeconnectionButton)
    .first()
    .props()
    .onPress();

  expect(wrapper.find(ScrollView)).to.have.length(1);
});