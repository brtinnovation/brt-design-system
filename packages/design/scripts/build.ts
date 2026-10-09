import { mkdirSync, writeFileSync } from 'node:fs';
import { generateTokensCss } from '../src';

mkdirSync(new URL('../dist/', import.meta.url), { recursive: true });
writeFileSync(new URL('../dist/tokens.css', import.meta.url), generateTokensCss());
console.log('@brt-innovation/design: dist/tokens.css');
