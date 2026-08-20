import initSqlJs, { type Database, type SqlJsStatic } from "sql.js";
import sqlWasmUrl from "sql.js/dist/sql-wasm.wasm?url";
import { get, set } from "idb-keyval";
import schemaSql from "./schema.sql?raw";
import type { ContractFormData, ContractItem, ContractRecord, ExcludedItem } from "@/types/contract";

const DB_STORAGE_KEY = "difestas-contracts-db";

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;
let initPromise: Promise<void> | null = null;

/** Inicializa o sql.js e carrega o banco salvo no IndexedDB (ou cria um novo). */
export function initDb(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    SQL = await initSqlJs({ locateFile: () => sqlWasmUrl });
    const saved = await get<Uint8Array>(DB_STORAGE_KEY);
    db = saved && saved.byteLength > 0 ? new SQL.Database(saved) : new SQL.Database();
    db.run(schemaSql);
    migrateSchema(db);
    await persist();
  })();

  return initPromise;
}

/**
 * `CREATE TABLE IF NOT EXISTS` não adiciona colunas novas a uma tabela já
 * existente (ex.: banco salvo antes de um campo novo ser criado). Como não
 * há framework de migração aqui, colunas novas entram via ALTER TABLE,
 * ignorando o erro quando a coluna já existe.
 */
function migrateSchema(database: Database): void {
  try {
    database.run(`ALTER TABLE contracts ADD COLUMN generate_attachments INTEGER NOT NULL DEFAULT 0`);
  } catch {
    // coluna já existe — banco criado com o schema atual.
  }
}

function getDb(): Database {
  if (!db) {
    throw new Error("Banco de dados ainda não foi inicializado (chame initDb() antes).");
  }
  return db;
}

async function persist(): Promise<void> {
  const data = getDb().export();
  await set(DB_STORAGE_KEY, data);
}

