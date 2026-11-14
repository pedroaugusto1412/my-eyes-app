import { ThemeName } from '../types';

export const themes: Record<ThemeName, { label: string; background: string; surface: string; surfaceAlt: string; text: string; muted: string; primary: string; primaryText: string; border: string; success: string; warning: string; danger: string }> = {
  rosa: { label: 'Rosa', background: '#FFF6FA', surface: '#FFFFFF', surfaceAlt: '#FFE7F1', text: '#382633', muted: '#8A7180', primary: '#E84D96', primaryText: '#FFFFFF', border: '#F4D1E2', success: '#2DBB83', warning: '#E99B45', danger: '#E05270' },
  escuro: { label: 'Escuro', background: '#101827', surface: '#1D293B', surfaceAlt: '#26364D', text: '#F6F4FA', muted: '#B4C0D0', primary: '#E85A9D', primaryText: '#FFFFFF', border: '#34445B', success: '#4CD49A', warning: '#F7B65E', danger: '#FF718B' },
  claro: { label: 'Claro', background: '#F6F9FC', surface: '#FFFFFF', surfaceAlt: '#EAF1F8', text: '#1F3042', muted: '#63768A', primary: '#56A7E8', primaryText: '#FFFFFF', border: '#D7E3EF', success: '#2DBB83', warning: '#E99B45', danger: '#E05270' },
  roxo: { label: 'Roxo', background: '#F7F0FF', surface: '#FFFFFF', surfaceAlt: '#EDE0FF', text: '#302044', muted: '#79668E', primary: '#8A4DE8', primaryText: '#FFFFFF', border: '#DFCCFA', success: '#2DBB83', warning: '#E99B45', danger: '#E05270' },
  azul: { label: 'Azul', background: '#EAF9FF', surface: '#FFFFFF', surfaceAlt: '#D4F2FF', text: '#12334A', muted: '#567789', primary: '#009FD6', primaryText: '#FFFFFF', border: '#BCE7F6', success: '#20AD7B', warning: '#E99B45', danger: '#E05270' }
};
