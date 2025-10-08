import React from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolateColor } from 'react-native-reanimated';

interface SwitcherProps {
        value: boolean;
        onValueChange: (value: boolean) => void;
        disabled?: boolean;
}

export const Switcher: React.FC<SwitcherProps> = ({ value, onValueChange, disabled = false }) => {
        const animatedValue = useSharedValue(value ? 1 : 0);

        React.useEffect(() => {
                animatedValue.value = withSpring(value ? 1 : 0, {
                        damping: 15,
                        stiffness: 150,
                });
        }, [value, animatedValue]);

        const trackWidth = 40;
        const trackHeight = 16;
        const thumbSize = 20;

        const trackStyle = useAnimatedStyle(() => {
                const backgroundColor = interpolateColor(
                        animatedValue.value,
                        [0, 1],
                        ['#E8E8E8', '#4CAF50'], // White when OFF, Green when ON
                );

                return {
                        backgroundColor,
                        width: trackWidth,
                        height: trackHeight,
                };
        });

        const thumbStyle = useAnimatedStyle(() => {
                const backgroundColor = interpolateColor(
                        animatedValue.value,
                        [0, 1],
                        ['#4CAF50', '#FFFFFF'], // Green when OFF, White when ON
                );

                const translateX = animatedValue.value * (trackWidth - thumbSize);
                const translateY = (trackHeight - thumbSize) / 2; // Center vertically

                return {
                        backgroundColor,
                        width: thumbSize,
                        height: thumbSize,
                        transform: [{ translateX }, { translateY }],
                };
        });

        const handlePress = () => {
                if (!disabled) {
                        onValueChange(!value);
                }
        };

        return (
                <TouchableOpacity
                        onPress={handlePress}
                        disabled={disabled}
                        activeOpacity={0.7}
                        className="items-center justify-center"
                >
                        <Animated.View
                                style={[
                                        trackStyle,
                                        {
                                                borderRadius: trackHeight / 2,
                                                opacity: disabled ? 0.5 : 1,
                                                position: 'relative',
                                                overflow: 'visible',
                                        },
                                ]}
                        >
                                <Animated.View
                                        style={[
                                                thumbStyle,
                                                {
                                                        position: 'absolute',
                                                        borderRadius: thumbSize / 2,
                                                        shadowColor: '#000',
                                                        shadowOffset: {
                                                                width: 0,
                                                                height: 2,
                                                        },
                                                        shadowOpacity: 0.25,
                                                        shadowRadius: 3.84,
                                                        elevation: 5,
                                                },
                                        ]}
                                />
                        </Animated.View>
                </TouchableOpacity>
        );
};
