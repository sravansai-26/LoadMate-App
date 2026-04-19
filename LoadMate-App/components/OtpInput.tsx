import React, { useState, useRef, useEffect } from 'react';
import { TextInput, StyleSheet, Animated, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  error?: boolean;
}

export const OtpInput = function OtpInput({
  length = 6,
  value,
  onChange,
  autoFocus = true,
  error = false,
}: OtpInputProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Trigger shake animation and haptics on error
  useEffect(() => {
    if (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [error]);

  const handleChange = (text: string, index: number) => {
    // Clean input to only allow digits
    const cleanedText = text.replace(/[^0-9]/g, '');
    const newValue = value.split('');
    
    // Handle Paste logic: if more than 1 digit is entered
    if (cleanedText.length > 1) {
      const pastedText = cleanedText.slice(0, length);
      onChange(pastedText);
      const nextIdx = Math.min(pastedText.length, length - 1);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    // Standard single-digit entry
    newValue[index] = cleanedText;
    const finalValue = newValue.join('');
    
    // Only trigger parent change if the value actually changed to prevent loops
    if (finalValue !== value) {
      onChange(finalValue);
    }

    // Move to next box if digit was entered
    if (cleanedText && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Backspace logic: move to previous box and clear it
    if (e.nativeEvent.key === 'Backspace') {
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newValue = value.split('');
        newValue[index - 1] = '';
        onChange(newValue.join(''));
      }
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: shakeAnim }] }]}>
      {Array.from({ length }, (_, index) => (
        <TextInput
          key={index}
          ref={(ref) => { inputRefs.current[index] = ref; }}
          style={[
            styles.input,
            focusedIndex === index && styles.inputFocused,
            error && styles.inputError,
            value[index] && styles.inputFilled,
          ]}
          // First box allows multiple digits to support pasting
          maxLength={index === 0 ? length : 1}
          keyboardType="number-pad"
          value={value[index] || ''}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onFocus={() => setFocusedIndex(index)}
          autoFocus={autoFocus && index === 0}
          textContentType="oneTimeCode" // Suggests code from SMS on iOS
          selectTextOnFocus
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 10 
  },
  input: { 
    width: 45, 
    height: 55, 
    borderWidth: 2, 
    borderColor: Colors.border, 
    borderRadius: 12, 
    fontSize: 22, 
    fontWeight: '700', 
    textAlign: 'center', 
    color: Colors.text, 
    backgroundColor: Colors.surface 
  },
  inputFocused: { 
    borderColor: Colors.primary 
  },
  inputFilled: { 
    borderColor: Colors.primary, 
    backgroundColor: Colors.primary + '08' // Subtle fill color
  },
  inputError: { 
    borderColor: Colors.error,
    backgroundColor: Colors.error + '05'
  },
});