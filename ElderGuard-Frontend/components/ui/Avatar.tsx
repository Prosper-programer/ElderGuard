import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, StatusColors } from '@/constants/theme';
import type { StatusType } from '@/constants/theme';

interface AvatarProps {
  /** Full name — initials are extracted automatically */
  name: string;
  /** Size in px */
  size?: number;
  /** Optional image URL or required asset */
  imageUrl?: any;
  /** Optional status dot overlay */
  statusIndicator?: StatusType;
  style?: ViewStyle;
}

export function Avatar({
  name,
  size = 44,
  imageUrl,
  statusIndicator,
  style,
}: AvatarProps) {
  const initials = getInitials(name);
  const fontSize = size * 0.38;
  const dotSize = Math.max(10, size * 0.25);

  return (
    <View style={[{ width: size, height: size }, style]}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        {imageUrl ? (
          <Image
            source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
            style={{ width: size, height: size, borderRadius: size / 2 }}
            resizeMode="cover"
          />
        ) : (
          <Text
            style={[
              Typography.bodySemiBold,
              {
                fontSize,
                lineHeight: fontSize * 1.2,
                color: Colors.primary,
              },
            ]}
          >
            {initials}
          </Text>
        )}
      </View>

      {statusIndicator && (
        <View
          style={[
            styles.statusDot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: StatusColors[statusIndicator].color,
              borderWidth: 2,
              borderColor: Colors.white,
              bottom: -1,
              right: -1,
            },
          ]}
        />
      )}
    </View>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: Colors.primaryFadedMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    position: 'absolute',
  },
});
