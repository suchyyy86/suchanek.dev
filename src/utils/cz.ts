// Česká typografie: za jednopísmennou předložkou nebo spojkou patří pevná mezera,
// aby nezůstala viset na konci řádku („v Railsformers“, „a junior“).
export const cz = (text: string) =>
  text.replace(/(?<=^|[\s( ])([vszkaiouVSZKAIOU]) /g, '$1 ');
