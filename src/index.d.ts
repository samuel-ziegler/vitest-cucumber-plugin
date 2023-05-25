type GherkinDataType =
  | 'int'
  | 'float'
  | 'double'
  | 'word'
  | 'string'
  | 'bigdecimal'
  | 'biginteger'
  | 'byte'
  | 'short'
  | 'long'
  // anonymous
  | '';

type GherkinDataTypeToType<T extends GherkinDataType> = {
  int: number;
  float: number;
  double: number;
  word: string;
  string: string;
  bigdecimal: string;
  biginteger: bigint;
  byte: number;
  short: number;
  long: number;
  '': string;
}[T];

type UnwrapType<
  T extends string,
  S extends GherkinDataType[]
> = T extends `${string}{${infer U extends GherkinDataType}`
  ? [...S, GherkinDataTypeToType<U>]
  : S;

type _Match<
  T extends string,
  S extends GherkinDataType[]
> = T extends `${infer U}}${infer W}`
  ? _Match<W, UnwrapType<U, S>>
  : UnwrapType<T, S>;

type Match<T extends string> = _Match<T, []>;

type DocTextOrDataTable = string | string[][];

// Steps

export function Given<State, Pattern extends string>(pattern: Pattern, fn: (state: State, args: Match<Pattern>, data?: DocTextOrDataTable) => State | Promise<State>): void;
export function When<State, Pattern extends string>(pattern: Pattern, fn: (state: State, args: Match<Pattern>, data?: DocTextOrDataTable) => State | Promise<State>): void;
export function Then<State, Pattern extends string>(pattern: Pattern, fn: (state: State, args: Match<Pattern>, data?: DocTextOrDataTable) => State | Promise<State>): void;

// Utils

export function DataTable(data: string[][]): Record<string, string>[];

// Hooks

export function BeforeAll<State>(fn: () => State | Promise<State>): void;
export function BeforeAll<State>(name: string, fn: () => State | Promise<State>): void;
export function BeforeAll<State>(options: {name: string}, fn: () => State | Promise<State>): void;
export function Before<State>(fn: () => State | Promise<State>): void;
export function Before<State>(name: string, fn: () => State | Promise<State>): void;
export function Before<State>(options: {name: string}, fn: () => State | Promise<State>): void;
export function BeforeStep<State>(fn: () => State | Promise<State>): void;
export function BeforeStep<State>(name: string, fn: () => State | Promise<State>): void;
export function BeforeStep<State>(options: {name: string}, fn: () => State | Promise<State>): void;
export function AfterAll<State>(fn: () => State | Promise<State>): void;
export function AfterAll<State>(name: string, fn: () => State | Promise<State>): void;
export function AfterAll<State>(options: {name: string}, fn: () => State | Promise<State>): void;
export function After<State>(fn: () => State | Promise<State>): void;
export function After<State>(name: string, fn: () => State | Promise<State>): void;
export function After<State>(options: {name: string}, fn: () => State | Promise<State>): void;
export function AfterStep<State>(fn: () => State | Promise<State>): void;
export function AfterStep<State>(name: string, fn: () => State | Promise<State>): void;
export function AfterStep<State>(options: {name: string}, fn: () => State | Promise<State>): void;

// Vitest plugin

interface Plugin {
  name: string;
  configResolved(config: any): void;
  transform(src: string, id: string): Promise<void | string>;
}

export default function vitestCucumberPlugin(): Plugin;
