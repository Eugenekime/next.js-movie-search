export default function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  const cutText: string[] = [];
  const words = text.split(' ');

  for (let i = 0; i < words.length; i++) {
    if ((cutText.join(' ') + ' ' + words[i]).length > maxLength) {
      return cutText.join(' ').replace(/[,.]$/, '') + '...';
    }

    cutText.push(words[i]);
  }
  return cutText.join(' ');
}