function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback simples caso crypto.randomUUID não esteja disponível.
  return `ctr_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

const COLUMNS = [
  "client_name",
  "client_cpf",
  "client_rg",
  "client_nationality",
  "client_marital_status",
  "client_address",
  "client_city_uf",
  "client_cep",
  "client_phone",
  "client_email",
  "event_type",
  "event_theme",
  "event_date",
  "event_start_time",
  "event_end_time",
  "event_location",
  "included_items",
  "excluded_items",
  "total_value",
  "total_value_extenso",
  "down_payment",
  "down_payment_percent",
  "balance_value",
  "balance_due_date",
  "payment_method",
  "down_payment_date",
  "payment_proof_reference",
  "image_authorization",
  "signature_city",
  "contract_date",
  "observations",
  "generate_attachments",
] as const;

function toRowValues(data: ContractFormData): (string | number | null)[] {
  return [
    data.clientName || null,
    data.clientCpf || null,
    data.clientRg || null,
    data.clientNationality || null,
    data.clientMaritalStatus || null,
    data.clientAddress || null,
    data.clientCityUf || null,
    data.clientCep || null,
    data.clientPhone || null,
    data.clientEmail || null,
    data.eventType || null,
    data.eventTheme || null,
    data.eventDate || null,
    data.eventStartTime || null,
    data.eventEndTime || null,
    data.eventLocation || null,
    JSON.stringify(data.includedItems || []),
    JSON.stringify(data.excludedItems || []),
    data.totalValue ?? null,
    data.totalValueExtenso || null,
    data.downPayment ?? null,
    data.downPaymentPercent ?? null,
    data.balanceValue ?? null,
    data.balanceDueDate || null,
    data.paymentMethod || null,
    data.downPaymentDate || null,
    data.paymentProofReference || null,
    data.imageAuthorization === null || data.imageAuthorization === undefined
      ? null
      : data.imageAuthorization
        ? 1
        : 0,
    data.signatureCity || null,
    data.contractDate || null,
    data.observations || null,
    data.generateAttachments ? 1 : 0,
  ];
}

function safeParseArray<T>(raw: unknown): T[] {
  if (typeof raw !== "string") return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function str(value: unknown): string {
  return value === null || value === undefined ? "" : String(value);
}

function num(value: unknown): number | null {
  return value === null || value === undefined ? null : Number(value);
}

function rowToRecord(row: Record<string, unknown>): ContractRecord {
  return {
    id: String(row.id),
    clientName: str(row.client_name),
    clientCpf: str(row.client_cpf),
    clientRg: str(row.client_rg),
    clientNationality: str(row.client_nationality),
    clientMaritalStatus: str(row.client_marital_status),
    clientAddress: str(row.client_address),
    clientCityUf: str(row.client_city_uf),
    clientCep: str(row.client_cep),
    clientPhone: str(row.client_phone),
    clientEmail: str(row.client_email),
    eventType: str(row.event_type),
    eventTheme: str(row.event_theme),
    eventDate: str(row.event_date),
    eventStartTime: str(row.event_start_time),
    eventEndTime: str(row.event_end_time),
    eventLocation: str(row.event_location),
    includedItems: safeParseArray<ContractItem>(row.included_items),
    excludedItems: safeParseArray<ExcludedItem>(row.excluded_items),
    totalValue: num(row.total_value),
    totalValueExtenso: str(row.total_value_extenso),
    downPayment: num(row.down_payment),
    downPaymentPercent: num(row.down_payment_percent),
    balanceValue: num(row.balance_value),
    balanceDueDate: str(row.balance_due_date),
    paymentMethod: str(row.payment_method),
    downPaymentDate: str(row.down_payment_date),
    paymentProofReference: str(row.payment_proof_reference),
    imageAuthorization: row.image_authorization === null ? null : Boolean(row.image_authorization),
    signatureCity: str(row.signature_city),
    contractDate: str(row.contract_date),
    observations: str(row.observations),
    generateAttachments: Boolean(row.generate_attachments),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function queryAll(sql: string, params: (string | number | null)[] = []): Record<string, unknown>[] {
  const database = getDb();
  const stmt = database.prepare(sql);
  const rows: Record<string, unknown>[] = [];
  try {
    stmt.bind(params);
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
  } finally {
    stmt.free();
  }
  return rows;
}

export function listContracts(search?: string): ContractRecord[] {
  const term = search?.trim();
  const rows = term
    ? queryAll(
        `SELECT * FROM contracts
         WHERE client_name LIKE ? OR event_type LIKE ? OR event_location LIKE ?
         ORDER BY updated_at DESC`,
        [`%${term}%`, `%${term}%`, `%${term}%`]
      )
    : queryAll(`SELECT * FROM contracts ORDER BY updated_at DESC`);
  return rows.map(rowToRecord);
}

export function getContract(id: string): ContractRecord | null {
  const rows = queryAll(`SELECT * FROM contracts WHERE id = ?`, [id]);
  return rows.length > 0 ? rowToRecord(rows[0]!) : null;
}

export async function createContract(data: ContractFormData): Promise<ContractRecord> {
  const database = getDb();
  const id = genId();
  const now = new Date().toISOString();
  database.run(
    `INSERT INTO contracts (id, ${COLUMNS.join(", ")}, created_at, updated_at)
     VALUES (?, ${COLUMNS.map(() => "?").join(", ")}, ?, ?)`,
    [id, ...toRowValues(data), now, now]
  );
  await persist();
  const created = getContract(id);
  if (!created) throw new Error("Falha ao criar o contrato.");
  return created;
}

export async function updateContract(id: string, data: ContractFormData): Promise<ContractRecord> {
  const database = getDb();
  const now = new Date().toISOString();
  database.run(
    `UPDATE contracts SET ${COLUMNS.map((c) => `${c} = ?`).join(", ")}, updated_at = ? WHERE id = ?`,
    [...toRowValues(data), now, id]
  );
  await persist();
  const updated = getContract(id);
  if (!updated) throw new Error("Contrato não encontrado após atualização.");
  return updated;
}

export async function deleteContract(id: string): Promise<void> {
  getDb().run(`DELETE FROM contracts WHERE id = ?`, [id]);
  await persist();
}

/** Exporta o banco inteiro como bytes (.sqlite) para backup manual. */
export function exportDatabaseFile(): Uint8Array {
  return getDb().export();
}

/** Substitui o banco atual pelos bytes de um arquivo .sqlite importado. */
export async function importDatabaseFile(bytes: Uint8Array): Promise<void> {
  if (!SQL) throw new Error("sql.js ainda não foi inicializado.");
  const imported = new SQL.Database(bytes);
  // Garante que a tabela exista mesmo que o arquivo importado seja de uma versão antiga.
  imported.run(schemaSql);
  db = imported;
  await persist();
}
