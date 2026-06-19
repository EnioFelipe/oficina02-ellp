import { isValidCpf, sanitizeCpf } from '../src/utils/cpf.js';

describe('sanitizeCpf', () => {
  test('remove pontuacao e mantem apenas digitos', () => {
    expect(sanitizeCpf('111.444.777-35')).toBe('11144477735');
  });

  test('aceita entrada vazia sem quebrar', () => {
    expect(sanitizeCpf()).toBe('');
    expect(sanitizeCpf(null)).toBe('');
  });
});

describe('isValidCpf', () => {
  test.each([
    '111.444.777-35',
    '11144477735',
    '529.982.247-25'
  ])('aceita CPF valido %s', (cpf) => {
    expect(isValidCpf(cpf)).toBe(true);
  });

  test.each([
    ['digito verificador errado', '11144477734'],
    ['todos os digitos iguais', '11111111111'],
    ['tamanho invalido', '123456789'],
    ['vazio', '']
  ])('rejeita CPF invalido (%s)', (_scenario, cpf) => {
    expect(isValidCpf(cpf)).toBe(false);
  });
});
