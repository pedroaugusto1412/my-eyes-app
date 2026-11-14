import React from 'react';
import { Alert, Switch, Text } from 'react-native';
import { Screen, Heading, Card, Muted, useColors } from '../src/components/UI';
import AlertCard from '../src/components/AlertCard';
import { useApp } from '../src/context/AppContext';

export default function AlertsScreen() {
  const { data, markAlertRead, deleteAlert, setNotificationsEnabled } = useApp(); const c = useColors();
  return <Screen><Heading title="Alertas" subtitle="Notificações e histórico de eventos" />
    <Card><Text style={{ color: c.text, fontWeight: '800', fontSize: 17 }}>Notificações</Text><Text style={{ color: c.text }}>Permitir lembretes locais</Text><Switch value={data.notificationsEnabled} onValueChange={setNotificationsEnabled} trackColor={{ true: c.primary }} /><Muted>Isso controla a preferência do aplicativo. A permissão do sistema também precisa estar habilitada.</Muted></Card>
    <Card><Text style={{ color: c.text, fontWeight: '800', fontSize: 17 }}>Histórico de alertas</Text>{data.alerts.length === 0 ? <Muted>Nenhum alerta registrado.</Muted> : data.alerts.map(a => <AlertCard key={a.id} alert={a} onRead={() => markAlertRead(a.id)} onDelete={() => Alert.alert('Excluir alerta?', 'Esta ação não pode ser desfeita.', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Excluir', style: 'destructive', onPress: () => deleteAlert(a.id) }])} />)}</Card>
    <Muted>Alertas de obstáculo e movimento só serão reais quando houver dados válidos do hardware. O aplicativo não garante a detecção de todos os obstáculos.</Muted>
  </Screen>;
}
