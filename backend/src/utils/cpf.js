export function sanitizeCpf(cpf = '') {
  return String(cpf).replace(/\D/g, '');
}

export function isValidCpf(cpf) {
  const value = sanitizeCpf(cpf);
  if (value.length !== 11 || /^(\d)\1{10}$/.test(value)) return false;

  const digit = (length) => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) {
      sum += Number(value[index]) * (length + 1 - index);
    }
    const result = (sum * 10) % 11;
    return result === 10 ? 0 : result;
  };

  return digit(9) === Number(value[9]) && digit(10) === Number(value[10]);
}
