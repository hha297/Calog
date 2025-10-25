/**
 * Calog - Calorie Logging App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import './global.css';

import React, { useState } from 'react';
import { StatusBar, useColorScheme, View, ScrollView } from 'react-native';
import { CustomText } from './src/components/ui/CustomText';
import Input from './src/components/ui/Input';
import SearchInput from './src/components/ui/SearchInput';
import Dropdown from './src/components/ui/Dropdown';
import TextArea from './src/components/ui/TextArea';
import Checkbox from './src/components/ui/Checkbox';
import RadioButton from './src/components/ui/RadioButton';
import Switch from './src/components/ui/Switch';
import Avatar from './src/components/ui/Avatar';
import SplashScreen from './src/screens/SplashScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <SplashScreen onFinish={handleSplashFinish} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const dropdownOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  // State for interactive components
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioChecked, setRadioChecked] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [smallSwitchValue, setSmallSwitchValue] = useState(false);

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="pt-12 px-5 items-center">
        <CustomText
          size="4xl"
          weight="bold"
          color="text-white"
          className="mb-2"
        >
          Form Components
        </CustomText>
      </View>

      {/* Form Components Demo */}
      <ScrollView className="flex-1 px-5">
        {/* Search Inputs Section */}
        <View className="mb-8">
          <CustomText
            size="lg"
            weight="semibold"
            color="text-white"
            className="mb-4"
          >
            Search Inputs
          </CustomText>

          <SearchInput placeholder="Search..." />
          <SearchInput placeholder="Search..." />
        </View>

        {/* Inputs Section */}
        <View className="mb-8">
          <CustomText
            size="lg"
            weight="semibold"
            color="text-white"
            className="mb-4"
          >
            Inputs
          </CustomText>

          <Input label="First name here" placeholder="First name here" />

          <Input
            label="First name here"
            placeholder="First name here"
            value="John Doe"
          />

          <Input
            label="First name here"
            placeholder="First name here"
            errorMessage="Error message"
          />

          <Input
            label="First name here"
            placeholder="First name here"
            disabled
          />
        </View>

        {/* Dropdown Section */}
        <View className="mb-8">
          <CustomText
            size="lg"
            weight="semibold"
            color="text-white"
            className="mb-4"
          >
            Drop Down
          </CustomText>

          <Dropdown label="Text" placeholder="Text" options={dropdownOptions} />

          <Dropdown
            label="Text"
            placeholder="Text"
            options={dropdownOptions}
            value="option1"
          />

          <Dropdown
            label="Text"
            placeholder="Text"
            options={dropdownOptions}
            disabled
          />
        </View>

        {/* Text Areas Section */}
        <View className="mb-8">
          <CustomText
            size="lg"
            weight="semibold"
            color="text-white"
            className="mb-4"
          >
            Text Areas
          </CustomText>

          <TextArea label="Label" placeholder="Placeholder" />

          <TextArea
            label="Label"
            placeholder="Placeholder"
            value="This is some sample text content"
          />

          <TextArea
            label="Label"
            placeholder="Placeholder"
            errorMessage="Hint text"
          />

          <TextArea label="Label" placeholder="Placeholder" disabled />
        </View>

        {/* Checkboxes Section */}
        <View className="mb-8">
          <CustomText
            size="lg"
            weight="semibold"
            color="text-white"
            className="mb-4"
          >
            Checkboxes
          </CustomText>

          <View className="gap-4">
            <Checkbox
              checked={checkboxChecked}
              onPress={() => setCheckboxChecked(!checkboxChecked)}
            />
            <Checkbox checked={true} label="Label" />
            <Checkbox checked={false} label="Label" />
            <Checkbox checked={true} disabled />
          </View>
        </View>

        {/* Radio Buttons Section */}
        <View className="mb-8">
          <CustomText
            size="lg"
            weight="semibold"
            color="text-white"
            className="mb-4"
          >
            Radio Buttons
          </CustomText>

          <View className="gap-4">
            <RadioButton
              checked={radioChecked}
              onPress={() => setRadioChecked(!radioChecked)}
            />
            <RadioButton checked={true} label="Label" />
            <RadioButton checked={false} label="Label" />
            <RadioButton checked={true} disabled />
          </View>
        </View>

        {/* Switches Section */}
        <View className="mb-8">
          <CustomText
            size="lg"
            weight="semibold"
            color="text-white"
            className="mb-4"
          >
            Switches
          </CustomText>

          <View className="gap-4">
            <Switch value={switchValue} onValueChange={setSwitchValue} />
            <Switch value={true} label="Toggle" />
            <Switch value={false} label="Toggle" />
            <Switch value={true} disabled />
            <Switch
              value={smallSwitchValue}
              size="small"
              onValueChange={setSmallSwitchValue}
            />
            <Switch value={true} size="small" label="Toggle Small" />
            <Switch value={false} size="small" label="Toggle Small" />
          </View>
        </View>

        {/* Avatars Section */}
        <View className="mb-8">
          <CustomText
            size="lg"
            weight="semibold"
            color="text-white"
            className="mb-4"
          >
            Avatars
          </CustomText>

          <View className="gap-4">
            <Avatar
              source={{
                uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
              }}
              className="w-16 h-16"
              editable
              onEditPress={() => console.log('Edit avatar')}
            />
            <Avatar
              className="w-16 h-16"
              editable
              onEditPress={() => console.log('Edit avatar')}
            />
            <Avatar
              fallback="D"
              className="w-16 h-16"
              editable
              onEditPress={() => console.log('Edit avatar')}
            />
            <Avatar className="w-12 h-12" />
            <Avatar
              fallback="A"
              className="w-24 h-24"
              editable
              onEditPress={() => console.log('Edit avatar')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default App;
