import { atomWithStorage } from 'jotai/utils';

import type { TTodos } from '@/lib/types';

export const todosAtom = atomWithStorage<TTodos>('react-todos', []);
