import React, { useEffect, useState } from 'react';
import { Alert, Image, Linking, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Screen, Heading, Card, AppButton, Field, Muted, Row, useColors } from '../src/components/UI';
import PetAvatar from '../src/components/PetAvatar';
import ReminderCard from '../src/components/ReminderCard';
import { useApp } from '../src/context/AppContext';
import { PetProfile, Vaccine, Reminder, ReminderCategory } from '../src/types';
import { calculateAge, formatDate } from '../src/utils/date';
import { isValidDate, isValidPhone, isNonEmpty } from '../src/utils/validation';

const categories: ReminderCategory[] = ['Consulta veterinária','Vacinação','Passeio','Comprar ração','Comprar petiscos','Banho e tosa','Medicamentos','Outro'];
const blankVaccine = (): Vaccine => ({ id: String(Date.now()), name: '', appliedAt: '', nextDose: '', notes: '' });
const blankReminder = (): Reminder => ({ id: String(Date.now()), title: '', category: 'Outro', date: '', time: '09:00', description: '', completed: false, notify: true });

export default function ProfileScreen() {
  const { data, updatePet, updateVet, addVaccine, updateVaccine, deleteVaccine, addReminder, updateReminder, deleteReminder, toggleReminder } = useApp(); const c = useColors();
  const [pet, setPet] = useState<PetProfile>(data.pet); const [vet, setVet] = useState(data.vet);
  const [vaccine, setVaccine] = useState<Vaccine | null>(null); const [reminder, setReminder] = useState<Reminder | null>(null);
  useEffect(() => { setPet(data.pet); setVet(data.vet); }, [data.pet, data.vet]);
  const choosePhoto = async (camera = false) => {
    try {
      if (camera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) return Alert.alert('Permissão necessária', 'Autorize a câmera nas configurações do celular.');
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return Alert.alert('Permissão necessária', 'Autorize o acesso às fotos nas configurações do celular.');
      }
      const result = camera ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1,1], quality: 0.8 }) : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1,1], quality: 0.8 });
      if (!result.canceled && result.assets[0]) setPet(p => ({ ...p, photoUri: result.assets[0].uri }));
    } catch { Alert.alert('Foto', 'Não foi possível abrir a câmera ou galeria.'); }
  };
  const savePet = () => {
    if (pet.birthDate && !isValidDate(pet.birthDate)) return Alert.alert('Data inválida', 'Use o formato AAAA-MM-DD.');
    if (pet.birthDate && new Date(`${pet.birthDate}T12:00:00`) > new Date()) return Alert.alert('Data inválida', 'A data de nascimento não pode ser futura.');
    updatePet(pet); Alert.alert('Perfil salvo', 'As informações do pet foram atualizadas.');
  };
  const saveVet = () => {
    if (vet.phone && !isValidPhone(vet.phone)) return Alert.alert('Telefone inválido', 'Informe um número de telefone válido.');
    updateVet(vet); Alert.alert('Contato salvo', 'Contato veterinário atualizado.');
  };
  const saveVaccine = () => {
    if (!vaccine || !isNonEmpty(vaccine.name) || !isValidDate(vaccine.appliedAt)) return Alert.alert('Dados incompletos', 'Informe o nome da vacina e a data aplicada no formato AAAA-MM-DD.');
    if (data.vaccines.some(item => item.id === vaccine.id)) updateVaccine(vaccine); else addVaccine(vaccine);
    setVaccine(null);
  };
  const saveReminder = async () => {
    if (!reminder || !isNonEmpty(reminder.title) || !isValidDate(reminder.date) || !/^\d{2}:\d{2}$/.test(reminder.time)) return Alert.alert('Dados incompletos', 'Informe título, data (AAAA-MM-DD) e horário (HH:MM).');
    if (data.reminders.some(x => x.id === reminder.id)) await updateReminder(reminder); else await addReminder(reminder); setReminder(null);
  };
  const callVet = async () => {
    const phone = vet.phone.replace(/[^\d+]/g, '');
    if (!phone) return Alert.alert('Telefone não cadastrado', 'Salve o telefone do veterinário primeiro.');
    const url = `tel:${phone}`;
    if (await Linking.canOpenURL(url)) Linking.openURL(url); else Alert.alert('Discador indisponível', 'Não foi possível abrir o discador neste dispositivo.');
  };
  return <Screen><Heading title="Perfil do Pet" subtitle="Informações, saúde e compromissos" />
    <Card style={{ alignItems: 'center', paddingVertical: 22, backgroundColor: c.surfaceAlt }}><PetAvatar uri={pet.photoUri} size={116} /><Row style={{ justifyContent: 'center', flexWrap: 'wrap' }}><AppButton title="📷  Trocar foto" onPress={() => choosePhoto(false)} secondary /><AppButton title="Tirar foto" onPress={() => choosePhoto(true)} secondary /></Row><Text style={{ color: c.text, fontSize: 18, fontWeight: '800' }}>{pet.name || 'Meu pet'}</Text><Muted>Idade: {calculateAge(pet.birthDate)}</Muted></Card>
    <Card><Text style={{ color: c.text, fontWeight: '800', fontSize: 18 }}>Dados do pet</Text>
      <Field label="Nome do pet *" value={pet.name} onChangeText={v => setPet(p => ({ ...p, name: v }))} />
      <Field label="Data de nascimento (AAAA-MM-DD)" value={pet.birthDate} onChangeText={v => setPet(p => ({ ...p, birthDate: v }))} placeholder="2020-04-15" />
      <Field label="Sexo (opcional)" value={pet.sex} onChangeText={v => setPet(p => ({ ...p, sex: v }))} placeholder="Fêmea, macho..." />
      <Field label="Raça (opcional)" value={pet.breed} onChangeText={v => setPet(p => ({ ...p, breed: v }))} />
      <Field label="Peso (opcional)" value={pet.weight} onChangeText={v => setPet(p => ({ ...p, weight: v }))} placeholder="Ex.: 6,2 kg" />
      <Field label="Alergias" value={pet.allergies} onChangeText={v => setPet(p => ({ ...p, allergies: v }))} multiline />
      <Field label="Observações importantes" value={pet.notes} onChangeText={v => setPet(p => ({ ...p, notes: v }))} multiline />
      <AppButton title="Salvar perfil" onPress={savePet} /><AppButton title="Cancelar alterações" onPress={() => setPet(data.pet)} secondary />
    </Card>
    <Card><Text style={{ color: c.text, fontWeight: '800', fontSize: 18 }}>Carteira de vacinação</Text>
      {data.vaccines.map(v => <View key={v.id} style={{ padding: 12, backgroundColor: c.surfaceAlt, borderRadius: 12, gap: 5 }}><Text style={{ color: c.text, fontWeight: '800' }}>{v.name}</Text><Muted>Aplicada: {formatDate(v.appliedAt)} · Próxima dose: {formatDate(v.nextDose || '')}</Muted>{v.notes ? <Muted>{v.notes}</Muted> : null}<Row><Text onPress={() => setVaccine({ ...v })} style={{ color: c.primary, fontWeight: '700' }}>Editar</Text><Text onPress={() => Alert.alert('Excluir vacina?', 'Deseja excluir este registro?', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Excluir', style: 'destructive', onPress: () => deleteVaccine(v.id) }])} style={{ color: c.danger, fontWeight: '700' }}>Excluir registro</Text></Row></View>)}
      {data.vaccines.length === 0 ? <Muted>Nenhuma vacina cadastrada.</Muted> : null}
      {vaccine ? <><Field label="Nome da vacina *" value={vaccine.name} onChangeText={v => setVaccine(x => x ? ({ ...x, name: v }) : x)} /><Field label="Data aplicada (AAAA-MM-DD) *" value={vaccine.appliedAt} onChangeText={v => setVaccine(x => x ? ({ ...x, appliedAt: v }) : x)} /><Field label="Próxima dose (AAAA-MM-DD)" value={vaccine.nextDose || ''} onChangeText={v => setVaccine(x => x ? ({ ...x, nextDose: v }) : x)} /><Field label="Observações" value={vaccine.notes || ''} onChangeText={v => setVaccine(x => x ? ({ ...x, notes: v }) : x)} /><AppButton title="Salvar vacina" onPress={saveVaccine} /><AppButton title="Cancelar" onPress={() => setVaccine(null)} secondary /></> : <AppButton title="+ Adicionar vacina" onPress={() => setVaccine(blankVaccine())} /> }
    </Card>
    <Card><Text style={{ color: c.text, fontWeight: '800', fontSize: 18 }}>Lembretes e compromissos</Text>
      {data.reminders.map(r => <ReminderCard key={r.id} reminder={r} onToggle={() => toggleReminder(r.id)} onEdit={() => setReminder({ ...r })} onDelete={() => Alert.alert('Excluir lembrete?', 'A notificação agendada também será cancelada.', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Excluir', style: 'destructive', onPress: () => deleteReminder(r.id) }])} />)}
      {data.reminders.length === 0 ? <Muted>Nenhum lembrete cadastrado.</Muted> : null}
      {reminder ? <><Field label="Título *" value={reminder.title} onChangeText={v => setReminder(r => r ? ({ ...r, title: v }) : r)} /><Text style={{ color: c.text, fontWeight: '600' }}>Categoria (toque para alternar)</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>{categories.map(cat => <Text key={cat} onPress={() => setReminder(r => r ? ({ ...r, category: cat }) : r)} style={{ padding: 8, borderRadius: 12, overflow: 'hidden', color: c.text, backgroundColor: reminder.category === cat ? c.surfaceAlt : c.surface, borderWidth: 1, borderColor: c.border }}>{cat}</Text>)}</View><Field label="Data (AAAA-MM-DD) *" value={reminder.date} onChangeText={v => setReminder(r => r ? ({ ...r, date: v }) : r)} placeholder="2026-12-24" /><Field label="Horário (HH:MM) *" value={reminder.time} onChangeText={v => setReminder(r => r ? ({ ...r, time: v }) : r)} placeholder="09:30" /><Field label="Descrição" value={reminder.description} onChangeText={v => setReminder(r => r ? ({ ...r, description: v }) : r)} multiline /><Text onPress={() => setReminder(r => r ? ({ ...r, notify: !r.notify }) : r)} style={{ color: c.text }}>Notificação local: {reminder.notify ? 'Ativada ✓' : 'Desativada'} (toque para alternar)</Text><AppButton title="Salvar lembrete" onPress={saveReminder} /><AppButton title="Cancelar" onPress={() => setReminder(null)} secondary /></> : <AppButton title="+ Novo lembrete" onPress={() => setReminder(blankReminder())} /> }
    </Card>
    <Card><Text style={{ color: c.text, fontWeight: '800', fontSize: 18 }}>Contato do veterinário</Text><Field label="Nome do veterinário" value={vet.name} onChangeText={v => setVet(x => ({ ...x, name: v }))} /><Field label="Clínica" value={vet.clinic} onChangeText={v => setVet(x => ({ ...x, clinic: v }))} /><Field label="Telefone" value={vet.phone} onChangeText={v => setVet(x => ({ ...x, phone: v }))} keyboardType="phone-pad" /><Field label="Observações" value={vet.notes} onChangeText={v => setVet(x => ({ ...x, notes: v }))} multiline /><AppButton title="Salvar contato" onPress={saveVet} /><AppButton title="Ligar para o veterinário" onPress={callVet} secondary /></Card>
  </Screen>;
}
