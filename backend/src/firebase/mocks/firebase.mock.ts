import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

/**
 * A robust mock for firebase-admin to allow local development without real credentials.
 * Implements the minimal set of methods used by the Hermes backend.
 */
class DocumentSnapshotMock {
  constructor(public id: string, private dataObj: any) {}
  get exists() { return !!this.dataObj; }
  data() { return this.dataObj; }
}

class QuerySnapshotMock {
  constructor(public docs: DocumentSnapshotMock[]) {}
}

class DocumentReferenceMock {
  constructor(private collectionPath: string, public id: string, private db: any) {}

  async get() {
    const data = this.db.getData(this.collectionPath, this.id);
    return new DocumentSnapshotMock(this.id, data);
  }

  async update(data: any) {
    this.db.updateData(this.collectionPath, this.id, data);
    return { writeTime: new Date() };
  }

  async set(data: any) {
    this.db.setData(this.collectionPath, this.id, data);
    return { writeTime: new Date() };
  }
}

class CollectionReferenceMock {
  constructor(private path: string, private db: any) {}

  doc(id?: string) {
    const docId = id || Math.random().toString(36).substring(7);
    return new DocumentReferenceMock(this.path, docId, this.db);
  }

  async add(data: any) {
    const id = Math.random().toString(36).substring(7);
    this.db.setData(this.path, id, data);
    return new DocumentReferenceMock(this.path, id, this.db);
  }

  where(field: string, op: string, value: any) {
    return new QueryMock(this.path, this.db, [{ field, op, value }]);
  }

  orderBy() { return this; }
  limit() { return this; }
  
  async get() {
    const all = this.db.getAll(this.path);
    return new QuerySnapshotMock(all.map((item: any) => new DocumentSnapshotMock(item.id, item.data)));
  }
}

class QueryMock {
  constructor(private path: string, private db: any, private filters: any[]) {}

  where(field: string, op: string, value: any) {
    this.filters.push({ field, op, value });
    return this;
  }

  orderBy() { return this; }
  limit() { return this; }

  async get() {
    let all = this.db.getAll(this.path);
    
    for (const filter of this.filters) {
      all = all.filter((item: any) => {
        const val = item.data[filter.field];
        if (filter.op === '==') return val === filter.value;
        if (filter.op === 'in') return Array.isArray(filter.value) && filter.value.includes(val);
        return true;
      });
    }

    return new QuerySnapshotMock(all.map((item: any) => new DocumentSnapshotMock(item.id, item.data)));
  }
}

@Injectable()
export class FirebaseMock {
  private storage: Record<string, Record<string, any>> = {
    'users': {
      'admin-123': { uid: 'admin-123', email: 'admin@hermes.dev', role: 'ADMIN', tenantId: 'hermes-dev', name: 'Admin User' }
    },
    'change_requests': {
      'rfc-demo-1': { 
        id: 'RFC-2026-001', 
        title: 'Atualização de Certificado SSL', 
        description: 'Renovação do certificado SSL do proxy reverso.',
        status: 'SUBMITTED',
        riskLevel: 'LOW',
        tenantId: 'hermes-dev',
        requesterId: 'admin-123',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    },
    'notifications': {}
  };

  getData(collection: string, id: string) {
    return this.storage[collection]?.[id];
  }

  getAll(collection: string) {
    const col = this.storage[collection] || {};
    return Object.entries(col).map(([id, data]) => ({ id, data }));
  }

  setData(collection: string, id: string, data: any) {
    if (!this.storage[collection]) this.storage[collection] = {};
    this.storage[collection][id] = { ...data, updatedAt: new Date() };
  }

  updateData(collection: string, id: string, data: any) {
    if (this.storage[collection]?.[id]) {
      this.storage[collection][id] = { ...this.storage[collection][id], ...data, updatedAt: new Date() };
    }
  }

  firestore() {
    return {
      collection: (path: string) => new CollectionReferenceMock(path, this),
    };
  }

  auth() {
    return {
      verifyIdToken: async (token: string) => {
        if (token === 'dev-token' || token.startsWith('dummy')) {
          return {
            uid: 'admin-123',
            email: 'admin@hermes.dev',
            role: 'ADMIN',
            tenantId: 'hermes-dev'
          };
        }
        throw new Error('Invalid token in Mock mode');
      }
    };
  }
}

// Global serverTimestamp mock
(admin.firestore.FieldValue as any).serverTimestamp = () => new Date();
