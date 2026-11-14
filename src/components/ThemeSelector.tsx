import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ThemeName } from '../types';
import { themes } from '../constants/themes';
import { Card, useColors } from './UI';
const names: ThemeName[] = ['rosa', 'escuro', 'claro', 'roxo', 'azul'];
export default function ThemeSelector({ selected, onSelect }: { selected: ThemeName; onSelect: (v: ThemeName) => void }) {
  const c = useColors();
  return <Card><Text style={{ color: c.text, fontWeight: '800', fontSize: 17 }}>Temas do aplicativo</Text>{names.map(name => <Pressable key={name} onPress={() => onSelect(name)} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 12, backgroundColor: selected === name ? c.surfaceAlt : 'transparent', gap: 10 }}><View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: themes[name].primary, borderWidth: 2, borderColor: themes[name].border }} /><Text style={{ flex: 1, color: c.text }}>{themes[name].label}</Text><Text style={{ color: c.primary, fontWeight: '800' }}>{selected === name ? '✓' : ''}</Text></Pressable>)}</Card>;
}
