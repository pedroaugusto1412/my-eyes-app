// app/index.tsx
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Heading, Card, AppButton, Row, Muted, useColors } from '../src/components/UI';
import PetAvatar from '../src/components/PetAvatar';
import StatusCard from '../src/components/StatusCard';
import BatteryCard from '../src/components/BatteryCard';
import { useApp } from '../src/context/AppContext';
import { formatDate } from '../src/utils/date';
import { getCollarStatus } from '../src/services/collarService';

export default function Home() {
  const { data, activityReport } = useApp();
  const c = useColors();
  
  const [collarOnline, setCollarOnline] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkCollar = async () => {
      try {
        await getCollarStatus();
        if (isMounted) setCollarOnline(true);
      } catch {
        if (isMounted) setCollarOnline(false);
      }
    };
    
    checkCollar();
    const interval = setInterval(checkCollar, 15000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const next = data.reminders
    .filter(r => !r.completed && `${r.date}T${r.time}` >= new Date().toISOString().slice(0, 16))
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))[0];
  const unread = data.alerts.filter(a => !a.read).length;

  const activityText = data.demoMode
    ? 'Dados simulados'
    : (activityReport.horas.length > 0 ? 'Monitorando...' : 'Sem dados');

  const isDeviceConnected = collarOnline && !data.demoMode;
  const statusText = isDeviceConnected ? 'Online (ESP32)' : 'Desconectado';
  const statusNote = isDeviceConnected 
    ? 'Conexão Wi-Fi ativa e estável.' 
    : (data.demoMode ? 'Modo demonstração · coleira ainda não conectada' : 'Aguardando conexão com a coleira.');

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <Row>
          <Ionicons name="paw-outline" size={29} color={c.primary} />
          <View>
            <Text style={{ fontSize: 27, fontWeight: '900', letterSpacing: -0.7, color: c.text }}>My Eyes</Text>
            <Muted>Mais autonomia, mais liberdade.</Muted>
          </View>
        </Row>
        <Pressable onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={25} color={c.text} />
        </Pressable>
      </Row>

      <Card style={{ alignItems: 'center', backgroundColor: c.surfaceAlt, paddingVertical: 24, borderRadius: 30, borderColor: c.border }}>
        <Pressable onPress={() => router.push('/profile')}>
          <PetAvatar uri={data.pet.photoUri} size={112} />
        </Pressable>
        <Pressable onPress={() => router.push('/profile')}>
          <Text style={{ color: c.text, fontSize: 23, fontWeight: '800', marginTop: 4 }}>
            {data.pet.name || 'Meu pet'}
          </Text>
        </Pressable>
        <View style={{ backgroundColor: c.surface, borderColor: c.border, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 30 }}>
          <Row style={{ justifyContent: 'center' }}>
            <Ionicons name="heart-outline" size={15} color={c.primary} />
            <Muted style={{ textAlign: 'center' }}>
              Coleira inteligente · {data.demoMode ? 'Modo de demonstração' : 'Modo real'}
            </Muted>
          </Row>
        </View>
        <AppButton title="Editar perfil do pet" onPress={() => router.push('/profile')} secondary />
      </Card>

      <Heading title="Painel da coleira" subtitle="Tudo sobre o bem-estar do seu companheiro" />
      
      <StatusCard 
        title="Dispositivo" 
        value={statusText} 
        icon={isDeviceConnected ? "wifi" : "radio-outline"} 
        note={statusNote} 
      />
      
      {/* AQUI ESTÁ A MUDANÇA: Fixando a bateria em 100% */}
      <BatteryCard percent={100} />

      <Row>
        <View style={{ flex: 1 }}>
          <StatusCard title="Alertas não lidos" value={String(unread)} icon="notifications-outline" note="Ver central de alertas" />
        </View>
        <View style={{ flex: 1 }}>
          <StatusCard title="Atividade" value={activityText} icon="walk-outline" note="Resumo do movimento" />
        </View>
      </Row>

      <Card style={{ borderRadius: 25 }}>
        <Row>
          <Ionicons name="calendar-outline" size={21} color={c.primary} />
          <Text style={{ color: c.text, fontWeight: '800', fontSize: 17 }}>Próximo compromisso</Text>
        </Row>
        {next ? (
          <>
            <Text style={{ color: c.text }}>{next.title}</Text>
            <Muted>{formatDate(next.date)} às {next.time}</Muted>
          </>
        ) : (
          <Muted>Nenhum compromisso futuro cadastrado.</Muted>
        )}
        <AppButton title="Gerenciar lembretes" onPress={() => router.push('/profile')} secondary />
      </Card>

      <Card style={{ borderRadius: 25 }}>
        <Row>
          <Ionicons name="grid-outline" size={21} color={c.primary} />
          <Text style={{ color: c.text, fontWeight: '800', fontSize: 17 }}>Acesso rápido</Text>
        </Row>
        <Row>
          <View style={{ flex: 1 }}>
            <AppButton title="Coleira" onPress={() => router.push('/collar')} />
          </View>
          <View style={{ flex: 1 }}>
            <AppButton title="Áudio" onPress={() => router.push('/audio')} secondary />
          </View>
        </Row>
        <Row>
          <View style={{ flex: 1 }}>
            <AppButton title="Atividade" onPress={() => router.push('/activity')} secondary />
          </View>
          <View style={{ flex: 1 }}>
            <AppButton title={`Alertas${unread ? ` (${unread})` : ''}`} onPress={() => router.push('/alerts')} secondary />
          </View>
        </Row>
      </Card>

      <View style={{ alignItems: 'center', paddingVertical: 8 }}>
        <Row>
          <Ionicons name="heart" size={14} color={c.primary} />
          <Muted>Mais que uma coleira, um companheiro de jornada.</Muted>
        </Row>
      </View>
    </Screen>
  );
}