import React from 'react';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, AppButton, Muted, Row, useColors } from './UI';
import { SoundItem } from '../services/audio';
export default function AudioCard({ sound, onPlay }: { sound: SoundItem; onPlay: () => void }) {
  const c = useColors();
  return <Card><Row><Ionicons name="play-circle-outline" size={25} color={c.primary} /><Text style={{ flex: 1, color: c.text, fontWeight: '700' }}>{sound.title}</Text></Row><Muted>{sound.description}</Muted><AppButton title={sound.available ? 'Reproduzir no celular' : 'Configurar arquivo de áudio'} onPress={onPlay} secondary={!sound.available} /></Card>;
}
