import crypto from 'crypto';

export function hash(password: crypto.BinaryLike) {
  return crypto.createHash('sha256').update(password).digest('base64');
}

export function scorePassword(password: string) {
  let score = 0;
  if (!password) {
    return score;
  }

  // award every unique letter until 5 repetitions
  const letters = {};
  for (const letter of password) {
    letters[letter] = (letters[letter] || 0) + 1;
    score += 5 / letters[letter];
  }

  // bonus points for mixing it up
  const variations = {
    digits: /\d/.test(password),
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    nonWords: /\W/.test(password),
  };

  let variationCount = 0;
  for (const key of Object.keys(variations)) {
    variationCount += variations[key] === true ? 1 : 0;
  }

  score += (variationCount - 1) * 10;

  return Number.parseInt(score.toString(), 10);
}
