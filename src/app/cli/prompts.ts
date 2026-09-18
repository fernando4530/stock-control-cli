export interface PromptIO {
  ask(question: string): Promise<string>;
}

export async function askRequired(io: PromptIO, question: string): Promise<string> {
  const answer = (await io.ask(question)).trim();
  if (!answer) throw new Error('El valor no puede estar vacío.');
  return answer;
}

export async function askInteger(io: PromptIO, question: string): Promise<number> {
  const answer = await askRequired(io, question);
  const value = Number(answer);
  if (!Number.isInteger(value)) throw new Error('El valor debe ser un número entero.');
  return value;
}