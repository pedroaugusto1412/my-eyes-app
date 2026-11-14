// app/activity.tsx
import React, { useEffect, useMemo } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { StackedBarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Heading, Card, Muted, useColors, Pill, Row, AppButton } from '../src/components/UI';
import { useApp } from '../src/context/AppContext';
import { fetchActivityReport } from '../src/services/activityService';

const DEMO_HORAS = [
  { hora: 6, movimento: 12, parado: 48 },
  { hora: 9, movimento: 25, parado: 35 },
  { hora: 12, movimento: 18, parado: 42 },
  { hora: 15, movimento: 30, parado: 30 },
  { hora: 18, movimento: 22, parado: 38 },
  { hora: 21, movimento: 8, parado: 52 },
];

export default function ActivityScreen() {
  const { data, setDemoMode, activityReport, setActivityReport } = useApp();
  const c = useColors();
  // Aumentei um pouco a largura útil para o gráfico respirar melhor
  const width = Dimensions.get('window').width - 48;

  useEffect(() => {
    if (data.demoMode) return;
    const buscar = async () => {
      try {
        const report = await fetchActivityReport();
        setActivityReport(report);
      } catch (e) {
        console.log('Erro ao buscar atividade:', e);
      }
    };
    buscar();
    const interval = setInterval(buscar, 30000);
    return () => clearInterval(interval);
  }, [data.demoMode, setActivityReport]);

  // 1. Pega os dados (demo ou reais)
  const rawHoras = data.demoMode ? DEMO_HORAS : activityReport.horas;

  // 2. FILTRO MÁGICO: Remove horas onde o pet não ficou nem andando nem parado 
  // (ou seja, a coleira estava desligada). Isso limpa o eixo X!
  const horasFiltradas = rawHoras.filter(h => h.movimento > 0 || h.parado > 0);

  const resumo = useMemo(() => {
    let totalMov = 0;
    let totalParado = 0;
    let horaMaisAtiva = 0;
    let maxMov = 0;
    horasFiltradas.forEach((h) => {
      totalMov += h.movimento;
      totalParado += h.parado;
      if (h.movimento > maxMov) {
        maxMov = h.movimento;
        horaMaisAtiva = h.hora;
      }
    });
    return { totalMov, totalParado, horaMaisAtiva, maxMov };
  }, [horasFiltradas]);

  const formatarMin = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const labels = horasFiltradas.map((h) => `${String(h.hora).padStart(2, '0')}h`);

  return (
    <Screen>
      <Heading title="Atividade" subtitle="Movimento do seu pet ao longo do dia" />

      <Card style={{ backgroundColor: c.surfaceAlt, borderRadius: 28 }}>
        <Row>
          <Ionicons name={data.demoMode ? "flask-outline" : "pulse"} size={26} color={c.primary} />
          <Text style={{ color: c.text, fontWeight: '900', fontSize: 17, flex: 1 }}>
            {data.demoMode ? 'Modo demonstração' : horasFiltradas.length > 0 ? 'Monitorando' : 'Sem dados'}
          </Text>
          <Pill label={data.demoMode ? 'Simulado' : 'Real'} />
        </Row>
        <Muted>
          {data.demoMode
            ? 'Dados fictícios para testar o design.'
            : activityReport.ultima_atualizacao
              ? `Última atualização: ${new Date(activityReport.ultima_atualizacao).toLocaleTimeString('pt-BR')}`
              : 'Conecte a coleira para ver dados reais.'}
        </Muted>
        <AppButton 
          title={data.demoMode ? "Mudar para Dados Reais" : "Mudar para Simulação"} 
          onPress={() => setDemoMode(!data.demoMode)} 
          secondary 
        />
      </Card>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Card>
            <Muted>Em movimento</Muted>
            <Text style={{ color: c.text, fontSize: 20, fontWeight: '900' }}>
              {formatarMin(resumo.totalMov)}
            </Text>
            <Pill label={data.demoMode ? 'Simulado' : 'Real'} />
          </Card>
        </View>
        <View style={{ flex: 1 }}>
          <Card>
            <Muted>Parado</Muted>
            <Text style={{ color: c.text, fontSize: 20, fontWeight: '900' }}>
              {formatarMin(resumo.totalParado)}
            </Text>
            <Pill label={data.demoMode ? 'Simulado' : 'Real'} />
          </Card>
        </View>
      </View>

      {horasFiltradas.length > 0 ? (
        <>
          <Card>
            <Text style={{ color: c.text, fontWeight: '900', fontSize: 16 }}>
              Movimento por hora
            </Text>
            <Muted>Verde = movimento · Cinza = parado</Muted>
            
            <StackedBarChart
              data={{
                labels,
                legend: ['Movimento', 'Parado'],
                data: horasFiltradas.map((h) => [h.movimento, h.parado]),
                // Cor verde oficial e cor cinza/rosa claro para o parado
                barColors: [c.success, c.surfaceAlt], 
              }}
              width={width}
              height={260}
              fromZero
              hideLegend={false}
              chartConfig={{
                backgroundGradientFrom: c.surface,
                backgroundGradientTo: c.surface,
                decimalPlaces: 0,
                color: (o = 1) => c.primary + Math.round(o * 255).toString(16).padStart(2, '0'),
                labelColor: () => c.muted,
                propsForBackgroundLines: { stroke: c.border },
              }}
              // Ajuste fino na margem para não cortar os textos na borda
              style={{ borderRadius: 12, marginLeft: -12 }}
            />
          </Card>

          <Card>
            <Row>
              <Ionicons name="trophy-outline" size={22} color={c.primary} />
              <Text style={{ color: c.text, fontWeight: '900', fontSize: 16, flex: 1 }}>
                Hora mais ativa
              </Text>
            </Row>
            <Text style={{ color: c.text, fontSize: 22, fontWeight: '900' }}>
              {String(resumo.horaMaisAtiva).padStart(2, '0')}h
            </Text>
            <Muted>{formatarMin(resumo.maxMov)} em movimento nesse horário.</Muted>
          </Card>
        </>
      ) : (
        <Card>
          <Muted>Nenhum dado de atividade ainda. Ligue a coleira e movimente o sensor.</Muted>
        </Card>
      )}
    </Screen>
  );
}