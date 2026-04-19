import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
  autoFocus?: boolean;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  leftIcon,
  rightIcon,
  style,
  testID,
  autoFocus = false,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    Animated.spring(borderAnim, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  }, [borderAnim]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    Animated.spring(borderAnim, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  }, [borderAnim]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, Colors.primary],
  });

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View
        style={[
          styles.inputContainer,
          { borderColor: error ? Colors.error : borderColor },
          disabled && styles.disabledContainer,
          multiline && { minHeight: numberOfLines * 24 + 32 },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            !!leftIcon && styles.inputWithLeftIcon,
            (!!rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            multiline && styles.multilineInput,
            disabled && styles.disabledInput,
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !showPassword}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          testID={testID}
          autoFocus={autoFocus}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color={Colors.textTertiary} />
            ) : (
              <Eye size={20} color={Colors.textTertiary} />
            )}
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </Animated.View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  leftIcon: {
    paddingLeft: 16,
  },
  rightIcon: {
    paddingRight: 16,
  },
  disabledContainer: {
    backgroundColor: Colors.surfaceSecondary,
  },
  disabledInput: {
    color: Colors.textTertiary,
  },
  error: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
});
