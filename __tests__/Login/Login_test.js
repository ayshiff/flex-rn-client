import React from "react";
import "isomorphic-fetch";
import { Image, View } from "react-native";
import enzyme, { shallow } from "enzyme";
import { expect } from "chai";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import LoginScreen from "../../Components/Login/LoginScreen";
import LoginButton from "../../Components/Login/components/LoginButton";

enzyme.configure({ adapter: new ReactSixteenAdapter() });

const navigation = { navigate: jest.fn(), popToTop: jest.fn() };

it("renders correctly", () => {
  const wrapper = shallow(<LoginScreen navigation={navigation} />);

  wrapper.logIn = jest.fn();
  wrapper.logOut = jest.fn();

  const onPressEvent = jest.fn();

  onPressEvent.mockReturnValue("Link on press invoked");

  // Simulate onPress event on LoginButton component

  wrapper
    .find(LoginButton)
    .first()
    .props()
    .onPress();

  expect(wrapper.find(Image)).to.have.length(1);
  expect(wrapper.find(View)).to.have.length(2);
});
