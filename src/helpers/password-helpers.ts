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
  for (let i = 0; i < password.length; i += 1) {
    letters[password[i]] = (letters[password[i]] || 0) + 1;
    score += 5.0 / letters[password[i]];
  }

  // bonus points for mixing it up
  const variations = {
    digits: /\d/.test(password),
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    nonWords: /\W/.test(password),
  };

  let variationCount = 0;
  Object.keys(variations).forEach((key) => {
    variationCount += (variations[key] === true) ? 1 : 0;
  });

  score += (variationCount - 1) * 10;

  return parseInt(score.toString(), 10);
}
