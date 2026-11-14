import React from 'react';
import { Image, Text, View } from 'react-native';
import { useColors } from './UI';
export default function PetAvatar({ uri, size = 90 }: { uri: string | null; size?: number }) {
  const c = useColors();
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c.surfaceAlt, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: c.border }}>
    {uri ? <Image source={{ uri }} style={{ width: size, height: size }} /> : <Text style={{ fontSize: size * .42 }}>🐶</Text>}
  </View>;
}
