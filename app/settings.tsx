import React from 'react';
import { Alert, Switch, Text } from 'react-native';
import { Screen, Heading, Card, Muted, useColors } from '../src/components/UI';
import ThemeSelector from '../src/components/ThemeSelector';
import { useApp } from '../src/context/AppContext';

export default function SettingsScreen() {
  const { data, setTheme, setDemoMode } = useApp(); const c = useColors();
  return <Screen><Heading title="Configurações" subtitle="Aparência, dispositivo e privacidade dos dados" />
    <ThemeSelector selected={data.theme} onSelect={setTheme} />
    <Card><Text style={{ color: c.text, fontWeight: '800', fontSize: 17 }}>Modo de demonstração</Text><Switch value={data.demoMode} onValueChange={v => { setDemoMode(v); Alert.alert('Modo atualizado', v ? 'Dados ilustrativos serão identificados como simulados.' : 'O app aguardará dados reais do dispositivo.'); }} trackColor={{ true: c.primary }} /><Muted>Ativado: permite visualizar exemplos demonstrativos. Desativado: telas sem hardware conectado mostram que os dados estão indisponíveis.</Muted></Card>
    <Card><Text style={{ color: c.text, fontWeight: '800', fontSize: 17 }}>Integração com a coleira</Text><Muted>Status: desconectada. A conexão BLE real ainda não foi implementada porque o protocolo do firmware precisa ser definido.</Muted><Muted>Componentes considerados: XIAO ESP32C3, sensor de distância, MPU-6050 e alto-falante com circuito de acionamento adequado.</Muted><Muted>Não há GPS ou monitoramento cardíaco nesta versão.</Muted></Card>
    <Card><Text style={{ color: c.text, fontWeight: '800', fontSize: 17 }}>Dados locais</Text><Muted>Perfil, vacinas, lembretes, contato e tema são salvos localmente no dispositivo usando AsyncStorage.</Muted></Card>
  </Screen>;
}
