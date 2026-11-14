// app/audio.tsx
import React, { useState, useEffect } from 'react';
import { Text, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Heading, Card, AppButton, Field, Muted, Row, useColors, Pill } from '../src/components/UI';
import { useApp } from '../src/context/AppContext';
import { MAX_SAFE_COLLAR_VOLUME } from '../src/services/audio';
import { setPiezo, setLimiarInatividade, getCollarStatus } from '../src/services/collarService';

export default function AudioScreen() {
  const c = useColors();
  const { data, setCollarVolume } = useApp();

  const [frequencia, setFrequencia] = useState('1000');
  const [limiar, setLimiar] = useState('30');
  const [saving, setSaving] = useState(false);

  // Carrega as configs atuais do ESP32 ao abrir a tela
  useEffect(() => {
    getCollarStatus().then((s) => {
      setFrequencia(String(s.freq));
      setLimiar(String(s.limiarInatividade));
    }).catch(() => {});
  }, []);

  const handleVolumeChange = (text: string) => {
    const num = parseInt(text.replace(/\D/g, ''), 10);
    if (isNaN(num)) {
      setCollarVolume(0);
      return;
    }
    setCollarVolume(num);
  };

  const handleSalvar = async () => {
    const freq = parseInt(frequencia, 10);
    const l = parseInt(limiar, 10);

    if (isNaN(freq) || freq < 200 || freq > 3000) {
      Alert.alert('Frequência Inválida', 'Use um valor entre 200 Hz e 3000 Hz.');
      return;
    }
    if (isNaN(l) || l < 1 || l > 1440) {
      Alert.alert('Limiar Inválido', 'Use um valor entre 1 e 1440 minutos.');
      return;
    }

    setSaving(true);
    try {
      await setPiezo(freq, data.collarVolume);
      await setLimiarInatividade(l);
      Alert.alert('Sucesso', 'Configurações de áudio e alerta enviadas para a coleira.');
    } catch {
      Alert.alert('Erro', 'Não foi possível enviar as configurações para o ESP32.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <Heading
        title="Áudio e Alertas"
        subtitle="Controle de som e notificações de segurança."
      />

      <Card style={{ backgroundColor: c.surfaceAlt, borderRadius: 28, paddingVertical: 20 }}>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <View style={{ width: 68, height: 68, borderRadius: 24, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: c.border }}>
            <Ionicons name="shield-checkmark" size={31} color={c.primary} />
          </View>
          <Text style={{ color: c.text, fontSize: 19, fontWeight: '900', textAlign: 'center' }}>
            Proteção Auditiva Canina
          </Text>
          <Muted style={{ textAlign: 'center', lineHeight: 19 }}>
            Os áudios usam frequências seguras e o volume possui limite máximo de {MAX_SAFE_COLLAR_VOLUME}% para proteger a audição do cão.
          </Muted>
        </View>
      </Card>

      <Card>
        <Row>
          <Ionicons name="options-outline" size={24} color={c.primary} />
          <Text style={{ color: c.text, fontWeight: '900', fontSize: 17, flex: 1 }}>
            Configuração do Piezo
          </Text>
        </Row>
        
        <Field
          label="Frequência do Som (Hz)"
          value={frequencia}
          onChangeText={setFrequencia}
          keyboardType="numeric"
          placeholder="Ex: 1000"
        />
        
        <Row style={{ justifyContent: 'space-between', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <AppButton title="Grave (400 Hz)" onPress={() => setFrequencia('400')} secondary />
          </View>
          <View style={{ flex: 1 }}>
            <AppButton title="Médio (1000 Hz)" onPress={() => setFrequencia('1000')} secondary />
          </View>
          <View style={{ flex: 1 }}>
            <AppButton title="Agudo (2000 Hz)" onPress={() => setFrequencia('2000')} secondary />
          </View>
        </Row>

        <View style={{ height: 1, backgroundColor: c.border, marginVertical: 10 }} />

        <Row style={{ flexWrap: 'wrap' }}>
          <Ionicons name="volume-medium-outline" size={24} color={c.primary} />
          <Text style={{ color: c.text, fontWeight: '900', fontSize: 17, flex: 1 }}>
            Volume
          </Text>
          <Pill label={`Máx: ${MAX_SAFE_COLLAR_VOLUME}%`} color={c.surfaceAlt} />
        </Row>

        <Field
          label={`Volume configurado: ${data.collarVolume}%`}
          value={String(data.collarVolume)}
          onChangeText={handleVolumeChange}
          keyboardType="numeric"
          placeholder={`0 a ${MAX_SAFE_COLLAR_VOLUME}`}
        />

        <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <AppButton title="Mín (20%)" onPress={() => setCollarVolume(20)} secondary />
          </View>
          <View style={{ flex: 1 }}>
            <AppButton title="Médio (40%)" onPress={() => setCollarVolume(40)} secondary />
          </View>
          <View style={{ flex: 1 }}>
            <AppButton title={`Máx (${MAX_SAFE_COLLAR_VOLUME}%)`} onPress={() => setCollarVolume(MAX_SAFE_COLLAR_VOLUME)} />
          </View>
        </View>
      </Card>

      <Card>
        <Row>
          <Ionicons name="alert-circle-outline" size={22} color={c.primary} />
          <Text style={{ color: c.text, fontWeight: '900', fontSize: 17, flex: 1 }}>Alerta de inatividade</Text>
        </Row>
        <Muted>
          Se o cão ficar parado por mais tempo que este limiar, o aplicativo enviará uma notificação push para você (quando o servidor estiver ativo).
        </Muted>
        <Field label="Limiar (minutos)" value={limiar} onChangeText={setLimiar} keyboardType="numeric" />
      </Card>

      <AppButton title={saving ? 'Enviando...' : 'Salvar alterações na coleira'} onPress={handleSalvar} />
    </Screen>
  );
}