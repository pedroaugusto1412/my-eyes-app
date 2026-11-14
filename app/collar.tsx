// app/collar.tsx
import React, { useEffect, useState } from 'react';
import { Alert, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Heading, Card, AppButton, Field, Muted, Row, useColors, Pill } from '../src/components/UI';
import {
  getCollarStatus,
  setDistancia,
  setModoEspera,
} from '../src/services/collarService';
import { CollarStatus } from '../src/types';

export default function CollarScreen() {
  const c = useColors();
  const [status, setStatus] = useState<CollarStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [distancia, setDist] = useState('50');
  const [modoEspera, setModo] = useState(false);

  const carregar = async () => {
    setLoading(true);
    try {
      const s = await getCollarStatus();
      setStatus(s);
      setDist(String(s.distancia));
      setModo(s.modoEspera);
    } catch {
      Alert.alert('Coleira offline', 'Não foi possível ler o status. Verifique se o ESP32 está ligado e na mesma rede.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const salvarTudo = async () => {
    const d = parseInt(distancia, 10);
    if (isNaN(d)) {
      return Alert.alert('Valores inválidos', 'Preencha a distância com um número.');
    }
    if (d < 10 || d > 200) return Alert.alert('Distância inválida', 'Use entre 10 e 200 cm.');

    setSaving(true);
    try {
      await setDistancia(d);
      await setModoEspera(modoEspera);
      Alert.alert('Sucesso', 'Configurações de detecção enviadas para a coleira.');
    } catch {
      Alert.alert('Erro', 'Não foi possível enviar as configurações. Verifique a conexão.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <Heading title="Coleira" subtitle="Configurações do hardware em tempo real" />

      <Card style={{ backgroundColor: c.surfaceAlt, borderRadius: 28 }}>
        <Row>
          <Ionicons name={status ? 'wifi' : 'wifi-outline'} size={26} color={status ? c.success : c.muted} />
          <Text style={{ color: c.text, fontWeight: '900', fontSize: 17, flex: 1 }}>
            {loading ? 'Conectando...' : status ? 'Conectada' : 'Desconectada'}
          </Text>
          {status ? <Pill label="Online" /> : null}
        </Row>
        <Muted>
          {status
            ? `Distância: ${status.distancia} cm`
            : 'Toque em "Recarregar" para tentar novamente.'}
        </Muted>
        <AppButton title={loading ? 'Carregando...' : 'Recarregar status'} onPress={carregar} secondary />
      </Card>

      <Card>
        <Row>
          <Ionicons name="resize-outline" size={22} color={c.primary} />
          <Text style={{ color: c.text, fontWeight: '900', fontSize: 17, flex: 1 }}>Distância de detecção</Text>
        </Row>
        <Muted>O piezo apita quando um obstáculo estiver mais perto que este valor (10–200 cm).</Muted>
        <Field label="Distância (cm)" value={distancia} onChangeText={setDist} keyboardType="numeric" />
      </Card>

      <Card>
        <Row>
          <Ionicons name="moon-outline" size={22} color={c.primary} />
          <Text style={{ color: c.text, fontWeight: '900', fontSize: 17, flex: 1 }}>Modo espera</Text>
          <Switch value={modoEspera} onValueChange={setModo} trackColor={{ true: c.primary }} />
        </Row>
        <Muted>
          Quando ativado, o piezo só apita em obstáculos muito próximos (&lt; 20 cm). O monitoramento do MPU continua normalmente.
        </Muted>
      </Card>

      <AppButton title={saving ? 'Enviando...' : 'Salvar na coleira'} onPress={salvarTudo} />
    </Screen>
  );
}