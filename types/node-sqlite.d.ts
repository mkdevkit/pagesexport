declare module 'node:sqlite' {
  export class DatabaseSync {
    constructor(filename: string);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }

  export class StatementSync {
    all(...params: any[]): any[];
    get(...params: any[]): any | undefined;
    run(...params: any[]): { changes: number; lastInsertRowid: number };
  }

  export const constants: {
    SQLITE_CHANGESET_OMIT: number;
    SQLITE_CHANGESET_REPLACE: number;
    SQLITE_CHANGESET_ABORT: number;
    SQLITE_CHANGESET_DATA: number;
    SQLITE_CHANGESET_NOTFOUND: number;
    SQLITE_CHANGESET_CONFLICT: number;
    SQLITE_CHANGESET_CONSTRAINT: number;
    SQLITE_CHANGESET_FOREIGN_KEY: number;
    SQLITE_OK: number;
    SQLITE_DENY: number;
    SQLITE_IGNORE: number;
    SQLITE_CREATE_INDEX: number;
    SQLITE_CREATE_TABLE: number;
    SQLITE_CREATE_TEMP_INDEX: number;
    SQLITE_CREATE_TEMP_TABLE: number;
    SQLITE_CREATE_TEMP_TRIGGER: number;
    SQLITE_CREATE_TEMP_VIEW: number;
    SQLITE_CREATE_TRIGGER: number;
    SQLITE_CREATE_VIEW: number;
    SQLITE_DELETE: number;
    SQLITE_DROP_INDEX: number;
    SQLITE_DROP_TABLE: number;
    SQLITE_DROP_TEMP_INDEX: number;
    SQLITE_DROP_TEMP_TABLE: number;
    SQLITE_DROP_TEMP_TRIGGER: number;
    SQLITE_DROP_TEMP_VIEW: number;
    SQLITE_DROP_TRIGGER: number;
    SQLITE_DROP_VIEW: number;
    SQLITE_INSERT: number;
    SQLITE_PRAGMA: number;
    SQLITE_READ: number;
    SQLITE_SELECT: number;
    SQLITE_TRANSACTION: number;
    SQLITE_UPDATE: number;
    SQLITE_ATTACH: number;
    SQLITE_DETACH: number;
    SQLITE_ALTER_TABLE: number;
    SQLITE_REINDEX: number;
    SQLITE_ANALYZE: number;
    SQLITE_CREATE_VTABLE: number;
    SQLITE_DROP_VTABLE: number;
    SQLITE_FUNCTION: number;
    SQLITE_SAVEPOINT: number;
    SQLITE_COPY: number;
    SQLITE_RECURSIVE: number;
  };
}
